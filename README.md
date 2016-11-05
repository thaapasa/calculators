# README #

### Calculators ###

Need to calculate some SHA1-hashes? Want to generate a few Finnish
national identification numbers (hetu)? 

This repo contains the source code for a static web page that has all 
those nifty calculators working in the browser. No data is sent anywhere,
so you can calculate password hashes safely.

### Installation instructions ###

Install dependencies:

    sudo npm install -g grunt-cli
    npm install

Build project:

    grunt
    
Develop (watch for source-file changes):

    grunt watch

### See the results ###

After building, open the file `public/index.html` in your browser.

