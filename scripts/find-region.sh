#!/usr/bin/env bash
# -----------------------------------------------------------------------------
# Busca regiones de América donde tu suscripción puede crear los DOS planes
# de App Service que necesita el proyecto: F1 (dev) + B1 (prod) al mismo tiempo.
#
# Para cada región crea un plan F1 y un plan B1 de prueba, anota el resultado
# y los borra de inmediato. Costo: centavos (B1 se cobra por los segundos que existe).
#
# Uso:   az login && ./scripts/find-region.sh
#        REGIONS="eastus brazilsouth" ./scripts/find-region.sh   # regiones específicas
# -----------------------------------------------------------------------------
set -uo pipefail

RG="rg-quota-test-$$"
TMP="$(mktemp -d)"

# Regiones físicas de América (de la más cercana a Colombia a la más lejana)
DEFAULT_REGIONS="brazilsouth southcentralus eastus2 eastus mexicocentral chilecentral centralus \
northcentralus westcentralus westus3 westus2 westus canadacentral canadaeast brazilsoutheast"
REGIONS="${REGIONS:-$DEFAULT_REGIONS}"

# Descarta las que la suscripción no tiene habilitadas
AVAILABLE="$(az account list-locations --query "[].name" -o tsv)"

echo "Grupo temporal: $RG"
az group create -n "$RG" -l eastus -o none
trap 'echo; echo "Limpiando $RG..."; az group delete -n "$RG" --yes --no-wait -o none; rm -rf "$TMP"' EXIT

probar() {
  local region="$1" sku="$2" plan="qt-$2-$1"
  if az appservice plan create -n "$plan" -g "$RG" -l "$region" --sku "$sku" --is-linux -o none 2>"$TMP/$region-$sku.err"; then
    echo ok
  else
    # Extrae el tipo de límite del mensaje de cuota (si lo hay)
    local motivo
    motivo="$(grep -o 'Current Limit ([^)]*): [0-9]*' "$TMP/$region-$sku.err" | head -1)"
    echo "${motivo:-$(head -c 120 "$TMP/$region-$sku.err" | tr '\n' ' ')}"
  fi
}

evaluar_region() {
  local region="$1" f1 b1
  f1="$(probar "$region" F1)"
  b1="$(probar "$region" B1)"          # se crea con el F1 aún vivo: prueba el total de instancias
  az appservice plan delete -n "qt-B1-$region" -g "$RG" --yes -o none 2>/dev/null
  az appservice plan delete -n "qt-F1-$region" -g "$RG" --yes -o none 2>/dev/null
  printf '%s|%s|%s\n' "$region" "$f1" "$b1" > "$TMP/$region.res"
}

echo "Probando (en paralelo): $REGIONS"
for r in $REGIONS; do
  if grep -qx "$r" <<<"$AVAILABLE"; then
    evaluar_region "$r" &
  else
    printf '%s|no disponible en la suscripción|-\n' "$r" > "$TMP/$r.res"
  fi
done
wait

echo
printf '%-16s %-8s %-8s %s\n' REGIÓN F1-dev B1-prod DETALLE
printf '%-16s %-8s %-8s %s\n' ------ ------ ------- -------
IDONEAS=""
for r in $REGIONS; do
  IFS='|' read -r region f1 b1 < "$TMP/$r.res"
  s1="❌"; s2="❌"; det=""
  [[ "$f1" == ok ]] && s1="✅" || det="F1: $f1"
  [[ "$b1" == ok ]] && s2="✅" || det="${det:+$det; }B1: $b1"
  [[ "$f1" == ok && "$b1" == ok ]] && IDONEAS="$IDONEAS $region"
  printf '%-16s %-8s %-8s %s\n' "$region" "$s1" "$s2" "$det"
done

echo
IDONEAS="${IDONEAS# }"
if [[ -n "$IDONEAS" ]]; then
  echo "Regiones idóneas (F1 + B1 juntos), en orden de cercanía: $IDONEAS"
  PRIMERA="${IDONEAS%% *}"
  echo "Recomendada: $PRIMERA  →  location = \"$PRIMERA\" en infra/environments/*.tfvars"
else
  echo "Ninguna región aceptó F1 + B1 juntos. Pide en https://aka.ms/azure-quota"
  echo "(App Service → región cercana) 'Total App Service instances' = 3."
fi
