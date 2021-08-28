#!/bin/bash


# Bash 'strict' mode
#
set -euo pipefail
IFS=$'\n\t'


# Setting up frontend
#
./env/local/scripts/frontend-start.sh

