#!/bin/bash
echo "------Executing Application Stop-------"
TIMESTAMP=`date "+%Y-%m-%d %H:%M:%S"`
echo "$TIMESTAMP"
echo "get the proces id"
PID=`ps -eaf | grep "node app.js" | grep -v grep | awk '{print $2}'`
echo "process id not empty ? $PID"
if [[ "" !=  "$PID" ]]; then
  echo "killing $PID"
  sudo kill -9 $PID
fi
TIMESTAMP=`date "+%Y-%m-%d %H:%M:%S"`
echo "$TIMESTAMP"
echo "------End of Application Stop-------"
