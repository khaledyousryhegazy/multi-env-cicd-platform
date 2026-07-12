variable "name_prefix" {
  type = string
}

variable "db_sg_id" {
  type = string
}

variable "database_subnets" {
  type = list(string)
}
