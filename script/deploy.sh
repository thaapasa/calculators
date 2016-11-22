#!/bin/bash

ssh deployer@pomeranssi.fi "cd ~/calculators && git pull && ./build.sh"
