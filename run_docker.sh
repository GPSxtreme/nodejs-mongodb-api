#!/bin/bash

# Create a logs directory if it doesn't exist
mkdir -p logs

# Function to read .env file and set environment variables
set_env_vars() {
  if [ -f "$ENV_FILE_PATH" ]; then
    # Read the .env file and set the environment variables
    export $(cat "$ENV_FILE_PATH" | grep -v '^#' | xargs)
  else
    echo "Warning: .env file not found. Some environment variables may not be set."
  fi
}

# Prompt the user to choose from available Docker images
echo "Available Docker images:"
docker images
read -p "Enter the name of the Docker image you want to use: " DOCKER_IMAGE_NAME

# Prompt the user to enter the version or use the default (latest)
read -p "Enter the version of the Docker image (default is latest): " IMAGE_VERSION
IMAGE_VERSION=${IMAGE_VERSION:-latest}

# Prompt the user to enter the port number or use the default (8000)
read -p "Enter the port number to use (default is 8000): " PORT
PORT=${PORT:-8000}

# Prompt the user to enter the container name or let Docker choose it
read -p "Enter a name for the Docker container (leave empty to let Docker choose): " CONTAINER_NAME
CONTAINER_NAME=${CONTAINER_NAME:-}

# Get the path of the script's directory
SCRIPT_DIR=$(dirname "$0")

# Specify the path of the .env file (assuming it's in the same directory as the script)
ENV_FILE_PATH="$SCRIPT_DIR/.env"

# Set environment variables from .env file
set_env_vars

# Run the Docker container with the provided port number and environment variables
if [ -n "$CONTAINER_NAME" ]; then
  docker run -d -p $PORT:8000 --env-file "$ENV_FILE_PATH" --name "$CONTAINER_NAME" $DOCKER_IMAGE_NAME:$IMAGE_VERSION > logs/docker_log.txt 2>&1
else
  docker run -d -p $PORT:8000 --env-file "$ENV_FILE_PATH" $DOCKER_IMAGE_NAME:$IMAGE_VERSION > logs/docker_log.txt 2>&1
fi
