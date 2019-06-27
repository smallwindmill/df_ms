
#!/bin/bash

while true
do
    procnum=` ps -ef|grep "node"|grep -v grep|wc -l`
    # KylinListeningPort=`netstat -an | grep ":7070" | awk '$1 == "tcp" && $NF == "LISTEN" {print $0}' | wc -l`
   if [ $procnum -eq 0 ]; then
      cd /var/www/html/produceMS/
      echo $procnum '---'`date +%Y-%m-%d-%H-%M-%S`'重启了'
      nohup node index.js > logs/'do'`date +%Y%m%d-%H%M%S`'.log'  &
   #else
     # echo $procnum '---'`date +%Y-%m-%d-%H-%M-%S`'没有重启'
   fi
   sleep 30
done
