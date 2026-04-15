import { useTranslation } from 'app/i18n/LanguageContext';
import React from 'react';

import { ClipboardButton } from './component/ToolButton';

type Listener = (value: string) => void;
const listeners = new Set<Listener>();

export function publishSelectedValue(value: string | Promise<string>) {
  if (value instanceof Promise) {
    value.then(v => listeners.forEach(l => l(v)));
  } else {
    listeners.forEach(l => l(value));
  }
}

export function listenToSelectedValues(listener: Listener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function LastValue() {
  const { t } = useTranslation();
  const [value, setValue] = React.useState('');
  React.useEffect(() => listenToSelectedValues(setValue), [setValue]);
  return (
    <div className="inline-flex items-center">
      <ClipboardButton
        title={t('component.copyToClipboard')}
        onClick={() => navigator.clipboard.writeText(value)}
      />
      <input
        className="w-full bg-transparent border-b border-white/30 text-white outline-none px-2 py-1 placeholder:text-white/50"
        value={value}
        name="lastValue"
        placeholder={t('component.lastValuePlaceholder')}
        onChange={e => setValue(e.target.value)}
      />
    </div>
  );
}
