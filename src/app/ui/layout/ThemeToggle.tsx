import { type TranslationKey } from 'app/i18n/fi';
import { useTranslation } from 'app/i18n/LanguageContext';
import { Button } from 'components/ui/button';
import { MonitorSmartphone, Moon, Sun } from 'lucide-react';
import React from 'react';

import { ThemePreference, useTheme } from '../../util/ThemeContext';

const nextPreference: Record<ThemePreference, ThemePreference> = {
  system: 'light',
  light: 'dark',
  dark: 'system',
};

const labelKeys = {
  system: 'theme.system',
  light: 'theme.light',
  dark: 'theme.dark',
} as const satisfies Record<ThemePreference, TranslationKey>;

const icons: Record<ThemePreference, React.ComponentType<{ className?: string }>> = {
  system: MonitorSmartphone,
  light: Sun,
  dark: Moon,
};

export function ThemeToggle() {
  const { preference, setPreference } = useTheme();
  const { t } = useTranslation();
  const Icon = icons[preference];
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setPreference(nextPreference[preference])}
      title={t(labelKeys[preference])}
      className="text-white/70 hover:text-white hover:bg-white/10"
    >
      <Icon />
    </Button>
  );
}
