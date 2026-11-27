#!/usr/bin/env bash
# -----------------------------------------------------------------------------
# Bootstrap (se ejecuta UNA sola vez, a mano, con tu usuario de Azure).
#
# Crea lo que Terraform necesita antes de poder correr desde GitHub Actions:
#   1. Resource groups por ambiente (rg-casa-akora-dev / rg-casa-akora-prod)
#   2. Storage account + contenedores para el estado remoto de Terraform
#   3. Una identidad administrada por ambiente con credenciales federadas (OIDC)
#      para GitHub Actions — sin secretos ni contraseñas guardadas en GitHub
#   4. Permisos mínimos: cada identidad solo es Contributor de SU resource group
#      y solo escribe en SU contenedor de estado
#   5. (Opcional) Variables del repositorio en GitHub, si tienes `gh` autenticado
#
# Uso:
#   az login
#   ./scripts/bootstrap-azure.sh
#
# Variables que puedes sobreescribir:
#   LOCATION, GITHUB_REPO, TFSTATE_SA (nombre del storage, 3-24 minúsculas/números)
# -----------------------------------------------------------------------------
set -euo pipefail

LOCATION="${LOCATION:-eastus}"
GITHUB_REPO="${GITHUB_REPO:-luiscarlosge/casaakora}"
PREFIX="casa-akora"
TFSTATE_RG="rg-${PREFIX}-tfstate"
TFSTATE_SA="${TFSTATE_SA:-stcasaakoratf$(printf '%s' "$GITHUB_REPO" | shasum | cut -c1-6)}"
ENVS=(dev prod)

SUBSCRIPTION_ID="$(az account show --query id -o tsv)"
TENANT_ID="$(az account show --query tenantId -o tsv)"
echo "Suscripción: $(az account show --query name -o tsv) ($SUBSCRIPTION_ID)"
echo "Repositorio: $GITHUB_REPO   Región: $LOCATION   Estado: $TFSTATE_SA"
read -r -p "¿Continuar? [s/N] " ok; [[ "$ok" =~ ^[sSyY]$ ]] || exit 1

echo "==> Registrando resource providers"
for ns in Microsoft.Web Microsoft.Storage Microsoft.ManagedIdentity Microsoft.OperationalInsights Microsoft.Insights; do
  az provider register --namespace "$ns" --wait -o none
done

echo "==> Estado remoto de Terraform"
az group create -n "$TFSTATE_RG" -l "$LOCATION" --tags proyecto=casa-reserva-akora gestor=bootstrap -o none
if ! az storage account show -n "$TFSTATE_SA" -g "$TFSTATE_RG" -o none 2>/dev/null; then
  az storage account create -n "$TFSTATE_SA" -g "$TFSTATE_RG" -l "$LOCATION" \
    --sku Standard_LRS --kind StorageV2 --min-tls-version TLS1_2 \
    --allow-blob-public-access false --allow-shared-key-access false -o none
fi
SA_ID="$(az storage account show -n "$TFSTATE_SA" -g "$TFSTATE_RG" --query id -o tsv)"
az storage account blob-service-properties update --account-name "$TFSTATE_SA" -g "$TFSTATE_RG" \
  --enable-versioning true --enable-delete-retention true --delete-retention-days 30 -o none

ME="$(az ad signed-in-user show --query id -o tsv)"
# Tú también necesitas permiso de datos para crear contenedores y correr terraform local
az role assignment create --assignee-object-id "$ME" --assignee-principal-type User \
  --role "Storage Blob Data Contributor" --scope "$SA_ID" -o none 2>/dev/null || true
echo "   (esperando propagación de permisos...)"; sleep 30

# (compatible con el bash 3.2 de macOS: sin arreglos asociativos)
for env in "${ENVS[@]}"; do
  echo "==> Ambiente: $env"
  RG="rg-${PREFIX}-${env}"
  ID_NAME="id-${PREFIX}-github-${env}"
  CONTAINER="tfstate-${env}"

  az group create -n "$RG" -l "$LOCATION" --tags proyecto=casa-reserva-akora ambiente="$env" -o none
  az storage container create -n "$CONTAINER" --account-name "$TFSTATE_SA" --auth-mode login -o none

  az identity create -n "$ID_NAME" -g "$TFSTATE_RG" -l "$LOCATION" -o none
  CLIENT_ID="$(az identity show -n "$ID_NAME" -g "$TFSTATE_RG" --query clientId -o tsv)"
  PRINCIPAL_ID="$(az identity show -n "$ID_NAME" -g "$TFSTATE_RG" --query principalId -o tsv)"
  printf -v "CLIENT_ID_${env}" '%s' "$CLIENT_ID"

  # Credenciales federadas: qué workflows de GitHub pueden usar esta identidad
  subjects=("repo:${GITHUB_REPO}:environment:${env}")
  # El plan de los Pull Requests corre contra dev (nunca contra prod)
  [[ "$env" == "dev" ]] && subjects+=("repo:${GITHUB_REPO}:pull_request")
  i=0
  for subject in "${subjects[@]}"; do
    name="github-${env}-${i}"; i=$((i+1))
    az identity federated-credential show -n "$name" --identity-name "$ID_NAME" -g "$TFSTATE_RG" -o none 2>/dev/null ||
      az identity federated-credential create -n "$name" --identity-name "$ID_NAME" -g "$TFSTATE_RG" \
        --issuer "https://token.actions.githubusercontent.com" \
        --subject "$subject" --audiences "api://AzureADTokenExchange" -o none
    echo "   federada: $subject"
  done

  RG_ID="$(az group show -n "$RG" --query id -o tsv)"
  az role assignment create --assignee-object-id "$PRINCIPAL_ID" --assignee-principal-type ServicePrincipal \
    --role "Contributor" --scope "$RG_ID" -o none
  az role assignment create --assignee-object-id "$PRINCIPAL_ID" --assignee-principal-type ServicePrincipal \
    --role "Storage Blob Data Contributor" \
    --scope "${SA_ID}/blobServices/default/containers/${CONTAINER}" -o none
done

cat <<OUT

============================================================
Listo. Configura estas VARIABLES en GitHub
(Settings → Secrets and variables → Actions → pestaña Variables):

  AZURE_TENANT_ID        = ${TENANT_ID}
  AZURE_SUBSCRIPTION_ID  = ${SUBSCRIPTION_ID}
  AZURE_CLIENT_ID_DEV    = ${CLIENT_ID_dev}
  AZURE_CLIENT_ID_PROD   = ${CLIENT_ID_prod}
  TFSTATE_RESOURCE_GROUP = ${TFSTATE_RG}
  TFSTATE_STORAGE_ACCOUNT= ${TFSTATE_SA}
============================================================
OUT

if command -v gh >/dev/null && gh auth status >/dev/null 2>&1; then
  read -r -p "¿Crear variables y environments en GitHub con gh? [s/N] " ok
  if [[ "$ok" =~ ^[sSyY]$ ]]; then
    gh variable set AZURE_TENANT_ID         -R "$GITHUB_REPO" -b "$TENANT_ID"
    gh variable set AZURE_SUBSCRIPTION_ID   -R "$GITHUB_REPO" -b "$SUBSCRIPTION_ID"
    gh variable set AZURE_CLIENT_ID_DEV     -R "$GITHUB_REPO" -b "${CLIENT_ID_dev}"
    gh variable set AZURE_CLIENT_ID_PROD    -R "$GITHUB_REPO" -b "${CLIENT_ID_prod}"
    gh variable set TFSTATE_RESOURCE_GROUP  -R "$GITHUB_REPO" -b "$TFSTATE_RG"
    gh variable set TFSTATE_STORAGE_ACCOUNT -R "$GITHUB_REPO" -b "$TFSTATE_SA"
    gh api -X PUT "repos/${GITHUB_REPO}/environments/dev" >/dev/null
    gh api -X PUT "repos/${GITHUB_REPO}/environments/prod" >/dev/null
    echo "Variables y environments creados. Agrega los revisores de 'prod' en la UI (ver docs/DESPLIEGUE.md)."
  fi
fi
