import { Input, styled } from '@mui/material';
import React, { ChangeEvent, useCallback, useState } from 'react';

import * as util from '../../util/util';
import { Item } from './Item';
import { GenerateButton } from './ToolButton';

const CheckItem = styled(Item)`
  height: 48px;
`;

const CheckField = styled(Input)`
  margin-left: 4px;
  width: 1em;
`;

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
  'max-length': maxLength,
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

  const inputStyle = width ? { width } : undefined;

  return (
    <CheckItem name={name} valueClassName="top">
      {generateFn ? (
        <GenerateButton onClick={generate} title="Luo uusi" />
      ) : (
        <GeneratePlaceholder />
      )}
      <Input
        type="text"
        id={`${id}-input`}
        onChange={inputChanged}
        style={inputStyle}
        value={input}
        max-length={maxLength}
      />
      {check ? (
        <CheckField
          id={`${id}-check`}
          className="letter"
          read-only="read-only"
          value={checkValue}
        />
      ) : null}
      <input type="hidden" id={`${id}-value`} value={value} />
    </CheckItem>
  );
}

const GeneratePlaceholder = styled('div')`
  width: 48px;
  height: 48px;
`;
