# Architecture

## Client only

Every calculation runs in the browser, so nothing the user types reaches a server. This is
the main promise of the app: a user can hash a password or decode a token without sending
it anywhere. A feature that needs a backend does not belong here.

## Source layout

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

The calculation logic under `app/calc` does not import React, so it can be tested without
rendering anything. Most of the tests are there.

## Pages

The pages are Time, Numbers, Identifiers (HETU and company ID), Colors, ByteSizes, Links,
Pipeline (text conversions), Cryptography, PixelDensity and WorkTime. The index route
renders every page on one scrolling page.

## Languages and routes

The UI ships in Finnish and English. `src/app/i18n/fi.ts` and `en.ts` hold the string
tables, and components read them through `t()` from `LanguageContext`.

Each page has a Finnish path and an English path, for example `/p/aika` and `/p/time`.
If you add a page, update two places:

- `src/app/ui/Routes.tsx` declares the routes.
- `src/app/i18n/routeMap.ts` maps paths to page ids. The language toggle uses this map to
  swap the URL. It also holds the old path aliases, such as `/p/merkit`.
