#!/bin/bash
echo "------Start of after Install-------"
TIMESTAMP=`date "+%Y-%m-%d %H:%M:%S"`
echo "$TIMESTAMP"
echo "Present working Directly"
pwd
ls -lrt
sudo unzip build_artifact.zip
echo "#CSYE6225: doing after install: remove zip from webapp folder"
pwd
ls -lrt
cd ..
sudo cp /home/ubuntu/webapp/codedeploy/cloudwatch-config.json /opt/aws/amazon-cloudwatch-agent/etc/
x
sudo /opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent-ctl -a fetch-config -m ec2 -c file:/opt/aws/amazon-cloudwatch-agent/etc/cloudwatch-config.json -s
TIMESTAMP=`date "+%Y-%m-%d %H:%M:%S"`
echo "$TIMESTAMP"
echo "------End of after install-------"
