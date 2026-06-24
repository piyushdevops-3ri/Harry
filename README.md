# 🧙‍♂️ Harry Potter App — CI/CD with GitHub Actions + Docker + AWS EC2

![Hogwarts](https://img.shields.io/badge/Deployed%20on-AWS%20EC2-orange?style=for-the-badge&logo=amazonaws)
![Docker](https://img.shields.io/badge/Docker-Containerized-blue?style=for-the-badge&logo=docker)
![GitHub Actions](https://img.shields.io/badge/GitHub%20Actions-CI%2FCD-green?style=for-the-badge&logo=githubactions)
![Terraform](https://img.shields.io/badge/Terraform-IaC-purple?style=for-the-badge&logo=terraform)

A Harry Potter themed React app deployed on **AWS EC2** using a fully automated **CI/CD pipeline** via **GitHub Actions** and **Docker**, with infrastructure provisioned by **Terraform**.

---

## 📐 Architecture

```
Developer (Local Machine)
        │
        │  git push
        ▼
    GitHub Repo
        │
        │  triggers automatically
        ▼
  GitHub Actions
        ├── 📥 Checkout Code
        ├── 🐳 Build Docker Image
        ├── 📤 Push to DockerHub
        └── 🚀 SSH → Deploy on EC2
                        │
                        ▼
              AWS EC2 (ap-south-1 Mumbai)
                        │
                        ▼
              Harry Potter App :80
```

---

## 🛠️ Tech Stack

| Tool | Purpose |
|---|---|
| Terraform | Provision AWS EC2 infrastructure automatically |
| AWS EC2 (t2.micro) | Host the Docker container |
| Docker | Containerize the Vite React app (multi-stage build) |
| GitHub Actions | Automated CI/CD pipeline on every git push |
| DockerHub | Store and version Docker images |
| Vite + React 19 | Frontend application |
| Node.js 20 | Build environment |
| Nginx | Serve production build |

---

## 📁 Project Structure

```
harryPotter/
├── .github/
│   └── workflows/
│       └── deploy.yml          ← GitHub Actions CI/CD pipeline
├── vite-project/
│   ├── src/                    ← React source code
│   ├── public/
│   ├── Dockerfile              ← Multi-stage Docker build
│   ├── package.json
│   └── terraform-infra/        ← AWS infrastructure code
│       ├── main.tf             ← EC2, Security Group, Key Pair
│       ├── variables.tf        ← Region, AMI, instance type
│       ├── outputs.tf          ← EC2 IP, App URL, SSH command
│       ├── terraform.tf        ← Provider versions
│       └── userdata.sh         ← EC2 bootstrap script
└── README.md
```

---

## 🚀 Complete Setup & Demo Guide

### Prerequisites

- Terraform >= 1.3.0
- AWS CLI configured (`aws configure`)
- Git
- GitHub account
- DockerHub account (`piyushchopade`)

---

### STEP 1 — Create AWS Infrastructure (Terraform)

```powershell
cd "vite-project\terraform-infra"
terraform init
terraform apply --auto-approve
```

Output:
```
ec2_public_ip = "x.x.x.x"
app_url       = "http://x.x.x.x"
ssh_command   = "ssh -i harry-potter-key.pem ubuntu@x.x.x.x"
```

---

### STEP 2 — Fix PEM & SSH into EC2

```powershell
# Fix PEM permissions (Windows)
icacls "vite-project\terraform-infra\harry-potter-key.pem" /inheritance:r /grant:r "$($env:USERNAME):(R)"

# SSH into EC2
ssh -i "vite-project\terraform-infra\harry-potter-key.pem" ubuntu@<EC2_IP>
```

---

### STEP 3 — Install Docker on EC2

```bash
sudo apt-get update -y
sudo apt-get install -y docker.io
sudo systemctl enable docker
sudo systemctl start docker
sudo chmod 666 /var/run/docker.sock
docker --version
```

---

### STEP 4 — Configure GitHub Secrets

Go to: **GitHub Repo → Settings → Secrets → Actions → New repository secret**

| Secret Name | Value |
|---|---|
| `DOCKER_USERNAME` | `piyushchopade` |
| `DOCKER_PASSWORD` | DockerHub password |
| `EC2_HOST` | EC2 Public IP from terraform output |
| `EC2_SSH_KEY` | Full contents of `harry-potter-key.pem` |

> ⚠️ Update `EC2_HOST` every time you run `terraform apply` — IP changes!

---

### STEP 5 — Trigger the Pipeline

```powershell
cd path\to\harryPotter
git commit --allow-empty -m "Trigger pipeline for demo"
git push origin main
```

---

### STEP 6 — Watch GitHub Actions

```
https://github.com/piyushdevops-3ri/Harry/actions
```

Pipeline stages (completes in ~42 seconds):
```
✅ Set up job             (2s)
✅ Checkout Code          (3s)
✅ Login to DockerHub     (1s)
✅ Build Docker Image     (9s)
✅ Push to DockerHub      (11s)
✅ Deploy on EC2          (12s)
✅ Complete job           (0s)
```

---

### STEP 7 — Access the App

Open in browser (use Chrome for best experience):
```
http://<EC2_IP>
```

🎉 **Harry Potter App is LIVE!**

---

### STEP 8 — Cleanup (Save AWS Cost)

```powershell
cd "vite-project\terraform-infra"
terraform destroy --auto-approve
```

---

## 🐳 Dockerfile (Multi-stage Build)

```dockerfile
# Build Stage — Node 20 + Vite build
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Production Stage — Nginx serves static files
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
RUN echo 'server { listen 80; location / { root /usr/share/nginx/html; index index.html; try_files $uri $uri/ /index.html; } }' > /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

---

## ⚙️ GitHub Actions Pipeline (deploy.yml)

```yaml
name: Harry Potter App - CI/CD Pipeline

on:
  push:
    branches:
      - main

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: docker/login-action@v3
      - run: docker build + push to DockerHub
      - uses: appleboy/ssh-action → deploy on EC2
```

---

## ⚠️ Troubleshooting

| Issue | Cause | Fix |
|---|---|---|
| Docker not found on EC2 | userdata didn't run | Install manually via apt-get |
| Pipeline fails - Dockerfile not found | Wrong working directory | Add `cd vite-project` in workflow |
| Node version error | Vite 8 needs Node 20+ | Use `node:20-alpine` in Dockerfile |
| EC2 IP changed | After terraform destroy/apply | Update `EC2_HOST` secret in GitHub |
| App not loading | Container not running | SSH in and check `docker ps` |
| Button clicks not working | Firefox GSAP issue | Use Chrome browser |

---

## 🔐 Security Ports

| Port | Service |
|---|---|
| 22 | SSH access |
| 80 | Harry Potter App (HTTP) |

---

## 👤 Author

**Piyush Anil Chopade**
GitHub: [piyushdevops-3ri](https://github.com/piyushdevops-3ri)
DockerHub: [piyushchopade](https://hub.docker.com/u/piyushchopade)
