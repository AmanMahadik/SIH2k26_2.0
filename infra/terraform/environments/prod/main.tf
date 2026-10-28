# infra/terraform/environments/prod/main.tf
# Production infrastructure configuration for NirikshAI on Azure Government / Central India

terraform {
  required_version = ">= 1.5.0"
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 3.90.0"
    }
  }
}

provider "azurerm" {
  features {}
}

resource "azurerm_resource_group" "rg" {
  name     = "rg-nirikshai-prod-centralindia"
  location = "centralindia"
}

module "database" {
  source              = "../../modules/postgres"
  server_name         = "nirikshai-psql-prod"
  resource_group_name = azurerm_resource_group.rg.name
  location            = azurerm_resource_group.rg.location
  admin_username      = "nirikshaiadmin"
  admin_password      = var.db_password
}
