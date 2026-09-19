# Casa en Venta — Reserva de Akora, Tocancipá

Sitio web para la venta de vivienda multinivel (3 pisos, 104 m²) en el **Conjunto Residencial Reserva de Akora**, Tocancipá, Cundinamarca. Incluye tour virtual 360° con fotos tomadas con Insta 360.

**Stack:** Node.js · Express · React · Vite · Tailwind CSS · Pannellum 360

---

## Estructura del Proyecto

```
casa/
├── server.js           # Servidor Express (Azure App Service)
├── package.json        # Dependencias del servidor
├── Fotos360/           # Fotos panorámicas 360° (.jpg)
└── client/
    ├── package.json    # Dependencias del cliente React
    ├── vite.config.js
    ├── index.html      # Incluye Pannellum CDN
    ├── tailwind.config.js
    └── src/
        ├── App.jsx
        ├── data/house.js     # Datos de la casa y fotos
        └── components/       # Navbar, Hero, Tour360, etc.
```

---

## Desarrollo Local

### Requisitos
- Node.js 18+
- npm 9+

### Pasos

```bash
# 1. Instalar dependencias del servidor
npm install

# 2. Instalar dependencias y compilar el cliente
npm run build

# 3. Iniciar el servidor
npm start
```

El sitio estará disponible en `http://localhost:3000`.

Para desarrollo con hot-reload del cliente:

```bash
# Terminal 1 — Servidor Express
node server.js

# Terminal 2 — Cliente React (dev server en puerto 5173)
cd client && npm run dev
```

---

## Personalización Antes de Publicar

Edita estos valores en los archivos correspondientes:

| Campo | Archivo |
|---|---|
| Teléfono de contacto | `client/src/components/Contact.jsx` |
| Email de contacto | `client/src/components/Contact.jsx` |
| Número WhatsApp | `client/src/components/Contact.jsx` |
| Precio / descripción | `client/src/data/house.js` |
| Link Google Maps real | `client/src/components/Location.jsx` |

---

## Despliegue en Azure App Service

### 1. Crear el App Service

```bash
# Login en Azure CLI
az login

# Variables
RESOURCE_GROUP="rg-casa-akora"
APP_NAME="casa-reserva-akora"        # Debe ser único en Azure
LOCATION="eastus"                    # O "eastus2", "centralus"
SKU="B1"                             # B1 = Basic (~$13 USD/mes)

# Crear grupo de recursos
az group create \
  --name $RESOURCE_GROUP \
  --location $LOCATION

# Crear App Service Plan (Linux)
az appservice plan create \
  --name "${APP_NAME}-plan" \
  --resource-group $RESOURCE_GROUP \
  --location $LOCATION \
  --sku $SKU \
  --is-linux

# Crear la Web App con Node.js 18
az webapp create \
  --name $APP_NAME \
  --resource-group $RESOURCE_GROUP \
  --plan "${APP_NAME}-plan" \
  --runtime "NODE:18-lts"
```

### 2. Configurar variables de entorno

```bash
az webapp config appsettings set \
  --name $APP_NAME \
  --resource-group $RESOURCE_GROUP \
  --settings \
    NODE_ENV=production \
    WEBSITE_NODE_DEFAULT_VERSION="~18"
```

### 3. Configurar comando de inicio

Azure necesita saber cómo construir y arrancar la app:

```bash
az webapp config set \
  --name $APP_NAME \
  --resource-group $RESOURCE_GROUP \
  --startup-file "node server.js"
```

### 4. Desplegar con Git (recomendado)

#### Opción A — Azure Deployment Center (Git local)

```bash
# Configurar credenciales de despliegue
az webapp deployment user set \
  --user-name <tu-usuario> \
  --password <tu-contraseña>

# Obtener URL del repositorio remoto de Azure
az webapp deployment source config-local-git \
  --name $APP_NAME \
  --resource-group $RESOURCE_GROUP
# → Anota la URL que devuelve (formato: https://usuario@appname.scm.azurewebsites.net/appname.git)

# Agregar remote y hacer push
git remote add azure <URL-del-paso-anterior>
git push azure main
```

Durante el push, Azure ejecuta automáticamente:
1. `npm install` (instala dependencias del servidor)
2. `npm run build` (instala deps del cliente y compila React)
3. `npm start` (levanta Express)

#### Opción B — GitHub Actions (CI/CD)

1. Ir a Azure Portal → tu App Service → **Deployment Center**
2. Seleccionar **GitHub** como fuente
3. Autorizar y seleccionar el repositorio/rama
4. Azure genera automáticamente el workflow `.github/workflows/`

#### Opción C — ZIP Deploy (recomendado)

El paquete `casa-azure-deploy.zip` (~16 MB) ya está listo en la raíz del repo e incluye
`server.js`, `package.json`, `node_modules`, el cliente compilado (`client/dist`) y las
fotos optimizadas (`Fotos360/web` + `Fotos360/thumbs`). Trae `.deployment` con
`SCM_DO_BUILD_DURING_DEPLOYMENT=false`, así que Azure no necesita compilar nada.

```bash
az webapp deploy \
  --name $APP_NAME \
  --resource-group $RESOURCE_GROUP \
  --src-path casa-azure-deploy.zip \
  --type zip
```

Para regenerarlo después de cambiar el sitio:

```bash
# 1) Recompilar el cliente
npm run build

# 2) Regenerar las fotos optimizadas (solo si agregas fotos nuevas a Fotos360/)
#    web/   → panoramas 4096x2048 para el visor 360
#    thumbs/→ miniaturas 800x400 para las grillas
cd Fotos360
for f in *.jpg; do
  convert "$f" -resize 4096x2048! -quality 82 -strip -interlace Plane "web/$f"
  convert "$f" -resize 800x400!   -quality 78 -strip -interlace Plane "thumbs/$f"
done
cd ..

# 3) Empaquetar
rm -f casa-azure-deploy.zip
zip -r -9 casa-azure-deploy.zip \
  server.js package.json .deployment node_modules \
  client/dist Fotos360/web Fotos360/thumbs \
  -x "*.DS_Store"
```

> Las fotos originales de 8–14 MB **no** se suben: se quedan en `Fotos360/` como
> archivo maestro. El sitio sirve las versiones optimizadas.

### 5. Agregar dominio personalizado (opcional)

```bash
# Primero configura el CNAME en tu proveedor DNS:
#   CNAME www → appname.azurewebsites.net

# Luego agregar el dominio en Azure
az webapp config hostname add \
  --webapp-name $APP_NAME \
  --resource-group $RESOURCE_GROUP \
  --hostname "www.tudominio.com"

# Agregar certificado SSL gratuito (App Service Managed Certificate)
az webapp config ssl create \
  --name $APP_NAME \
  --resource-group $RESOURCE_GROUP \
  --hostname "www.tudominio.com"

az webapp config ssl bind \
  --name $APP_NAME \
  --resource-group $RESOURCE_GROUP \
  --certificate-thumbprint <thumbprint-del-paso-anterior> \
  --ssl-type SNI
```

### 6. Verificar el despliegue

```bash
# Ver URL de la app
az webapp show \
  --name $APP_NAME \
  --resource-group $RESOURCE_GROUP \
  --query defaultHostName \
  --output tsv
# → appname.azurewebsites.net

# Ver logs en tiempo real
az webapp log tail \
  --name $APP_NAME \
  --resource-group $RESOURCE_GROUP
```

---

## Tamaño de las Fotos 360°

Las fotos de Insta 360 suelen pesar entre 5–30 MB cada una. Para un mejor rendimiento en móviles:

```bash
# Comprimir fotos con ImageMagick (recomendado antes de desplegar)
cd Fotos360
for f in *.jpg; do
  convert "$f" -resize 4096x2048 -quality 85 "${f%.jpg}_opt.jpg"
done
```

O usa la herramienta web [Squoosh](https://squoosh.app/) para comprimir manualmente.

---

## Costos Estimados en Azure

| Componente | Tier | Costo mensual aproximado |
|---|---|---|
| App Service Plan B1 | Basic | ~$13 USD |
| Almacenamiento (fotos) | Incluido en B1 (10 GB) | $0 |
| Dominio personalizado | Proveedor externo | ~$10–15 USD/año |
| Certificado SSL | App Service Managed | $0 |
| **Total aproximado** | | **~$13 USD/mes** |

Para uso temporal de venta puedes usar el tier **F1 (Free)** con limitaciones de 60 min/día de CPU y sin dominio personalizado.

---

## Comandos Útiles

```bash
# Ver estado de la app
az webapp show --name $APP_NAME --resource-group $RESOURCE_GROUP

# Reiniciar la app
az webapp restart --name $APP_NAME --resource-group $RESOURCE_GROUP

# Escalar (si hay mucho tráfico)
az appservice plan update \
  --name "${APP_NAME}-plan" \
  --resource-group $RESOURCE_GROUP \
  --sku S1

# Eliminar todo (cuando ya vendiste la casa 🎉)
az group delete --name $RESOURCE_GROUP --yes --no-wait
```

---

## Licencia

Uso privado — Venta de propiedad residencial. No distribuir.
