#!/bin/bash
set -e
exec > /var/log/userdata.log 2>&1

echo "====== HARRY POTTER SERVER SETUP: $(date) ======"

# System update
apt-get update -y
apt-get upgrade -y

# Install Docker
apt-get install -y docker.io
systemctl enable docker
systemctl start docker
usermod -aG docker ubuntu
chmod 666 /var/run/docker.sock

echo "====== SETUP COMPLETE: $(date) ======"
echo "Docker version: $(docker --version)"
