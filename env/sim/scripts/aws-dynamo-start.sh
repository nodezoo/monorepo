#!/bin/bash


# Bash 'strict' mode
#
set -euo pipefail
IFS=$'\n\t'


SUPPORTED_OPTS=':dD'


detached=0

while getopts $SUPPORTED_OPTS option
do
    case $option in
        d  )    detached=1;;
        \? )    echo 'Unknown option.'; exit 1;;
        *  )    echo 'Missing option argument.'; exit 1;;
    esac
done


spin_up() {
  if [[ 1 = "${detached}" ]]; then
    docker-compose -f ./env/sim/scripts/aws-dynamodb.yaml up -d
  else
    docker-compose -f ./env/sim/scripts/aws-dynamodb.yaml up
  fi
}


spin_up
