#!/usr/bin/env bash
cd /home/ubuntu/my-app
sudo -H -u ubuntu pm2 start index.js --name "my-app" --force