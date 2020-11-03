#!/bin/bash
echo "Navigate to /home/ubuntu/webapp=========="
cd /home/ubuntu/webapp
echo "start the webapplication and store the logs to app.log"
sudo nohup node app.js >> app.log 2>&1 &