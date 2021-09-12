#!/bin/bash


# Bash 'strict' mode
#
set -euo pipefail
IFS=$'\n\t'


ENV_PATH='./env/sim'


test -d "${ENV_PATH}/devassets" || mkdir "${ENV_PATH}/devassets"


if ! test -d "${ENV_PATH}/devassets/wait-for-it"; then
  git clone https://github.com/vishnubob/wait-for-it.git "${ENV_PATH}/devassets/wait-for-it"
fi


docker-compose -f "${ENV_PATH}/docker-compose.yaml" up -d
${ENV_PATH}/devassets/wait-for-it/wait-for-it.sh dynamodb:18000 -- node "${ENV_PATH}/dynamodb-migrations/migrate.js"


