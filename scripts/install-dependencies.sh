#!/usr/bin/env bash
SCRIPTPATH="$( cd "$(dirname "$0")" ; pwd -P )"
cd $SCRIPTPATH/..
npm i
cp /home/ubuntu/my-app.old/.env .env