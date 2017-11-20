#!/bin/bash

ssh deployer@pomeranssi.fi "cd ~/calculators && git pull && npm install && script/build-prod.sh"
