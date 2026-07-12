# VPC Module
module "vpc" {
  source      = "./modules/vpc"
  name_prefix = local.name_prefix
  vpc_cidr    = var.vpc_cidr
}

# EKS Module
module "eks" {
  source          = "./modules/eks"
  name_prefix     = local.name_prefix
  vpc_id          = module.vpc.vpc_id
  private_subnets = module.vpc.private_subnets
  tags            = local.common_tags
}

# ECR Module
module "ecr" {
  source      = "./modules/ecr"
  name_prefix = local.name_prefix
}

# OIDC Module
module "oidc_github" {
  source                  = "./modules/oidc_github"
  cluster_arn             = module.eks.cluster_arn
  frontend_repository_arn = module.ecr.frontend_repository_arn
  backend_repository_arn  = module.ecr.backend_repository_arn
}

# IAM Module
module "iam" {
  source        = "./modules/iam"
  iam_role_name = module.eks.eks_managed_node_groups["mygroup"].iam_role_name
}

# Security_Groups Module
module "security_groups" {
  source                     = "./modules/security_groups"
  vpc_id                     = module.vpc.vpc_id
  eks_node_security_group_id = module.eks.node_security_group_id
  name_prefix                = local.name_prefix
}

# RDS Module
module "rds" {
  source           = "./modules/rds"
  name_prefix      = local.name_prefix
  database_subnets = module.vpc.database_subnets
  db_sg_id         = module.security_groups.rds_sg_id
}
