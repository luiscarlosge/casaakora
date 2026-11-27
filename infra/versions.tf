terraform {
  required_version = ">= 1.9.0"

  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 4.14"
    }
  }

  # Configuración parcial: el resto viene de backends/<env>.hcl y de
  # -backend-config en el pipeline (resource group y storage account del estado).
  backend "azurerm" {
    use_oidc         = true
    use_azuread_auth = true
  }
}

provider "azurerm" {
  features {}
  # subscription_id / tenant_id / client_id llegan por variables de entorno ARM_*
  use_oidc = true
  # La identidad del pipeline solo tiene permisos sobre su resource group:
  # no registrar resource providers a nivel suscripción.
  resource_provider_registrations = "none"
}
