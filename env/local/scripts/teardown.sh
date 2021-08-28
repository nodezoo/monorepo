#!/bin/bash


# Bash 'strict' mode
#
set -euo pipefail
IFS=$'\n\t'


# There is currently no need to tear down the frontend in the local env.
#


# Tearing down the mock npm API
#
docker-compose -f ./env/local/devassets/mock-api-npm/docker-compose.yaml down
rm ./env/local/devassets/mock-api-npm


# Tearing down the mock GitHub API
#
docker-compose -f ./env/local/devassets/mock-api-github/docker-compose.yaml down
rm ./env/local/devassets/mock-api-github

