import { publishSelectedValue } from 'app/ui/LastValue';
import { useCallback, useState } from 'react';

export function useFocusPublisher<K extends string>(initial?: K) {
  const [selected, setSelected] = useState<K | undefined>(initial);

  const selectSrc = useCallback((key: K, value: string | Promise<string> | undefined) => {
    setSelected(key);
    if (value === undefined) return;
    if (typeof value === 'string' && value === '') return;
    publishSelectedValue(value);
  }, []);

  return { selected, selectSrc };
}
