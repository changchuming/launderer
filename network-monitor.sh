#!/bin/bash

TESTIP=8.8.8.8

sudo ping -c4 ${TESTIP} > /dev/null

if [ $? != 0 ]
then
    logger -t $0 "WiFi has gone down - restart"
    sudo ifdown --force wlan0
    sudo service dhcpcd restart
    sudo service ssh restart
    sudo ifup wlan0
else
    logger -t $0 "WiFi is currently ok"
fi
