[![Test Calculators](https://github.com/thaapasa/calculators/actions/workflows/test.yml/badge.svg)](https://github.com/thaapasa/calculators/actions/workflows/test.yml)

# Calculators

A collection of handy browser-based calculator tools, live at
[laskurit.pomeranssi.fi](https://laskurit.pomeranssi.fi).

All calculations run locally in the browser — no data is sent to any server,
so you can safely calculate password hashes and other sensitive values.

## Features

- **Time & dates** — date arithmetic, timestamps, name days
- **Numbers** — binary, hexadecimal, octal conversions
- **Identifiers** — Finnish national ID (hetu) generation/validation, company IDs, bank references
- **Colors** — color conversions and analysis
- **Byte sizes** — byte/KB/MB/GB conversions
- **Links** — URL encoding/decoding and manipulation
- **Text conversions** — Base64, ROT13, XML/JSON conversion
- **Cryptography** — MD5, SHA-1, SHA-256, SHA-512 hashing
- **UUID** — validation and UUID v7 timestamp parsing

## Getting Started

Requires [Node.js](https://nodejs.org/) and [Yarn](https://yarnpkg.com/).

```bash
yarn                # Install dependencies
yarn start          # Dev server at http://localhost:3000
```

## Scripts

```bash
yarn build          # Production build (output in dist/)
yarn test           # Run tests
yarn lint           # ESLint + TypeScript type checking
yarn fix            # Auto-fix ESLint issues
yarn deploy         # Build and deploy to production
```

## Tech Stack

- [React](https://react.dev/) 19 + [TypeScript](https://www.typescriptlang.org/) 5
- [Material-UI](https://mui.com/) 7
- [Vite](https://vite.dev/) 7 (build & dev server)
- [Vitest](https://vitest.dev/) (testing)

## License

[MIT](LICENSE.md)
