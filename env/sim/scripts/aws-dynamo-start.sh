#!/bin/bash


# Bash 'strict' mode
#
set -euo pipefail
IFS=$'\n\t'


AWS_DYNAMO_PORT=18000
AWS_PROFILE_NAME='localtest'


docker run -d -p "${AWS_DYNAMO_PORT}":8000 amazon/dynamodb-local


# Configuring a profile for local testing.
#
echo -e 'none\nnone\nregion\n' | \
  aws configure --profile "${AWS_PROFILE_NAME}" >& /dev/null


# Making sure the database is reachable.
#
aws dynamodb list-tables \
  --endpoint-url http://localhost:"${AWS_DYNAMO_PORT}" \
  --profile "${AWS_PROFILE_NAME}"

