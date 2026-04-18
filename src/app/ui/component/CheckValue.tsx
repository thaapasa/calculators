import { useTranslation } from 'app/i18n/LanguageContext';
import { cn } from 'lib/utils';
import { ChangeEvent, useCallback, useState } from 'react';

import * as util from '../../util/util';
import { Item } from './Item';
import { GenerateButton } from './ToolButton';

type LabelSize = 'sm' | 'md';

const labelWidthClass: Record<LabelSize, string> = {
  sm: 'w-20',
  md: 'w-36',
};

interface CheckProps {
  readonly width?: string;
  readonly labelSize?: LabelSize;
  readonly check?: (x: string) => string;
  readonly combine?: (a: string, b: string) => string;
  readonly name: string;
  readonly id: string | number;
  readonly 'max-length'?: string;
  readonly generate?: () => string;
  readonly onValue: (x: string) => void;
  readonly onFocus?: (value: string) => void;
}

export function CheckValue({
  width,
  labelSize = 'md',
  check,
  combine,
  name,
  id,
  'max-length': _maxLength,
  generate: generateFn,
  onValue,
  onFocus,
}: CheckProps) {
  const { t } = useTranslation();
  const [input, setInput] = useState('');
  const [checkValue, setCheckValue] = useState('');
  const [value, setValue] = useState('');

  const combiner = combine ?? util.combineWith('');

  const processInput = useCallback(
    (val: string) => {
      if (check) {
        const chk = check(val);
        setCheckValue(chk);
        const combined = chk && combiner(val, chk);
        if (combined && util.nonEmpty(combined)) {
          setValue(combined);
          onValue(combined);
        }
      } else {
        setValue(val);
        onValue(val);
      }
    },
    [check, onValue, combiner],
  );

  const inputChanged = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setInput(e.target.value);
      processInput(e.target.value);
    },
    [processInput],
  );

  const generate = useCallback(() => {
    if (!generateFn) return;
    const generated = generateFn().toString();
    setInput(generated);
    processInput(generated);
  }, [generateFn, processInput]);

  const handleFocus = useCallback(() => {
    if (onFocus) onFocus(value || input);
  }, [onFocus, value, input]);

  return (
    <Item name={name} valueClassName="top" labelWidth={labelWidthClass[labelSize]}>
      {generateFn ? (
        <GenerateButton onClick={generate} title={t('component.generateNew')} />
      ) : (
        <div className="w-9 shrink-0" />
      )}
      <input
        type="text"
        id={`${id}-input`}
        className={cn('input-inline', !width && 'flex-1')}
        style={width ? { width } : undefined}
        onChange={inputChanged}
        onFocus={handleFocus}
        value={input}
      />
      {check ? (
        <input id={`${id}-check`} className="input-inline ml-1 w-4" readOnly value={checkValue} />
      ) : null}
      <input type="hidden" id={`${id}-value`} value={value} />
    </Item>
  );
}
