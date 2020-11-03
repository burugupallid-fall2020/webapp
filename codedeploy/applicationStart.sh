#!/bin/bash
echo "------Start of Application Start-------"
TIMESTAMP=`date "+%Y-%m-%d %H:%M:%S"`
echo "$TIMESTAMP"

echo "Navigate to /home/ubuntu/webapp"
cd /home/ubuntu/webapp
echo "start the webapplication and store the logs to app.log"
sudo nohup node app.js >> app.log 2>&1 &

TIMESTAMP=`date "+%Y-%m-%d %H:%M:%S"`
echo "$TIMESTAMP"
echo "------End of Application Start-------"
