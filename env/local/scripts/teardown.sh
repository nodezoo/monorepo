#!/bin/bash


# Bash 'strict' mode
#
set -euo pipefail
IFS=$'\n\t'


# Tearing down the mock npm API
#
docker-compose -f ./env/local/devassets/mock-api-npm/docker-compose.yaml down
rm ./env/local/devassets/mock-api-npm -rf


# Tearing down the mock GitHub API
#
docker-compose -f ./env/local/devassets/mock-api-github/docker-compose.yaml down
rm ./env/local/devassets/mock-api-github -rf

