#!/bin/sh

pushd . >/dev/null
cd `dirname $0`/..

echo 'Installing dependencies...'
npm install

echo 'Building production package...'
npm run build || exit -1

echo "Build successful!"

popd >/dev/null
