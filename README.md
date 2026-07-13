# Multi-Env CI/CD Platform — Nur Al-Quran Academy

A DevOps project that implements a complete CI/CD pipeline for deploying a full-stack application on AWS Kubernetes infrastructure.
The project uses Terraform to provision AWS infrastructure, GitHub Actions for CI/CD automation, Docker for containerization, and Helm for Kubernetes deployments.

## Tech Stack

- **App:** Next.js 14 (App Router, TypeScript, Tailwind), Node.js/Express, PostgreSQL
- **Infra:** Terraform, AWS (EKS, VPC, ECR, IAM/OIDC, RDS, Security Groups), Helm, Kubernetes
- **CI/CD:** GitHub Actions (separate CI, CD-dev, CD-prod, Terraform workflows)

## Architecture

GitHub Push → CI (build & push images)
→ CD-dev / CD-prod (Helm deploy to EKS)
Terraform (manual)
Helm Chart → Frontend + Backend Deployments, Postgres, ConfigMap, Secrets

## Commands

```bash
# Infra
cd terraform && terraform init && terraform plan && terraform apply

# Deploy manually
cd helm
helm upgrade --install myapp . -f values-dev.yaml -n myapp --create-namespace

# Update kubeconfig
aws eks update-kubeconfig --name multi-cicd-eks --region <region>

# Seed database (one-time)
node db/seed.js
node db/create-mentor.js "Name" "email" "password" "bio"
```

## CI/CD Flow

1. Push to `develop`/`main` → CI builds & pushes Docker images
2. CD workflow triggers on CI completion → Helm deploys to the matching environment
3. Infra changes are applied manually via the Terraform workflow
