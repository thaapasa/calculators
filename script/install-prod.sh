#!/bin/sh

pushd . >/dev/null
cd `dirname $0`/..

REV="$1"

if [ "$REV" == "" ] ; then 
  echo "Usage: $0 REVISION"
  exit -1
fi

echo "Installing new revision $REV"

echo "Extracting client..."
mkdir -p dist || exit -1
cd dist
tar xzvf ../deploy/calculators-$REV.tar.gz || exit -1
cd ..

popd >/dev/null
