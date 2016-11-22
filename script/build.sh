#!/bin/sh

pushd . >/dev/null
cd `dirname $0`/..

npm install

npm run build:test && \
    npm test && \
    npm run prod && \
    echo "Build successful!"

popd >/dev/null
