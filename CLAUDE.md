# Calculators

Browser-based calculator tools at https://laskurit.pomeranssi.fi. All calculations run client-side (no server processing).

## Commands

```bash
yarn start          # Dev server on port 3000
yarn build          # Production build (Vite)
yarn test           # Run tests (vitest run)
yarn lint           # ESLint + TypeScript check
yarn lint-eslint    # ESLint only
yarn lint-tsc       # TypeScript check only (tsc --noEmit)
yarn fix            # Auto-fix ESLint issues
```

## Tech Stack

- React 18 + TypeScript 5.6, Material-UI 6, React Router 6
- Vite 5 + SWC for build/dev, Vitest for testing
- Yarn 4 (PnP disabled, node-modules linker)
- BaconJS for reactive streams in some components

## Project Structure

```
src/
  index.tsx              # Entry point
  style.ts               # MUI theme
  app/
    calc/                # Pure calculation logic (no React)
    ui/                  # Page components + routes
      component/         # Reusable UI components
      layout/            # Layout (topbar, drawer, logo)
    util/                # Utilities, hooks, helpers
```

Pages: Time, Numbers, Identifiers (HETU/company ID), Colors, ByteSizes, Links, TextConversion, Cryptography.

Routes are bilingual (Finnish + English), defined in `src/app/ui/routes.tsx`.

## Code Style

- Prettier: single quotes, trailing commas, 2-space indent, 100 char width, no parens on single arrow params
- ESLint flat config (`eslint.config.js`): typescript-eslint, react-hooks, simple-import-sort, unused-imports
- Prefix unused variables with `_`
- TypeScript strict mode (noImplicitAny, strictNullChecks, noImplicitReturns, noUnusedLocals)
- ES module project (`"type": "module"` in package.json)
- tsconfig baseUrl is `src` — imports resolve from src directory

## Testing

Tests are colocated with source files (`.test.ts` extension). Use `describe`/`it`/`expect` from vitest.

## Deployment

`yarn deploy` builds and SCPs to production server via `script/deploy.sh`.
