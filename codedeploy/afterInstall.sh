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
TIMESTAMP=`date "+%Y-%m-%d %H:%M:%S"`
echo "$TIMESTAMP"
echo "------End of after install-------"
