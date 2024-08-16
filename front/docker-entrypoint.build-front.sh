#!/bin/bash
cd /home/node/app
npm ci
echo ""
echo Building:
npm run build:prod:docker