#!/bin/bash


# Bash 'strict' mode
#
set -euo pipefail
IFS=$'\n\t'


# Setting up DynamoDb
#
if ! curl "${LOCALHOST}:18000" -s >& /dev/null; then
  ./env/sim/scripts/aws-dynamo-start.sh -d


  until curl -s "${LOCALHOST}:18000/ping" >& /dev/null; do
    echo 'INFO: Waiting for the AWS DynamoDb instance to spin up...'
    sleep 2
  done

  node './env/sim/scripts/aws-dynamo-create-tables.js'
fi


# Setting up Nozama the AWS CloudSearch simulator
#
if ! curl "${LOCALHOST}:15808" -s >& /dev/null; then
  ./env/sim/scripts/aws-cloudsearch-start.sh -dD

  until curl -s 'http://localhost:15808/ping'; do
    echo 'INFO: Waiting for the AWS CloudSearch simulator to spin up...'
    sleep 2
  done
fi


# Setting up frontend
#
./env/sim/scripts/frontend-start.sh

