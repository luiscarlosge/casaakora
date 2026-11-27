output "webapp_name" {
  value = azurerm_linux_web_app.this.name
}

output "webapp_url" {
  value = "https://${azurerm_linux_web_app.this.default_hostname}"
}

output "resource_group_name" {
  value = data.azurerm_resource_group.this.name
}
