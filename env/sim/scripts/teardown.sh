#!/bin/bash


# Bash 'strict' mode
#
set -euo pipefail
IFS=$'\n\t'


# Tearing down DynamoDb
#
./env/sim/scripts/aws-dynamo-stop.sh


# Tearing down Nozama the AWS CloudSearch simulator
#
./env/sim/scripts/aws-cloudsearch-stop.sh


# Tearing down frontend
#
./env/sim/scripts/frontend-stop.sh


