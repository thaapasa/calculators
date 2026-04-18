import { useCallback, useState } from 'react';

export interface LinkedField<T> {
  readonly read: (input: string) => T;
  readonly write: (value: T) => string;
  readonly readOnly?: boolean;
}

/**
 * Hook for bidirectional linked inputs.
 * When any field is edited, its value is parsed via `read()` to a canonical form,
 * then all other fields are updated via their `write()` functions.
 *
 * Callers must pass a stable `fields` reference (e.g. via `useMemo`) and a stable
 * `isValid`; otherwise `handleChange` is re-created every render, defeating the
 * `useCallback` and forcing consumers to re-render on each parent render.
 */
export function useLinkedInputs<K extends string, T>(
  fields: Record<K, LinkedField<T>>,
  isValid: (value: T) => boolean,
) {
  const fieldKeys = Object.keys(fields) as K[];
  const [values, setValues] = useState<Record<K, string>>(
    () => Object.fromEntries(fieldKeys.map(k => [k, ''])) as Record<K, string>,
  );
  const [activeField, setActiveField] = useState<K>(fieldKeys[0]);

  const handleChange = useCallback(
    (field: K, input: string) => {
      const canonical = fields[field].read(input);
      if (!isValid(canonical)) {
        setValues(prev => ({ ...prev, [field]: input }));
        return;
      }
      const keys = Object.keys(fields) as K[];
      setValues(
        Object.fromEntries(
          keys.map(k => [k, k === field ? input : fields[k].write(canonical)]),
        ) as Record<K, string>,
      );
    },
    [fields, isValid],
  );

  return { values, activeField, setActiveField, handleChange };
}
