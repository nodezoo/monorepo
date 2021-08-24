#!/bin/bash


# Bash 'strict' mode
#
set -euo pipefail
IFS=$'\n\t'


docker-compose -f ./env/sim/scripts/aws-dynamodb.yaml down
