ip_address=`sudo ifconfig wlan0 2>/dev/null|awk '/inet addr:/ {print $2}'|sed 's/addr://'`
sudo redis-cli -h 128.199.172.201 SET urlredirect http://${ip_address}
