#!/bin/bash

# This script is used to validate application 
TIMESTAMP=`date "+%Y-%m-%d %H:%M:%S"`
echo "$TIMESTAMP"
echo "check to see, if the application is running using netstat command, grep to 8080"
listencount=$(netstat -an | grep 8080 | grep LISTEN | wc -l)
echo "$listencount"
echo "application is successfully running"
