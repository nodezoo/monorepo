#!/bin/bash

# Bash 'strict' mode
#
set -euo pipefail
IFS=$'\n\t'


# DESCRIPTION: This script will download and install the mock
# environment for AWS CloudSearch. 

SUPPORTED_OPTS=':dD'

detached=0
show_desc=1

while getopts $SUPPORTED_OPTS option
do
    case $option in
        d  )    echo 'AWS CloudSearch simulation is running in detached mode.'; detached=1;;
        D  )    show_desc=0;;
        \? )    echo 'Unknown option.'; exit 1;;
        *  )    echo 'Missing option argument.'; exit 1;;
    esac
done


spin_up() {
  if [[ 1 = "${detached}" ]]; then
    docker-compose -f nozama-cloudsearch.yaml up -d
  else
    docker-compose -f nozama-cloudsearch.yaml up
  fi
}


if [[ 1 = "${show_desc}" ]]; then
  echo 'This script will spin up the AWS CloudSearch simulation at:'
  echo 'http://localhost:15808/'
  echo

  sleep 2
fi


if ! test -d ./env/sim/devassets/nozama-cloudsearch; then
  git clone git@github.com:oisinmulvihill/nozama-cloudsearch.git ./env/sim/devassets
fi

if ! test -f ./env/sim/devassets/nozama-cloudsearch/nozama-cloudsearch.yaml; then
  wget -P ./env/sim/devassets/nozama-cloudsearch \
    https://raw.githubusercontent.com/oisinmulvihill/nozama-cloudsearch/master/nozama-cloudsearch.yaml
fi

spin_up

