#!/bin/sh

pushd . >/dev/null
cd `dirname $0`/..

npm install

npm run build && \
    echo "Build successful!"

popd >/dev/null
