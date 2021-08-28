#!/bin/bash

# Bash 'strict' mode
#
set -euo pipefail
IFS=$'\n\t'


export LOCAL_DEVASSETS_DIRPATH='./env/local/devassets'

export FRONTEND_PID_DIRPATH="${LOCAL_DEVASSETS_DIRPATH}"
export FRONTEND_PID_FILEPATH="${FRONTEND_PID_DIRPATH}/frontend.pid"

export FRONTEND_LOG_DIRPATH="${LOCAL_DEVASSETS_DIRPATH}"
export FRONTEND_LOG_FILEPATH="${FRONTEND_LOG_DIRPATH}/frontend.log"

