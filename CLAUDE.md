# Calculators

Browser-based calculator tools at https://laskurit.pomeranssi.fi. All calculations run
client-side, so nothing the user types reaches a server. Keep it that way: a feature that
needs a backend does not belong here.

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

## Git

Do not commit until I ask you to. Finish the work, tell me what changed, and leave it in
the working tree.

## Tech stack

- React 19 + TypeScript 6, React Router 8
- Tailwind CSS 4 with shadcn/ui components, lucide-react icons
- Vite 8 for build/dev, Vitest 5 for testing
- Yarn 4 (PnP disabled, node-modules linker)
- @dnd-kit for drag-and-drop, ramda, moment

## Project structure

```
src/
  index.tsx              # Entry point
  index.css              # Tailwind entry + theme variables
  components/ui/         # shadcn/ui primitives (button, card, select, ...)
  lib/utils.ts           # cn() class-name helper
  app/
    calc/                # Pure calculation logic (no React)
      pipeline/          # Data pipeline operations + registry
    i18n/                # Translations, language context, route map
    ui/                  # Page components + routes
      component/         # Reusable UI components
      layout/            # TopBar, Drawer, Logo, ThemeToggle
    util/                # Utilities, hooks, storage helpers
```

Pages: Time, Numbers, Identifiers (HETU/company ID), Colors, ByteSizes, Links, Pipeline
(text conversions), Cryptography, PixelDensity, WorkTime. The index route renders every
page on one scrolling page.

## Languages and routes

The UI ships in Finnish and English. `src/app/i18n/fi.ts` and `en.ts` hold the string
tables; components read them through `t()` from `LanguageContext`.

Each page has a Finnish path and an English path, for example `/p/aika` and `/p/time`.
Two places need updating when you add a page:

- `src/app/ui/Routes.tsx` declares the routes.
- `src/app/i18n/routeMap.ts` maps paths to page ids, which is what the language toggle
  uses to swap the URL. It also holds the old path aliases, such as `/p/merkit`.

## Code style

- Prettier: single quotes, trailing commas, 2-space indent, 100 char width, no parens on
  single arrow params
- ESLint flat config (`eslint.config.js`): typescript-eslint, react-hooks,
  simple-import-sort, unused-imports
- Prefix unused variables with `_`
- TypeScript strict mode (noImplicitAny, strictNullChecks, noImplicitReturns,
  noUnusedLocals)
- ES module project (`"type": "module"` in package.json)
- Imports use the tsconfig path aliases `app/*`, `lib/*` and `components/*`

## Testing

Tests sit next to the source file, named `*.test.ts`, or `*.test.tsx` when the test renders
a component. Use `describe`/`it`/`expect` from vitest. The calculation logic under
`app/calc` carries most of the tests; the UI has few.

There is no vitest config file, so tests run in the default node environment. A test that
needs a DOM opts in with `// @vitest-environment jsdom` on the first line and renders with
`@testing-library/react`.

## Deployment

`yarn deploy` builds and SCPs to the production server via `script/deploy.sh`.
