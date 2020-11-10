#!/bin/bash
echo "------Start of Application Start-------"
TIMESTAMP=`date "+%Y-%m-%d %H:%M:%S"`
echo "$TIMESTAMP"

echo "Navigate to /home/ubuntu/webapp"
cd /home/ubuntu/webapp
if [ -d "logs" ] 
then
    echo "Directory /home/ubuntu/webapp/logs exists." 
else
    sudo mkdir -p logs
    sudo touch logs/webapp.log
    sudo chmod 666 logs/webapp.log
fi
echo "start the webapplication and store the logs to app.log"
sudo nohup node app.js >> app.log 2>&1 &

TIMESTAMP=`date "+%Y-%m-%d %H:%M:%S"`
echo "$TIMESTAMP"
echo "------End of Application Start-------"
