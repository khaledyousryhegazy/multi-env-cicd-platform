# EKS
output "cluster_name" {
  value = module.eks.cluster_name
}

output "cluster_arn" {
  value = module.eks.cluster_arn
}

# ECR
output "frontend_repository_url" {
  value = module.ecr.frontend_repository_url
}

output "backend_repository_url" {
  value = module.ecr.backend_repository_url
}

# GitHub OIDC
output "github_role_arn" {
  value = module.oidc_github.iam_role_arn
}

# VPC
output "vpc_id" {
  value = module.vpc.vpc_id
}

# RDS
output "rds_endpoint" {
  value = module.rds.db_instance_endpoint
}
