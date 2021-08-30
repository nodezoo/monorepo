#!/bin/bash

# Bash 'strict' mode
#
set -euo pipefail
IFS=$'\n\t'


docker-compose -f ./env/sim/devassets/nozama-cloudsearch/nozama-cloudsearch.yaml down
