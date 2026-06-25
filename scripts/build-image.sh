#!/usr/bin/env bash
set -euo pipefail

IMAGE_NAME="${1:-local-next-app:latest}"
DOCKERFILE=${2:-prod.Dockerfile}

echo "Building ${IMAGE_NAME} using ${DOCKERFILE}"
docker build -t "${IMAGE_NAME}" -f "${DOCKERFILE}" .

echo "Built ${IMAGE_NAME}" 
