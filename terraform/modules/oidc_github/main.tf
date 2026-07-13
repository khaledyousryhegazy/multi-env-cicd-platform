module "oidc_github" {
  source  = "unfunco/oidc-github/aws"
  version = "~> 3.0"

  github_subjects = [
    "khaledyousryhegazy/multi-env-cicd-platform:ref:refs/heads/main",
    "khaledyousryhegazy/multi-env-cicd-platform:ref:refs/heads/develop",
    "khaledyousryhegazy/multi-env-cicd-platform:environment:production"
  ]
}

resource "aws_iam_role_policy" "github_ecr" {
  name = "github-ecr-policy"
  role = module.oidc_github.iam_role_name
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect   = "Allow"
        Action   = ["ecr:GetAuthorizationToken"]
        Resource = "*"
      },
      {
        Effect = "Allow"
        Action = [
          "ecr:GetDownloadUrlForLayer",
          "ecr:BatchGetImage",
          "ecr:BatchCheckLayerAvailability",
          "ecr:PutImage",
          "ecr:InitiateLayerUpload",
          "ecr:UploadLayerPart",
          "ecr:CompleteLayerUpload",
          "eks:UpdateClusterConfig",
          "eks:DescribeCluster",
          "sts:AssumeRole"
        ]
        Resource = [
          var.frontend_repository_arn,
          var.backend_repository_arn,
          var.cluster_arn
        ]
      }
    ]
  })
}
