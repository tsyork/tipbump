#!/bin/bash
curl -Is http://localhost:3000 | head -n 1 | grep 200
STATUS=$(echo $?)
if [ "$STATUS" == 0 ]
then 
   echo " Application is Running Successfully "
else
   echo " Application is not running "
fi


