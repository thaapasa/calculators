import { getValue } from 'app/util/store';

import type { Lang } from './types';

export const LANGUAGE_STORAGE_KEY = 'language-preference';

export function detectInitialLang(): Lang {
  const stored = getValue<Lang>(LANGUAGE_STORAGE_KEY);
  if (stored === 'fi' || stored === 'en') return stored;
  const host = window.location.hostname;
  if (host === 'calculators.pomeranssi.fi') return 'en';
  if (host === 'laskurit.pomeranssi.fi') return 'fi';
  return 'fi';
}
