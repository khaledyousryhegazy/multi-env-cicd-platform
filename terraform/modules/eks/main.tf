module "eks" {
  source  = "terraform-aws-modules/eks/aws"
  version = "~> 21.0"

  name               = "${var.name_prefix}-eks"
  kubernetes_version = "1.33"

  addons = {
    coredns = {}
    eks-pod-identity-agent = {
      before_compute = true
    }
    kube-proxy = {}
    vpc-cni = {
      before_compute = true
    }
  }

  vpc_id                  = var.vpc_id
  subnet_ids              = var.private_subnets
  endpoint_public_access  = true
  endpoint_private_access = true
  authentication_mode     = "API"
  access_entries = {
    khaled = {
      principal_arn = "arn:aws:iam::604275788373:user/khaled"
      policy_associations = {
        admin = {
          policy_arn = "arn:aws:eks::aws:cluster-access-policy/AmazonEKSClusterAdminPolicy"
          access_scope = {
            type = "cluster"
          }
        }
      }
    }
  }

  eks_managed_node_groups = {
    mygroup = {
      instance_types = ["c7i-flex.large"]
      ami_type       = "AL2023_x86_64_STANDARD"

      min_size     = 2
      max_size     = 5
      desired_size = 2
    }
  }

  tags = var.tags
}
