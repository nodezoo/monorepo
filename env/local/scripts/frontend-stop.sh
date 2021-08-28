#!/bin/bash

# Bash 'strict' mode
#
set -euo pipefail
IFS=$'\n\t'


source ./env/sim/scripts/common.sh

cat "${FRONTEND_PID_FILEPATH}" | xargs kill -9

