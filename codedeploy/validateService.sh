#!/bin/bash

# This script is used to validate application 
TIMESTAMP=`date "+%Y-%m-%d %H:%M:%S"`
echo "$TIMESTAMP"
TIMESTAMP=`date "+%Y-%m-%d %H:%M:%S"`
echo "$TIMESTAMP"
count_port=$(netstat -an | grep 8080 | grep LISTEN | wc -l)
if [ "$count_port" -lt 1 ]; then
    exit 1
else
    exit 0
fi
echo "application is successfully running"
