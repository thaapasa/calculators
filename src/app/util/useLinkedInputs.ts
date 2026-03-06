import { useCallback, useRef, useState } from 'react';

export interface LinkedField<T> {
  readonly read: (input: string) => T;
  readonly write: (value: T) => string;
  readonly readOnly?: boolean;
}

/**
 * Hook for bidirectional linked inputs.
 * When any field is edited, its value is parsed via `read()` to a canonical form,
 * then all other fields are updated via their `write()` functions.
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

  // Use ref to avoid re-creating handleChange on every render
  const fieldsRef = useRef(fields);
  fieldsRef.current = fields;

  const handleChange = useCallback(
    (field: K, input: string) => {
      const f = fieldsRef.current;
      const canonical = f[field].read(input);
      if (!isValid(canonical)) {
        setValues(prev => ({ ...prev, [field]: input }));
        return;
      }
      setValues(
        Object.fromEntries(
          fieldKeys.map(k => [k, k === field ? input : f[k].write(canonical)]),
        ) as Record<K, string>,
      );
    },
    // fieldKeys is derived from fields which is stable
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [fieldKeys.join(','), isValid],
  );

  return { values, activeField, setActiveField, handleChange };
}
