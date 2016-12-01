# README #

### Calculators ###

Need to calculate some SHA1-hashes? Want to generate a few Finnish
national identification numbers (hetu)?

This repo contains the source code for a static web page that has all
those nifty calculators working in the browser. No data is sent anywhere,
so you can calculate password hashes safely.

### Installation instructions ###

Install dependencies:

    npm install

#### Linux / Mac ####

Build project (app + tests):

    npm run build
    
Develop (watchify):

    npm run watch

Run tests:

    npm test

Build production package under `dist` directory:

    scripts/build-prod.sh

#### Windows ####

`npm` scripts do not work in Windows currently (environment variables are set with
different syntax, and I've had problems with `watchify`: `npm watch` does not always 
rebuild). You can run `grunt` tasks instead.

Install grunt (run with Administrator privileges): 

    npm install -g grunt-cli

Build project:

    grunt

Watch for source-file changes:

    grunt watch

Develop (build & watch)

    grunt dev

### See the results ###

After building, open the file `public/index.html` in your browser.

