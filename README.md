[![Build Status](https://travis-ci.org/thaapasa/calculators.svg?branch=master)](https://travis-ci.org/thaapasa/calculators)

# README

## Calculators

Need to calculate some SHA1-hashes? Want to generate a few Finnish
national identification numbers (hetu)?

This repo contains the source code for a static web page that has all
those nifty calculators working in the browser. No data is sent anywhere,
so you can calculate password hashes safely.

## Installation instructions

Install dependencies:

    yarn

Build project:

    yarn build

Develop (watch for changes):

    yarn start

Run tests:

    yarn test

### See the results

After building, open the file `build/index.html` in your browser.

## Miscellaneous

`styled-components` and `@material-ui/core` do not work well together because of typing issues.
See https://github.com/DefinitelyTyped/DefinitelyTyped/issues/29832.

Use `const Whatever = styled(Button)... as typeof Button;` to work around the issue.
