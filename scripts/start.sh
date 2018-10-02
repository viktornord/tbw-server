#!/usr/bin/env bash
SCRIPTPATH="$( cd "$(dirname "$0")" ; pwd -P )"
cd $SCRIPTPATH/..
./node_modules/.bin/pm2 start ./index.js --name "my-app" --force