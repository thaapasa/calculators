import { TextFormat } from '@mui/icons-material';
import { Checkbox, styled, TextField } from '@mui/material';
import React, { useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react';

import { toUpperCase } from '../../util/strings';
import { MaybePromise } from '../../util/util';
import { Item } from './item';

const StyledItem = styled(Item)`
  & > .name {
    margin-top: 1.2em;
  }
`;

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
          applyTransform(val, upperCaseRef.current);
        },
      }),
      [applyTransform],
    );

    const checkUpperCase = useCallback(
      (_event: React.ChangeEvent, checked: boolean) => {
        setUpperCase(checked);
        applyTransform(lastInputRef.current, checked);
        if (onSelect) {
          onSelect(_event as unknown as React.FocusEvent);
        }
      },
      [applyTransform, onSelect],
    );

    return (
      <StyledItem
        name={
          <>
            <Checkbox name={type + '-upper-case'} onChange={checkUpperCase} />
            <TextFormat color="secondary" />
          </>
        }
        valueClassName="top"
      >
        <TextField
          variant="standard"
          label={label}
          type="text"
          placeholder={label}
          className="wide"
          value={value}
          fullWidth={true}
          slotProps={{ input: { readOnly: true } }}
          name="output"
          onFocus={onSelect}
        />
      </StyledItem>
    );
  },
);
