#!/bin/sh

pushd . >/dev/null
cd `dirname $0`/..

mkdir -p deploy || exit -1

echo "Updating dependencies"
yarn || exit -1

REV=`git rev-parse HEAD | cut -c 1-8`

echo "Building production package, revision $REV..."
yarn clean || exit -1
yarn build || exit -1

cd build
tar czvf ../deploy/calculators-$REV.tar.gz . || exit -1
cd ..

echo "Build successful!"

popd >/dev/null
