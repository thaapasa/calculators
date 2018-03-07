#!/bin/bash

pushd . >/dev/null
cd `dirname $0`/..

export REV=`git rev-parse HEAD | cut -c 1-8`
script/build-prod.sh

echo "Copying files to production (rev $REV)..."

ssh deployer@pomeranssi.fi "mkdir -p calculators/deploy" || exit -1
scp deploy/calculators-$REV.tar.gz deployer@pomeranssi.fi:~/calculators/deploy || exit -1

echo "Deploying on server..."

ssh deployer@pomeranssi.fi "bash --login -c 'cd ~/calculators && git pull && script/install-prod.sh $REV'"

popd >/dev/null
