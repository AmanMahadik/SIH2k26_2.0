# infra/terraform/modules/postgres/main.tf
# Azure Database for PostgreSQL Flexible Server provisioner

resource "azurerm_postgresql_flexible_server" "nirikshai_pg" {
  name                   = var.server_name
  resource_group_name    = var.resource_group_name
  location               = var.location
  version                = "16"
  administrator_login    = var.admin_username
  administrator_password = var.admin_password

  storage_mb   = 32768
  sku_name     = "GP_Standard_D2ds_v5"
  zone         = "1"

  backup_retention_days        = 30
  geo_redundant_backup_enabled = false
  auto_grow_enabled            = true

  public_network_access_enabled = true
}

resource "azurerm_postgresql_flexible_server_database" "nirikshai_db" {
  name      = "nirikshai_prod"
  server_id = azurerm_postgresql_flexible_server.nirikshai_pg.id
  collation = "en_US.utf8"
  charset   = "utf8"
}
