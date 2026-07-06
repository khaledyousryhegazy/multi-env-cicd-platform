output "iam_role_arn" {
  value = module.oidc_github.iam_role_arn
}

output "iam_role_name" {
  value = module.oidc_github.iam_role_name
}

output "oidc_provider_arn" {
  value = module.oidc_github.oidc_provider_arn
}

output "oidc_provider_url" {
  value = module.oidc_github.oidc_provider_url
}

output "assume_role_policy" {
  value = module.oidc_github.assume_role_policy
}
