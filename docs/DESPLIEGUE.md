# Guía de despliegue — Terraform + GitHub Actions + Azure App Service

Resultado final:

| Ambiente | URL | Plan | Cuándo se despliega |
|---|---|---|---|
| **dev** | https://casa-reserva-akora-dev.azurewebsites.net | B1 (~13 USD/mes) | Automático en cada push/merge a `main` |
| **prod** | https://casa-reserva-akora.azurewebsites.net | B1 (~13 USD/mes) | Después de dev, **con tu aprobación** |

```
Pull Request ──► CI: pruebas servidor + cliente, build, npm audit,
                     terraform fmt/validate, terraform plan (dev) comentado en el PR
merge a main ──► CD: build + paquete (una sola vez)
                     └─► dev:  terraform apply → deploy zip → smoke test (/health con el commit)
                          └─► prod: ⏸ aprobación → terraform apply → deploy → smoke test
```

Autenticación GitHub → Azure con **OIDC (credenciales federadas)**: no hay secretos ni
contraseñas guardadas en GitHub. Cada ambiente tiene su propia identidad administrada, que solo
es *Contributor* de su resource group y solo escribe en su contenedor de estado de Terraform.
La identidad de prod solo la puede usar un job que corra en el environment `prod` (el que
requiere tu aprobación).

---

## Estructura agregada al repositorio

```
app.js                          # App Express (exportable para pruebas)
server.js                       # Solo arranca el servidor
test/app.test.js                # Pruebas del servidor (node:test + supertest)
client/vitest.config.js
client/src/test/                # Pruebas del cliente (Vitest + Testing Library)
infra/                          # Terraform
  versions.tf  variables.tf  main.tf  outputs.tf
  environments/dev.tfvars  environments/prod.tfvars
  backends/dev.hcl  backends/prod.hcl
scripts/bootstrap-azure.sh      # Se corre UNA vez: estado remoto + identidades OIDC
.github/workflows/ci.yml        # PRs
.github/workflows/cd.yml        # main → dev → prod
.github/workflows/deploy-env.yml# Reutilizable: terraform apply + deploy + smoke test
.github/actions/terraform/      # terraform init con el backend del ambiente
.github/dependabot.yml
```

---

## Paso 0 — Requisitos

- Azure CLI ≥ 2.60 (`az version`) y una suscripción de pago por uso (las suscripciones
  *Free Trial* a veces tienen cuota 0 para App Service).
- Terraform ≥ 1.9 (solo si quieres correrlo localmente; el pipeline trae el suyo).
- GitHub CLI `gh` (opcional, para crear variables automáticamente).
- Permiso **Owner** o **User Access Administrator** en la suscripción (el bootstrap crea
  asignaciones de roles).

## Paso 1 — ¿Ya existe `casa-reserva-akora` en Azure?

El nombre de la Web App es global. Si la creaste antes a mano con el README anterior,
Terraform fallará con *"name already exists"*.

```bash
az webapp list --query "[?name=='casa-reserva-akora'].{rg:resourceGroup, plan:appServicePlanId}" -o table
```

- **No aparece** → sigue al paso 2.
- **Aparece** → la opción más simple es borrar ese resource group y dejar que el pipeline la
  recree (unos minutos sin sitio):
  ```bash
  az group delete -n rg-casa-akora --yes   # el RG que te devolvió el comando anterior
  ```
  El nombre queda libre en cuanto termina el borrado. Hazlo justo antes del primer
  despliegue a prod para que nadie más lo tome.

> Nota: si una Web App se crea desde el **portal**, Azure ahora le asigna un hostname con hash
> (`casa-reserva-akora-xxxx.eastus2-01.azurewebsites.net`). Terraform/ARM no activan esa opción
> por defecto, por eso el pipeline obtiene exactamente `casa-reserva-akora.azurewebsites.net`.
> No crees la app a mano desde el portal.

## Paso 2 — Bootstrap de Azure (una sola vez)

```bash
az login
az account set --subscription "<tu-suscripción>"
./scripts/bootstrap-azure.sh
# Opcional: LOCATION=eastus ./scripts/bootstrap-azure.sh
```

Crea:

| Recurso | Para qué |
|---|---|
| `rg-casa-akora-tfstate` | Storage account del estado de Terraform (versionado + soft delete 30 días, sin llaves compartidas) e identidades |
| contenedores `tfstate-dev` / `tfstate-prod` | Un estado por ambiente |
| `rg-casa-akora-dev` / `rg-casa-akora-prod` | Donde Terraform crea plan + web app (+ App Insights en prod) |
| `id-casa-akora-github-dev` | OIDC para `environment:dev` y `pull_request` |
| `id-casa-akora-github-prod` | OIDC solo para `environment:prod` |

Al final imprime las 6 variables para GitHub (y si tienes `gh`, ofrece crearlas).

## Paso 3 — Configurar GitHub

En https://github.com/luiscarlosge/casaakora/settings:

**3.1 Variables** (*Secrets and variables → Actions → Variables → New repository variable*) —
son variables, no secretos (ninguno de estos valores es sensible con OIDC):

| Variable | Valor |
|---|---|
| `AZURE_TENANT_ID` | impreso por el bootstrap |
| `AZURE_SUBSCRIPTION_ID` | impreso por el bootstrap |
| `AZURE_CLIENT_ID_DEV` | impreso por el bootstrap |
| `AZURE_CLIENT_ID_PROD` | impreso por el bootstrap |
| `TFSTATE_RESOURCE_GROUP` | `rg-casa-akora-tfstate` |
| `TFSTATE_STORAGE_ACCOUNT` | impreso por el bootstrap |

**3.2 Environments** (*Environments → New environment*):

- `dev` → *Deployment branches and tags*: **Selected branches** → `main`.
- `prod` → *Required reviewers*: tú (Luis). *Deployment branches*: `main`.
  Opcional: *Prevent self-review* desactivado (eres el único revisor).

**3.3 Protección de `main`** (*Rules → Rulesets → New branch ruleset*, target `main`):

- Require a pull request before merging.
- Require status checks to pass: `Pruebas y build` y `Terraform fmt / validate / plan (dev)`
  (aparecen en la lista después de la primera ejecución del CI).
- Block force pushes.

**3.4 Actions** (*Actions → General*): *Workflow permissions* = **Read repository contents**
(los workflows piden explícitamente lo que necesitan: `id-token` y comentar PRs).

## Paso 4 — Primer despliegue

```bash
git push -u origin feat/iac-cicd
gh pr create --fill          # o desde la web
```

1. En el PR corre **CI**: pruebas, build y el `terraform plan` de dev comentado en el PR
   (en el primer PR mostrará `Plan: 2 to add`: plan B1 + web app).
2. Haz merge → corre **CD**:
   - `build` arma `app.zip` (~21 MB: servidor, `node_modules` de producción, `client/dist`,
     `Fotos360/web` y `Fotos360/thumbs` + `build-info.json` con el commit).
   - `Dev` crea/actualiza la infraestructura, despliega y verifica que `/health` responda con
     el commit recién construido.
   - `Prod` queda en **Waiting** → *Review deployments* → *Approve and deploy*.
3. Verifica:
   ```bash
   curl https://casa-reserva-akora.azurewebsites.net/health
   # {"ok":true,...,"env":"prod","version":"<sha corto>",...}
   ```

## Día a día

```bash
git switch -c cambio-precio
# editar client/src/data/house.js (y el precio en client/index.html: hay una prueba que
# verifica que coincidan)
npm run test:all
git commit -am "Precio 410M" && git push -u origin cambio-precio
gh pr create --fill  →  merge  →  revisar dev  →  aprobar prod
```

Desarrollo local con hot-reload:

```bash
npm run install:all
npm run dev                    # Express en :3000 (reinicia al guardar)
cd client && npm run dev       # Vite en :5173 (proxy a /api y /fotos360)
```

Correr Terraform a mano (por ejemplo para ver un plan de prod):

```bash
cd infra
export ARM_SUBSCRIPTION_ID=$(az account show --query id -o tsv)
terraform init -reconfigure -backend-config=backends/prod.hcl \
  -backend-config=resource_group_name=rg-casa-akora-tfstate \
  -backend-config=storage_account_name=<TFSTATE_STORAGE_ACCOUNT>
terraform plan -var-file=environments/prod.tfvars
```

(Con `az login` Terraform usa tu sesión; el bootstrap ya te dio permiso sobre el estado.)

## Costos

| Recurso | Costo aprox. |
|---|---|
| Plan B1 (dev) | ~13 USD/mes |
| Plan B1 (prod) | ~13 USD/mes |
| App Insights + Log Analytics (prod, techo 0.5 GB/día) | 0 dentro de los 5 GB/mes gratis |
| Storage del estado | centavos |

Para bajar costo (si la suscripción tiene cuota F1): `sku_name = "F1"` en `dev.tfvars` y/o `prod.tfvars` (pierdes Always On; el primer visitante
después de un rato espera el arranque en frío y hay 60 min de CPU/día).

## Cuando se venda la casa 🎉

```bash
az group delete -n rg-casa-akora-prod --yes
az group delete -n rg-casa-akora-dev  --yes
az group delete -n rg-casa-akora-tfstate --yes
```

Si tenías un dominio propio apuntando con CNAME a `casa-reserva-akora.azurewebsites.net`,
**borra primero ese CNAME**: al liberar el nombre, otra persona podría crear una app con él y
recibir el tráfico de tu dominio (*subdomain takeover*).

## Problemas comunes

| Síntoma | Causa / solución |
|---|---|
| `AADSTS700213: No matching federated identity record` | La variable `AZURE_CLIENT_ID_*` no corresponde al ambiente, o el environment de GitHub no se llama exactamente `dev`/`prod`, o el repo cambió de nombre (vuelve a correr el bootstrap con `GITHUB_REPO=...`). |
| `AuthorizationFailed ... Microsoft.Storage/.../blobs` en `terraform init` | Los permisos de datos tardan unos minutos en propagarse tras el bootstrap; reintenta. |
| `Website with given name casa-reserva-akora already exists` | Ver paso 1. |
| `The 'Free' tier ... maximum number of free plans` | Solo se permite un plan F1 Linux por región/suscripción. Cambia `sku_name` en `dev.tfvars` a `B1` o elimina el otro plan F1. |
| `Operation cannot be completed without additional quota ... Current Limit (F1 App Service instances): 0` | La suscripción no tiene cuota para ese SKU. Pídela en https://aka.ms/azure-quota (proveedor App Service, región del despliegue) o usa otro SKU/región. |
| El sitio muestra una versión vieja | `curl .../health` muestra el commit desplegado; mira el job `Dev`/`Prod` del último run. |
