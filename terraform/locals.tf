locals {
  name_prefix = "multi-cicd"

  common_tags = {
    Owner       = "Self"
    Environment = "Dev"
    ManagedBy   = "terraform"
  }
}
