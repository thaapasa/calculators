#!/bin/sh

pushd . >/dev/null
cd `dirname $0`/..

REV=`git rev-parse HEAD | cut -c 1-8`

echo "Creating distribution version $REV"

rm -rf dist
mkdir -p dist
cp -rf public/* dist/

mv dist/css/main.css dist/css/main-$REV.css
mv dist/js/calculators.min.js dist/js/calculators.min-$REV.js
sed -e "s/css\/main\.css/css\/main-$REV.css/g" -e "s/js\/calculators\.js/js\/calculators.min-$REV.js/g" -i "" dist/index.html

popd >/dev/null
