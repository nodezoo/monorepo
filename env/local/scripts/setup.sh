#!/bin/bash


# Bash 'strict' mode
#
set -euo pipefail
IFS=$'\n\t'


test -d ./env/local/devassets || mkdir ./env/local/devassets


# Setting up the mock npm API
#
if ! test -d ./env/local/devassets/mock-api-npm; then
  git clone git@github.com:lilsweetcaligula/mock-api-npm.git \
    ./env/local/devassets/mock-api-npm

  # Link the mock server to the host environment. This is required
  # to be able to pass env vars to the mock server.
  #
  cp ./env/local/.env ./env/local/devassets/mock-api-npm/.env

  npm install --prefix ./env/local/devassets/mock-api-npm
fi

docker-compose -f ./env/local/devassets/mock-api-npm/docker-compose.yaml up -d


# Setting up the mock GitHub API
#
if ! test -d ./env/local/devassets/mock-api-github; then
  git clone git@github.com:lilsweetcaligula/mock-api-github.git \
    ./env/local/devassets/mock-api-github

  # Link the mock server to the host environment. This is required
  # to be able to pass env vars to the mock server.
  #
  cp ./env/local/.env ./env/local/devassets/mock-api-github/.env

  npm install --prefix ./env/local/devassets/mock-api-github
fi

docker-compose -f ./env/local/devassets/mock-api-github/docker-compose.yaml up -d

