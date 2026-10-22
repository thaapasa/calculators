[![Test Calculators](https://github.com/thaapasa/calculators/actions/workflows/test.yml/badge.svg)](https://github.com/thaapasa/calculators/actions/workflows/test.yml)

# Calculators

A collection of handy browser-based calculator tools, live at
[laskurit.pomeranssi.fi](https://laskurit.pomeranssi.fi).

All calculations run locally in the browser. No data is sent to any server, so you can
safely calculate password hashes and other sensitive values.

## Features

- **Time & dates** — date arithmetic, timestamps, name days
- **Numbers** — binary, hexadecimal, octal conversions
- **Identifiers** — Finnish national ID (hetu) generation/validation, company IDs, bank references
- **Colors** — color conversions and analysis
- **Byte sizes** — byte/KB/MB/GB conversions
- **Links** — URL encoding/decoding and manipulation
- **Data pipeline** — chainable text/binary operations: encoding (Base64, Base64url, hex, URL,
  HTML entities, JWT decode), text transforms (ROT-N, case, sort, trim, unique), formatting
  (JSON, XML, JSONPath extract and set), hashing (MD5, SHA-\*, HMAC, PBKDF2, Argon2id, bcrypt,
  CRC-32), compression (gzip, deflate), and display (hex dump, image/SVG preview, statistics). Supports text input, file drag-and-drop, and URL fetch.
  Operations are drag-and-drop reorderable with per-operation configuration.
- **Cryptography** — MD5, SHA-1, SHA-256, SHA-512 hashing
- **Pixel density** — DPI/PPI calculations
- **Work time** — track start and end times for a day, with lunch and commute deductions
- **UUID** — validation and UUID v7 timestamp parsing
- **Finnish and English** — the whole UI switches language, and every page has a path in both
- **Dark mode** — system, light, and dark theme support

## Getting started

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

## Tech stack

- [React](https://react.dev/) 19 + [TypeScript](https://www.typescriptlang.org/) 6
- [Tailwind CSS](https://tailwindcss.com/) 4 + [shadcn/ui](https://ui.shadcn.com/) components
- [React Router](https://reactrouter.com/) 8
- [Vite](https://vite.dev/) 8 (build & dev server)
- [Vitest](https://vitest.dev/) (testing)
- [@dnd-kit](https://dndkit.com/) (drag-and-drop)

## License

[MIT](LICENSE.md)
