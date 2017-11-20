#!/bin/sh

pushd . >/dev/null
cd `dirname $0`/..

echo 'Deploying production package...'
rm -rf dist
mkdir -p dist || exit -1
cp -r build/* dist || exit -1

echo "Deploy successful!"

popd >/dev/null
