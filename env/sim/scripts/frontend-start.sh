#!/bin/bash

# Bash 'strict' mode
#
set -euo pipefail
IFS=$'\n\t'


source ./env/sim/scripts/common.sh


# TODO: Uncomment this:
#npm run build --prefix ./srv/web/www2


test -d "${FRONTEND_PID_DIRPATH}" || mkdir "${FRONTEND_PID_DIRPATH}"


tmppidpath=$(mktemp)


# For more information on acquisition a pid of a background-running process,
# please see:
#
# https://stackoverflow.com/questions/20254155/how-to-run-nohup-and-write-its-pid-file-in-a-single-bash-statement#answer-54516616
#

# Clearing the pid so that later we know - if the pid-file is empty,
# then the frontend server failed to start.
#

nohup npm run sim-serve --prefix ./srv/web/www2 > \
  "${FRONTEND_LOG_FILEPATH}" 2>&1 &

echo $! > "${tmppidpath}"

sleep 5


if cat "${tmppidpath}" | pgrep -P $! > "${tmppidpath}";
then
  # For more information on why we are incrementing the pid,
  # please see:
  #
  # https://stackoverflow.com/questions/20254155/how-to-run-nohup-and-write-its-pid-file-in-a-single-bash-statement#comment-63204696
  #
  # Please note that this workaround may turn out to be suboptimal.
  # Better alternatives, if there are any available ones, would be welcome.
  #
  pid=$(head -n1 "${tmppidpath}")
  frontend_pid=$(($pid+1))

  echo "${frontend_pid}" > "${FRONTEND_PID_FILEPATH}"
  cat "${FRONTEND_LOG_FILEPATH}"
else
  # If the pid-file is empty, then the frontend server failed to start.
  #

  echo 'ERROR: the frontend server failed to start.'
  cat "${FRONTEND_LOG_FILEPATH}" > /dev/stderr

  exit 1
fi

