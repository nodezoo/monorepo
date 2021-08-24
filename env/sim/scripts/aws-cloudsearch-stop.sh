#!/bin/bash

# Bash 'strict' mode
#
set -euo pipefail
IFS=$'\n\t'


docker-compose -f ./devassets/nozama-cloudsearch/nozama-cloudsearch.yaml down

