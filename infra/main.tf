locals {
  is_free = upper(var.sku_name) == "F1"

  tags = merge({
    proyecto    = "casa-reserva-akora"
    ambiente    = var.environment
    gestor      = "terraform"
    repositorio = "github.com/luiscarlosge/casaakora"
  }, var.tags)

  app_settings_base = {
    NODE_ENV                       = "production"
    APP_ENV                        = var.environment
    SCM_DO_BUILD_DURING_DEPLOYMENT = "false" # el pipeline entrega el paquete ya compilado
    WEBSITE_RUN_FROM_PACKAGE       = "1"     # el zip se monta de solo lectura: arranque rápido y atómico
  }

  app_settings_insights = var.enable_app_insights ? {
    APPLICATIONINSIGHTS_CONNECTION_STRING      = azurerm_application_insights.this[0].connection_string
    ApplicationInsightsAgent_EXTENSION_VERSION = "~3"
  } : {}
}

data "azurerm_resource_group" "this" {
  name = var.resource_group_name
}

resource "azurerm_service_plan" "this" {
  name                = "asp-${var.app_name}"
  resource_group_name = data.azurerm_resource_group.this.name
  location            = data.azurerm_resource_group.this.location
  os_type             = "Linux"
  sku_name            = var.sku_name
  tags                = local.tags
}

resource "azurerm_log_analytics_workspace" "this" {
  count               = var.enable_app_insights ? 1 : 0
  name                = "log-${var.app_name}"
  resource_group_name = data.azurerm_resource_group.this.name
  location            = data.azurerm_resource_group.this.location
  sku                 = "PerGB2018"
  retention_in_days   = 30
  daily_quota_gb      = 0.5 # techo de costo
  tags                = local.tags
}

resource "azurerm_application_insights" "this" {
  count               = var.enable_app_insights ? 1 : 0
  name                = "appi-${var.app_name}"
  resource_group_name = data.azurerm_resource_group.this.name
  location            = data.azurerm_resource_group.this.location
  workspace_id        = azurerm_log_analytics_workspace.this[0].id
  application_type    = "Node.JS"
  tags                = local.tags
}

resource "azurerm_linux_web_app" "this" {
  name                = var.app_name
  resource_group_name = data.azurerm_resource_group.this.name
  location            = data.azurerm_resource_group.this.location
  service_plan_id     = azurerm_service_plan.this.id
  https_only          = true

  # Solo despliegue por OIDC/ARM: sin usuario/clave de FTP ni SCM básicos
  ftp_publish_basic_authentication_enabled       = false
  webdeploy_publish_basic_authentication_enabled = false

  site_config {
    always_on                         = !local.is_free # F1 no soporta Always On
    app_command_line                  = "node server.js"
    ftps_state                        = "Disabled"
    http2_enabled                     = true
    minimum_tls_version               = "1.2"
    health_check_path                 = "/health"
    health_check_eviction_time_in_min = 10

    application_stack {
      node_version = var.node_version
    }
  }

  app_settings = merge(local.app_settings_base, local.app_settings_insights)

  logs {
    detailed_error_messages = false
    failed_request_tracing  = false
    http_logs {
      file_system {
        retention_in_days = 7
        retention_in_mb   = 35
      }
    }
  }

  tags = local.tags
}
