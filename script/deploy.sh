#!/bin/bash

pushd . >/dev/null
cd `dirname $0`/..

HOST=laskurit.pomeranssi.fi

export REV=`git rev-parse HEAD | cut -c 1-8`
script/build-prod.sh

echo "Copying files to production (rev $REV)..."

ssh deployer@$HOST "mkdir -p calculators/deploy" || exit -1
scp deploy/calculators-$REV.tar.gz deployer@$HOST:~/calculators/deploy || exit -1

echo "Deploying on server..."

ssh deployer@$HOST "bash --login -c 'cd ~/calculators && git pull && script/install-prod.sh $REV'"

popd >/dev/null
