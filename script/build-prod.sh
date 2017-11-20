#!/bin/sh

pushd . >/dev/null
cd `dirname $0`/..

echo 'Building production package...'
npm run build || exit -1

rm -rf dist
mkdir -p dist

echo "Build successful!"

script/deploy-prod.sh

popd >/dev/null
