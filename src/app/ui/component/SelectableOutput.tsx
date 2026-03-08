import { Type } from 'lucide-react';
import React, { useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react';

import { toUpperCase } from '../../util/strings';
import { MaybePromise } from '../../util/util';
import { Item } from './Item';

interface SelectableOutputProps {
  readonly type: string;
  readonly label: string;
  readonly calculate: (v: string) => MaybePromise<string>;
  readonly onValue: (v: string) => void;
  readonly onSelect: React.FocusEventHandler;
}

export interface SelectableOutputHandle {
  setValue: (val: string) => void;
}

export const SelectableOutput = React.forwardRef<SelectableOutputHandle, SelectableOutputProps>(
  function SelectableOutput({ type, label, calculate, onValue, onSelect }, ref) {
    const [value, setValue] = useState('');
    const [upperCase, setUpperCase] = useState(false);

    const applyTransform = useCallback(
      async (input: string, uc: boolean) => {
        const calculated = await calculate(input);
        const transformed = uc ? toUpperCase(calculated) : calculated;
        setValue(transformed);
        onValue(transformed);
      },
      [calculate, onValue],
    );

    const upperCaseRef = useRef(upperCase);
    const lastInputRef = useRef('');

    useEffect(() => {
      upperCaseRef.current = upperCase;
    }, [upperCase]);

    useImperativeHandle(
      ref,
      () => ({
        setValue: (val: string) => {
          lastInputRef.current = val;
          void applyTransform(val, upperCaseRef.current);
        },
      }),
      [applyTransform],
    );

    const checkUpperCase = useCallback(
      (event: React.ChangeEvent<HTMLInputElement>) => {
        const checked = event.target.checked;
        setUpperCase(checked);
        void applyTransform(lastInputRef.current, checked);
        if (onSelect) {
          onSelect(event as unknown as React.FocusEvent);
        }
      },
      [applyTransform, onSelect],
    );

    return (
      <Item
        className="[&>.shrink-0]:mt-[1.2em]"
        labelWidth="w-16"
        name={
          <span className="inline-flex items-center">
            <input
              type="checkbox"
              name={type + '-upper-case'}
              onChange={checkUpperCase}
              className="h-4 w-4 mr-1"
            />
            <Type className="h-5 w-5 text-secondary" />
          </span>
        }
        valueClassName="top"
      >
        <input
          type="text"
          placeholder={label}
          className="w-full border-b border-border bg-transparent outline-none py-1"
          value={value}
          readOnly
          name="output"
          onFocus={onSelect}
        />
      </Item>
    );
  },
);
