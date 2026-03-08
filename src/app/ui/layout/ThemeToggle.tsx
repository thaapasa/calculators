import { Button } from 'components/ui/button';
import { MonitorSmartphone, Moon, Sun } from 'lucide-react';
import React from 'react';

import { ThemePreference, useTheme } from '../../util/ThemeContext';

const nextPreference: Record<ThemePreference, ThemePreference> = {
  system: 'light',
  light: 'dark',
  dark: 'system',
};

const labels: Record<ThemePreference, string> = {
  system: 'Järjestelmän teema',
  light: 'Vaalea teema',
  dark: 'Tumma teema',
};

const icons: Record<ThemePreference, React.ComponentType<{ className?: string }>> = {
  system: MonitorSmartphone,
  light: Sun,
  dark: Moon,
};

export function ThemeToggle() {
  const { preference, setPreference } = useTheme();
  const Icon = icons[preference];
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setPreference(nextPreference[preference])}
      title={labels[preference]}
      className="text-white/70 hover:text-white hover:bg-white/10"
    >
      <Icon />
    </Button>
  );
}
