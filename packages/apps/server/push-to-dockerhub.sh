#!/bin/bash

# Exit on error
set -e

# Load environment variables from .env file
load_env() {
  ENV_FILE=".env"
  if [ -f "$ENV_FILE" ]; then
    source "$ENV_FILE"
    echo "Loaded environment from $ENV_FILE"
  else
    echo "No .env file found. Will use defaults and/or prompt for values."
  fi
}
load_env

# Get Docker Hub username from .env or prompt
DOCKER_USERNAME=${DOCKERHUB_USERNAME:-""}
if [ -z "$DOCKER_USERNAME" ]; then
  read -p "Enter your Docker Hub username: " DOCKER_USERNAME
  if [ -z "$DOCKER_USERNAME" ]; then
    echo "Docker Hub username is required"
    exit 1
  fi
else
  echo "Using Docker Hub username from .env: $DOCKER_USERNAME"
fi

# Get Docker Hub password from .env or prompt
DOCKER_PASSWORD=${DOCKERHUB_PASSWORD:-""}
if [ -z "$DOCKER_PASSWORD" ]; then
  read -s -p "Enter your Docker Hub password: " DOCKER_PASSWORD
  echo
  if [ -z "$DOCKER_PASSWORD" ]; then
    echo "Docker Hub password is required"
    exit 1
  fi
else
  echo "Using Docker Hub password from .env"
fi

# Get image version
IMAGE_VERSION=${DOCKERHUB_IMAGE_VERSION:-""}
if [ -z "$IMAGE_VERSION" ]; then
  read -p "Enter image version (e.g., 1.0.0) [latest]: " IMAGE_VERSION
  IMAGE_VERSION=${IMAGE_VERSION:-latest}
else
  echo "Using image version from .env: $IMAGE_VERSION"
fi

# Get image name from package.json
IMAGE_NAME=$(jq -r '.name' package.json | sed 's/@fanslib\///')
if [ -z "$IMAGE_NAME" ] || [ "$IMAGE_NAME" = "null" ]; then
  IMAGE_NAME="fanslib-server"
else
  echo "Using image name from package.json: $IMAGE_NAME"
fi

# Image name
FULL_IMAGE_NAME="$DOCKER_USERNAME/$IMAGE_NAME:$IMAGE_VERSION"
echo "Pushing image to Docker Hub: $FULL_IMAGE_NAME"

echo "Logging in to Docker Hub..."
if ! echo "$DOCKER_PASSWORD" | docker login -u "$DOCKER_USERNAME" --password-stdin; then
  echo "Docker login failed. Please check your credentials."
  exit 1
fi

# Create docker-bake.hcl file for cross-platform building
echo "Creating docker-bake.hcl configuration..."
cat > docker-bake.hcl <<EOF
group "default" {
  targets = ["app"]
}

target "app" {
  context = "."
  tags = [
    "${FULL_IMAGE_NAME}"
  ]
  platforms = ["linux/amd64"]
}
EOF

# Set up buildx builder
echo "Setting up buildx builder..."
docker buildx use default || docker buildx create --use

# Install QEMU for multi-architecture support
echo "Installing QEMU for multi-architecture support..."
docker run --privileged --rm tonistiigi/binfmt --install all

# Build with buildx bake
echo "Building and pushing multi-architecture image with buildx bake..."
if docker buildx bake --push; then
  echo "✅ Successfully built and pushed multi-architecture image: $FULL_IMAGE_NAME"
else
  echo "❌ Failed to build and push multi-architecture image: $FULL_IMAGE_NAME"
  exit 1
fi