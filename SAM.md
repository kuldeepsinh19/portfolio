# AWS Fullstack Infrastructure Setup — IaC Agent Guide

> **How to use this file:**
> Paste this entire file (or the relevant sections) into Claude CLI when you start a new fullstack project.
> Say: _"I want to set up AWS infrastructure for my fullstack project. Use the SAM.md guide I'm attaching and walk me through it step by step as IaC."_
> Claude will ask you a few questions, pick the right architecture pattern, and generate all Terraform files for you interactively.

---

## Claude System Prompt (paste this first)

```
You are an AWS infrastructure setup agent. I will describe my fullstack project and you will:

1. Ask me 5-7 targeted questions to understand my stack, scale, and budget
2. Recommend the best AWS architecture pattern from the options in this file
3. Generate Terraform IaC files one step at a time, waiting for my confirmation before each step
4. Explain every resource in plain language as you create it
5. Never hardcode secrets — always use AWS Secrets Manager or SSM Parameter Store
6. At the end, give me the exact CLI commands to deploy

Start by asking me about my project.
```

---

## Step 0 — Answer These Before Picking a Pattern

Claude will ask you these. Have answers ready:

| Question | Example Answers |
|---|---|
| What is your backend? | Node.js, Python/FastAPI, Go, Java |
| What is your frontend? | React SPA, Next.js SSR, Vue |
| What database? | PostgreSQL, MySQL, MongoDB, DynamoDB |
| Expected traffic? | <1k/day, 1k-100k/day, 100k+/day |
| Budget range? | Free tier, $20-50/mo, $100+/mo |
| Need background jobs? | Yes / No |
| Need file uploads/storage? | Yes / No |
| Multi-environment? | dev only, dev+prod, dev+staging+prod |

---

## Architecture Patterns (Claude picks based on your answers)

### Pattern A — Minimal (Free tier / Side project)
**When:** Solo project, low traffic, learning, MVP

```
Internet → EC2 t2.micro (API + Frontend served together) → RDS db.t3.micro (private subnet)
```

- Single EC2 runs both backend and serves static frontend build
- RDS in private subnet, only EC2 can reach it
- No load balancer (cost saving)
- Estimated cost: ~$15-25/mo

---

### Pattern B — Standard Fullstack (Most projects)
**When:** Production app, separate frontend/backend, moderate traffic

```
Internet
   ↓
CloudFront (Frontend CDN)     ALB (API load balancer)
   ↓                              ↓
S3 (React/Next build)         EC2 (Backend API)
                                   ↓
                              RDS (Private subnet)
```

- Frontend: S3 + CloudFront (near-zero cost, global CDN)
- Backend: EC2 behind ALB (easy to scale later)
- Database: RDS in private subnet
- Estimated cost: ~$35-60/mo

---

### Pattern C — Scalable (Production with auto-scaling)
**When:** Real users, need HA, production-grade

```
Internet
   ↓
Route 53 (DNS)
   ↓
CloudFront → S3 (Frontend)
   ↓
ALB
   ↓
Auto Scaling Group (EC2 fleet)
   ↓
RDS Multi-AZ (Primary + Standby)
   ↓
ElastiCache Redis (Sessions/Cache)
```

- Multi-AZ for HA
- Auto Scaling Group adjusts EC2 count by load
- ElastiCache for session storage and caching
- Estimated cost: ~$100-200/mo

---

### Pattern D — Serverless (Event-driven / Unpredictable traffic)
**When:** Spiky traffic, pay-per-use preference, microservices

```
Internet → API Gateway → Lambda (per route) → RDS Proxy → RDS
                                             → DynamoDB (NoSQL parts)
                                             → S3 (files)
```

- No EC2 to manage
- Lambda cold starts are a tradeoff
- RDS Proxy handles connection pooling for Lambda
- Estimated cost: ~$5-50/mo depending on invocations

---

## Terraform File Structure Claude Will Generate

```
infra/
├── main.tf           # Provider + backend config
├── variables.tf      # All input variables
├── outputs.tf        # Useful outputs (IPs, endpoints)
├── vpc.tf            # VPC, subnets, IGW, routing
├── security.tf       # All security groups
├── ec2.tf            # EC2 instance(s) or ASG
├── rds.tf            # RDS instance + subnet group
├── s3.tf             # S3 buckets (if needed)
├── cloudfront.tf     # CDN (if needed)
├── alb.tf            # Load balancer (if needed)
├── secrets.tf        # Secrets Manager / SSM entries
└── terraform.tfvars  # Your values (gitignored)
```

---

## Core Terraform Blocks (Claude will customize these for your project)

### `main.tf` — Provider + Remote State

```hcl
terraform {
  required_version = ">= 1.5"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  # Uncomment to store state in S3 (recommended for teams)
  # backend "s3" {
  #   bucket = "your-tfstate-bucket"
  #   key    = "project-name/terraform.tfstate"
  #   region = "ap-south-1"
  # }
}

provider "aws" {
  region = var.aws_region
}
```

---

### `variables.tf`

```hcl
variable "aws_region" {
  default = "ap-south-1"
}

variable "project_name" {
  description = "Used to prefix all resource names"
  type        = string
}

variable "environment" {
  description = "dev | staging | prod"
  type        = string
  default     = "dev"
}

variable "your_ip" {
  description = "Your IP for SSH access (format: x.x.x.x/32)"
  type        = string
  sensitive   = true
}

variable "db_username" {
  description = "RDS master username"
  type        = string
  sensitive   = true
}

variable "db_password" {
  description = "RDS master password — store in Secrets Manager, not here"
  type        = string
  sensitive   = true
}
```

---

### `vpc.tf` — Network Foundation

```hcl
resource "aws_vpc" "main" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_hostnames = true
  enable_dns_support   = true

  tags = { Name = "${var.project_name}-vpc" }
}

resource "aws_subnet" "public_a" {
  vpc_id                  = aws_vpc.main.id
  cidr_block              = "10.0.1.0/24"
  availability_zone       = "${var.aws_region}a"
  map_public_ip_on_launch = true

  tags = { Name = "${var.project_name}-public-a" }
}

resource "aws_subnet" "public_b" {
  vpc_id                  = aws_vpc.main.id
  cidr_block              = "10.0.2.0/24"
  availability_zone       = "${var.aws_region}b"
  map_public_ip_on_launch = true

  tags = { Name = "${var.project_name}-public-b" }
}

resource "aws_subnet" "private_a" {
  vpc_id            = aws_vpc.main.id
  cidr_block        = "10.0.3.0/24"
  availability_zone = "${var.aws_region}a"

  tags = { Name = "${var.project_name}-private-a" }
}

resource "aws_subnet" "private_b" {
  vpc_id            = aws_vpc.main.id
  cidr_block        = "10.0.4.0/24"
  availability_zone = "${var.aws_region}b"

  tags = { Name = "${var.project_name}-private-b" }
}

resource "aws_internet_gateway" "gw" {
  vpc_id = aws_vpc.main.id
  tags   = { Name = "${var.project_name}-igw" }
}

resource "aws_route_table" "public" {
  vpc_id = aws_vpc.main.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.gw.id
  }

  tags = { Name = "${var.project_name}-public-rt" }
}

resource "aws_route_table_association" "public_a" {
  subnet_id      = aws_subnet.public_a.id
  route_table_id = aws_route_table.public.id
}

resource "aws_route_table_association" "public_b" {
  subnet_id      = aws_subnet.public_b.id
  route_table_id = aws_route_table.public.id
}
```

---

### `security.tf` — Security Groups

```hcl
# EC2: allow SSH from your IP only, app port from anywhere
resource "aws_security_group" "ec2" {
  name   = "${var.project_name}-ec2-sg"
  vpc_id = aws_vpc.main.id

  ingress {
    description = "SSH from your IP only"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = [var.your_ip]
  }

  ingress {
    description = "App port"
    from_port   = 3000
    to_port     = 3000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = { Name = "${var.project_name}-ec2-sg" }
}

# RDS: only EC2 security group can connect (not open to internet)
resource "aws_security_group" "rds" {
  name   = "${var.project_name}-rds-sg"
  vpc_id = aws_vpc.main.id

  ingress {
    description     = "DB access from EC2 only"
    from_port       = 5432  # change to 3306 for MySQL
    to_port         = 5432
    protocol        = "tcp"
    security_groups = [aws_security_group.ec2.id]
  }

  tags = { Name = "${var.project_name}-rds-sg" }
}
```

---

### `ec2.tf` — Application Server

```hcl
# Get latest Amazon Linux 2023 AMI automatically
data "aws_ami" "amazon_linux" {
  most_recent = true
  owners      = ["amazon"]

  filter {
    name   = "name"
    values = ["al2023-ami-*-x86_64"]
  }
}

resource "aws_instance" "app" {
  ami           = data.aws_ami.amazon_linux.id
  instance_type = "t3.micro"  # upgrade to t3.small for more memory

  subnet_id              = aws_subnet.public_a.id
  vpc_security_group_ids = [aws_security_group.ec2.id]
  key_name               = var.key_pair_name

  # Bootstrap script — install your runtime here
  user_data = <<-EOF
    #!/bin/bash
    yum update -y
    # Add your install commands: node, python, docker, etc.
  EOF

  tags = {
    Name        = "${var.project_name}-app"
    Environment = var.environment
  }
}
```

---

### `rds.tf` — Database

```hcl
resource "aws_db_subnet_group" "main" {
  name       = "${var.project_name}-db-subnet-group"
  subnet_ids = [aws_subnet.private_a.id, aws_subnet.private_b.id]

  tags = { Name = "${var.project_name}-db-subnet-group" }
}

resource "aws_db_instance" "main" {
  identifier        = "${var.project_name}-db"
  engine            = "postgres"      # or "mysql"
  engine_version    = "16"
  instance_class    = "db.t3.micro"
  allocated_storage = 20
  storage_encrypted = true            # always encrypt at rest

  db_name  = replace(var.project_name, "-", "_")
  username = var.db_username
  password = var.db_password          # pulled from tfvars (never commit)

  db_subnet_group_name   = aws_db_subnet_group.main.name
  vpc_security_group_ids = [aws_security_group.rds.id]

  publicly_accessible = false         # private only
  skip_final_snapshot = var.environment != "prod"

  tags = {
    Name        = "${var.project_name}-db"
    Environment = var.environment
  }
}
```

---

### `secrets.tf` — Secrets Manager (no plaintext creds)

```hcl
resource "aws_secretsmanager_secret" "db_credentials" {
  name        = "${var.project_name}/${var.environment}/db-credentials"
  description = "Database credentials for ${var.project_name}"
}

resource "aws_secretsmanager_secret_version" "db_credentials" {
  secret_id = aws_secretsmanager_secret.db_credentials.id

  secret_string = jsonencode({
    username = var.db_username
    password = var.db_password
    host     = aws_db_instance.main.address
    port     = aws_db_instance.main.port
    dbname   = aws_db_instance.main.db_name
  })
}
```

> In your app, fetch credentials with: `aws secretsmanager get-secret-value --secret-id <name>`
> Never read DB creds from environment variables in production.

---

### `outputs.tf`

```hcl
output "ec2_public_ip" {
  value       = aws_instance.app.public_ip
  description = "SSH: ssh -i your-key.pem ec2-user@<this-ip>"
}

output "rds_endpoint" {
  value       = aws_db_instance.main.address
  description = "DB host for your app's connection string"
  sensitive   = true
}

output "db_secret_arn" {
  value = aws_secretsmanager_secret.db_credentials.arn
}
```

---

### `terraform.tfvars` (gitignore this file)

```hcl
project_name  = "my-app"
environment   = "dev"
aws_region    = "ap-south-1"
your_ip       = "1.2.3.4/32"   # run: curl ifconfig.me
key_pair_name = "my-key"
db_username   = "appuser"
db_password   = "use-a-strong-password-here"
```

Add to `.gitignore`:
```
infra/terraform.tfvars
infra/.terraform/
infra/*.tfstate
infra/*.tfstate.backup
```

---

## S3 + CloudFront (Pattern B/C — Frontend Hosting)

```hcl
# s3.tf
resource "aws_s3_bucket" "frontend" {
  bucket = "${var.project_name}-frontend-${var.environment}"
  tags   = { Name = "${var.project_name}-frontend" }
}

resource "aws_s3_bucket_public_access_block" "frontend" {
  bucket                  = aws_s3_bucket.frontend.id
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

# cloudfront.tf
resource "aws_cloudfront_origin_access_control" "frontend" {
  name                              = "${var.project_name}-oac"
  origin_access_control_origin_type = "s3"
  signing_behavior                  = "always"
  signing_protocol                  = "sigv4"
}

resource "aws_cloudfront_distribution" "frontend" {
  enabled             = true
  default_root_object = "index.html"

  origin {
    domain_name              = aws_s3_bucket.frontend.bucket_regional_domain_name
    origin_id                = "s3-frontend"
    origin_access_control_id = aws_cloudfront_origin_access_control.frontend.id
  }

  default_cache_behavior {
    allowed_methods        = ["GET", "HEAD"]
    cached_methods         = ["GET", "HEAD"]
    target_origin_id       = "s3-frontend"
    viewer_protocol_policy = "redirect-to-https"

    forwarded_values {
      query_string = false
      cookies { forward = "none" }
    }
  }

  # SPA routing — return index.html on 404
  custom_error_response {
    error_code         = 404
    response_code      = 200
    response_page_path = "/index.html"
  }

  restrictions {
    geo_restriction { restriction_type = "none" }
  }

  viewer_certificate {
    cloudfront_default_certificate = true
  }
}
```

---

## Deployment Commands

```bash
# 1. Initialize
cd infra/
terraform init

# 2. Preview what will be created
terraform plan -var-file="terraform.tfvars"

# 3. Apply (type 'yes' to confirm)
terraform apply -var-file="terraform.tfvars"

# 4. SSH into EC2
ssh -i ~/.ssh/your-key.pem ec2-user@$(terraform output -raw ec2_public_ip)

# 5. Deploy frontend to S3 (Pattern B/C)
npm run build
aws s3 sync ./dist s3://$(terraform output -raw frontend_bucket) --delete

# 6. Tear down everything
terraform destroy -var-file="terraform.tfvars"
```

---

## Security Checklist (Claude will verify these)

- [ ] RDS has `publicly_accessible = false`
- [ ] SSH restricted to your IP, not `0.0.0.0/0`
- [ ] DB password stored in Secrets Manager, not env vars
- [ ] S3 bucket has `block_public_acls = true`
- [ ] RDS has `storage_encrypted = true`
- [ ] `terraform.tfvars` is in `.gitignore`
- [ ] No secrets in `outputs.tf` without `sensitive = true`
- [ ] EC2 egress is scoped (optional, tighten for prod)

---

## Production Upgrade Path

Tell Claude: _"Upgrade my infra for production"_ and it will add:

| Upgrade | What it adds |
|---|---|
| **High Availability** | Multi-AZ RDS, 2+ EC2 in ASG across AZs |
| **Load Balancing** | ALB in front of EC2 fleet |
| **NAT Gateway** | Private subnet outbound internet access |
| **ElastiCache** | Redis for sessions and query caching |
| **WAF** | Web Application Firewall on ALB/CloudFront |
| **CloudWatch** | Alarms for CPU, RDS connections, 5xx errors |
| **Backup** | RDS automated backups, S3 versioning |
| **ACM + Route 53** | Custom domain with HTTPS cert |

---

## Reusable Claude Prompts

### Start a new project
```
I'm building a [DESCRIPTION] app with [BACKEND] + [FRONTEND] + [DATABASE].
Use the SAM.md infra guide and start with the architecture questions.
I want Terraform IaC, one step at a time.
```

### Add a specific service
```
I already have the base infra from SAM.md.
Add [ElastiCache Redis / S3 file uploads / SQS queue / Lambda function]
to my existing Terraform setup. Show me only the new files/blocks.
```

### Upgrade to production
```
I have a dev infra from SAM.md (Pattern A).
Walk me through upgrading to Pattern C (production-grade) step by step.
Keep my existing resources and add HA + ALB + Multi-AZ.
```

### Debug infra issues
```
My Terraform apply failed with this error: [PASTE ERROR]
My current setup is based on SAM.md [Pattern X].
Help me fix it without destroying existing resources.
```

---

# 🧩 STEP 1 — VPC Setup

### What you’re creating:

* 1 VPC
* 2 subnets:

  * Public subnet (EC2)
  * Private subnet (RDS)

---

### Minimal Terraform (fastest reproducible IaC)

```hcl
provider "aws" {
  region = "ap-south-1"
}

resource "aws_vpc" "main" {
  cidr_block = "10.0.0.0/16"
}

resource "aws_subnet" "public" {
  vpc_id                  = aws_vpc.main.id
  cidr_block              = "10.0.1.0/24"
  map_public_ip_on_launch = true
}

resource "aws_subnet" "private" {
  vpc_id     = aws_vpc.main.id
  cidr_block = "10.0.2.0/24"
}
```

---

# 🌐 STEP 2 — Internet Gateway + Routing

```hcl
resource "aws_internet_gateway" "gw" {
  vpc_id = aws_vpc.main.id
}

resource "aws_route_table" "public_rt" {
  vpc_id = aws_vpc.main.id
}

resource "aws_route" "internet_access" {
  route_table_id         = aws_route_table.public_rt.id
  destination_cidr_block = "0.0.0.0/0"
  gateway_id             = aws_internet_gateway.gw.id
}

resource "aws_route_table_association" "public_assoc" {
  subnet_id      = aws_subnet.public.id
  route_table_id = aws_route_table.public_rt.id
}
```

---

# 🔐 STEP 3 — Security Groups (VERY IMPORTANT)

### EC2 Security Group

```hcl
resource "aws_security_group" "ec2_sg" {
  vpc_id = aws_vpc.main.id

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["YOUR_IP/32"]
  }

  ingress {
    from_port   = 3000
    to_port     = 3000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
}
```

---

### RDS Security Group (only EC2 can access)

```hcl
resource "aws_security_group" "rds_sg" {
  vpc_id = aws_vpc.main.id

  ingress {
    from_port       = 3306
    to_port         = 3306
    protocol        = "tcp"
    security_groups = [aws_security_group.ec2_sg.id]
  }
}
```

👉 This is a **huge interview win**
Say:

> “RDS is not publicly accessible, only EC2 can reach it via SG reference”

---

# 🖥️ STEP 4 — EC2 Instance

```hcl
resource "aws_instance" "app" {
  ami           = "ami-0f58b397bc5c1f2e8" # (update region-wise)
  instance_type = "t2.micro"

  subnet_id              = aws_subnet.public.id
  vpc_security_group_ids = [aws_security_group.ec2_sg.id]

  key_name = "your-key"

  tags = {
    Name = "app-server"
  }
}
```

---

# 🗄️ STEP 5 — RDS (MySQL Example)

```hcl
resource "aws_db_subnet_group" "db_subnet" {
  subnet_ids = [aws_subnet.private.id]

  name = "db-subnet-group"
}

resource "aws_db_instance" "db" {
  allocated_storage    = 20
  engine               = "mysql"
  instance_class       = "db.t3.micro"
  username             = "admin"
  password             = "password123"
  db_subnet_group_name = aws_db_subnet_group.db_subnet.name
  vpc_security_group_ids = [aws_security_group.rds_sg.id]

  skip_final_snapshot = true
}
```

---

# ⚡ STEP 6 — Deploy

```bash
terraform init
terraform apply
```

---

# 🔌 STEP 7 — Connect EC2 → RDS

Inside EC2:

```bash
mysql -h <RDS-ENDPOINT> -u admin -p
```

---

# 🧠 How to Use This With Your AI Prompt

When using your **infra execution agent**, you don’t paste all this.

You say:

```text
Task: Create EC2 + RDS setup inside VPC
- Public EC2
- Private RDS
- Secure access
- Minimal cost setup
```

Then it will:

1. Ask questions
2. Confirm architecture
3. Generate THIS structure
4. Guide you step-by-step

---

# 🔥 Interview-Level Talking Points (IMPORTANT)

While doing this, say:

* “I’m isolating RDS in private subnet for security”
* “Using security group referencing instead of open CIDR”
* “Keeping EC2 public only for API access”
* “This can be extended with ALB + Auto Scaling”

---

# 🚀 If You Have Extra Time (Upgrade Path)

Say this:

> “If this were production, I would:”

* Add **NAT Gateway** for private subnet outbound
* Use **Secrets Manager** for DB creds
* Add **ALB + Auto Scaling Group**
* Enable **CloudWatch logs + alarms**

---

# 🧨 Reality Check

In a 1-hour interview:

👉 You will NOT finish all this fully
👉 But if you **structure it like this + explain while building**

You’ll look like someone who has:

* built infra before
* understands AWS deeply
* can scale systems

---

If you want next level:
👉 I can compress this into a **5-minute verbal explanation script** (very useful for interview)
👉 Or give you a **Serverless + RDS alternative (Lambda + RDS proxy)** which is even more modern
