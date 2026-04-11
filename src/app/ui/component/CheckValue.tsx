import { cn } from 'lib/utils';
import { ChangeEvent, useCallback, useState } from 'react';

import * as util from '../../util/util';
import { Item } from './Item';
import { GenerateButton } from './ToolButton';

interface CheckProps {
  readonly width: string;
  readonly check?: (x: string) => string;
  readonly combine?: (a: string, b: string) => string;
  readonly name: string;
  readonly id: string | number;
  readonly 'max-length'?: string;
  readonly generate?: () => string;
  readonly onValue: (x: string) => void;
}

export function CheckValue({
  width,
  check,
  combine,
  name,
  id,
  'max-length': _maxLength,
  generate: generateFn,
  onValue,
}: CheckProps) {
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

  const widthClass = width ? `w-[${width}]` : 'flex-1';

  return (
    <Item name={name} valueClassName="top" labelWidth="w-28">
      {generateFn ? (
        <GenerateButton onClick={generate} title="Luo uusi" />
      ) : (
        <div className="w-9 shrink-0" />
      )}
      <input
        type="text"
        id={`${id}-input`}
        className={cn('input-inline', widthClass)}
        onChange={inputChanged}
        value={input}
      />
      {check ? (
        <input id={`${id}-check`} className="input-inline ml-1 w-4" readOnly value={checkValue} />
      ) : null}
      <input type="hidden" id={`${id}-value`} value={value} />
    </Item>
  );
}
