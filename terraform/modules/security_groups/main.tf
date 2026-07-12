# resource "aws_security_group" "rds" {
#   name   = "rds_sg"
#   vpc_id = var.vpc_id
# }

# resource "aws_security_group_rule" "allow_postgres_from_cluster" {
#   type      = "ingress"
#   from_port = 5432
#   to_port   = 5432
#   protocol  = "tcp"

#   security_group_id        = aws_security_group.rds.id
#   source_security_group_id = var.eks_node_security_group_id
# }

module "security_group" {
  source = "terraform-aws-modules/security-group/aws"

  name   = "${var.name_prefix}rds_security_group"
  vpc_id = var.vpc_id

  ingress_rules = {
    rds-from-cluster = {
      from_port                    = 5432
      to_port                      = 5432
      ip_protocol                  = "tcp"
      referenced_security_group_id = var.eks_node_security_group_id
      description                  = "PostgreSQL from EKS nodes"
    }
  }

  egress_rules = {
    all = {
      ip_protocol = "-1"
      cidr_ipv4   = "0.0.0.0/0"
    }
  }

  tags = {
    Environment = "CV"
  }
}
