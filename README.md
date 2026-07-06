[TODO]
terraform resources (ecr[check manual by push an image] and eks)
Helm charts and kubernetes stuff
values-dev.yaml / values-stage.yaml / values-prod.yaml

multi env:
GitHub Actions workflow (build + push)
إضافة خطوة Deploy التلقائي على Dev
إضافة Manual Approval قبل Production
إضافة استراتيجية Rollback

كتابة README شامل للمشروع

[Done]
docker-compose to make all the app work together [Done]

[my-branches]
main
dev
staging

==================================

1. ~~VPC~~
2. ~~IAM (OIDC/GitHub)
3. ~~ECR
4. ~~EKS Cluster~~
5. ~~Managed Node Group~~
6. ~~EKS Addons~~
7. ~~OIDC Provider
8. ~~Metrics Server
9. ~~AWS Load Balancer Controller
10. ~~ cert-manager
11. ~~ ExternalDNS
12. ~~ Ingress
13. ~~ Monitoring
14. ~~ GitHub Actions
15. ~~ Applications

GitHub
│
GitHub Actions
│
Docker Build
│
ECR
│
Terraform
│
VPC
├── Public Subnets
├── Private Subnets
├── NAT Gateway
└── Route Tables
│
EKS Cluster
├── Managed Node Groups
├── CoreDNS
├── kube-proxy
├── VPC CNI
├── EBS CSI
├── Metrics Server
├── AWS Load Balancer Controller
├── cert-manager
├── ExternalDNS
├── Prometheus
├── Grafana
├── Loki
├── Fluent Bit
├── External Secrets
└── Karpenter
│
Helm Deploy
│
Backend + Frontend
│
ALB
│
Route53
│
HTTPS (ACM)

first try with terraform commands
vpc_id = "vpc-05e72d6a6573b9037"
cluster_arn = "arn:aws:eks:us-east-1:661975751370:cluster/multi-cicd-eks"
cluster_name = "multi-cicd-eks"
frontend_repository_url = "661975751370.dkr.ecr.us-east-1.amazonaws.com/multi-cicd-frontend-repo"
backend_repository_url = "661975751370.dkr.ecr.us-east-1.amazonaws.com/multi-cicd-backend-repo"
github_role_arn = "arn:aws:iam::661975751370:role/GitHubActions"
