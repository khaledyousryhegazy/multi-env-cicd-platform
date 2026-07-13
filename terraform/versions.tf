terraform {
  required_version = "~> 1.15"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = ">= 6.0"
    }
  }

  backend "s3" {
    region         = var.region
    bucket         = "terraform-state-604275788373-us-east-1-an"
    dynamodb_table = "terraform-state-lock"
    key            = "multi-env-cicd-platform/terraform.tfstate"
    use_lockfile   = true
  }
}

provider "aws" {
  region = var.region
}
