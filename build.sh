#!/bin/sh

npm install

npm run build:test && \
    npm test && \
    npm run prod && \
    echo "Build successful!"

