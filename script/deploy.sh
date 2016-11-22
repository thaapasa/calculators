#!/bin/bash

ssh deployer@pomeranssi.fi "cd ~/calculators && git pull && script/build-prod.sh"
