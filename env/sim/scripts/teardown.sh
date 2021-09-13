#!/bin/bash


# Bash 'strict' mode
#
set -euo pipefail
IFS=$'\n\t'


ENV_PATH='./env/sim'


docker-compose -f "${ENV_PATH}/docker-compose.yaml" stop

