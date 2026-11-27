variable "environment" {
  description = "Nombre del ambiente (dev | prod)."
  type        = string
  validation {
    condition     = contains(["dev", "prod"], var.environment)
    error_message = "environment debe ser dev o prod."
  }
}

variable "resource_group_name" {
  description = "Resource group del ambiente. Lo crea scripts/bootstrap-azure.sh (la identidad del pipeline solo tiene permisos ahí)."
  type        = string
}

variable "app_name" {
  description = "Nombre de la Web App. Define la URL: <app_name>.azurewebsites.net (único a nivel global)."
  type        = string
}

variable "sku_name" {
  description = "SKU del App Service Plan Linux (F1 = gratis, B1 = básico)."
  type        = string
  default     = "F1"
}

variable "node_version" {
  description = "Versión de Node.js del runtime de App Service."
  type        = string
  default     = "22-lts"
}

variable "enable_app_insights" {
  description = "Crea Application Insights (monitoreo y disponibilidad) para el ambiente."
  type        = bool
  default     = false
}

variable "tags" {
  description = "Tags adicionales."
  type        = map(string)
  default     = {}
}
