#!/bin/bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

# start HTTP server
HTTP_SERVER_PORT=17979
http-server -c-1 -p ${HTTP_SERVER_PORT} ${DIR}/puppeteer-smoke-test-front-end &
HTTP_SERVER_PID=$!
echo "HTTP server running, PID=${HTTP_SERVER_PID}"
ps -p ${HTTP_SERVER_PID} -o comm=
sleep 1 # wait for server init

# test plain text file using curl
TEXT_PATH="/text.txt"
TEXT_OUTPUT_ACTUAL=$( curl -s http://localhost:${HTTP_SERVER_PORT}${TEXT_PATH} )
TEXT_OUTPUT_EXPECTED="this is text"
echo ${TEXT_OUTPUT_ACTUAL}
if [ "${TEXT_OUTPUT_ACTUAL}" != "${TEXT_OUTPUT_EXPECTED}" ] ; then
  kill ${HTTP_SERVER_PID}
  echo "${TEXT_PATH} - expected output to be ${TEXT_OUTPUT_EXPECTED}, but found ${TEXT_OUTPUT_ACTUAL}"
  exit 1
fi

# clean up
kill ${HTTP_SERVER_PID}
exit 0
