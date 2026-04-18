import { putValue } from 'app/util/store';
import React, { useCallback, useContext, useEffect } from 'react';

import { detectInitialLang, LANGUAGE_STORAGE_KEY } from './detect';
import { en } from './en';
import { fi, type TranslationKey } from './fi';
import type { Lang } from './types';

const tables: Record<Lang, Record<TranslationKey, string>> = { fi, en };

interface LanguageContextValue {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: TranslationKey) => string;
}

const LanguageContext = React.createContext<LanguageContextValue>({
  lang: 'fi',
  setLang: () => {},
  t: k => fi[k],
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = React.useState<Lang>(detectInitialLang);

  const setLang = useCallback((next: Lang) => {
    setLangState(next);
    putValue(LANGUAGE_STORAGE_KEY, next);
  }, []);

  const t = useCallback((key: TranslationKey) => tables[lang][key], [lang]);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.title = tables[lang]['meta.title'];
    const desc = document.querySelector('meta[name="description"]');
    if (desc) desc.setAttribute('content', tables[lang]['meta.description']);
  }, [lang]);

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>{children}</LanguageContext.Provider>
  );
}

export function useTranslation() {
  return useContext(LanguageContext);
}
