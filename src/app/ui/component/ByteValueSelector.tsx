import { Slider, styled, TextField } from '@mui/material';
import React, { useCallback, useState } from 'react';

import { hexStrToInt, intToHexStr, strToInt } from '../../calc/numbers';
import { zeroPad } from '../../util/strings';
import { isNumber } from '../../util/util';
import { Item } from './item';

function isValidComp(value: number): value is number {
  return isNumber(value) && !isNaN(value) && value >= 0 && value <= 255;
}

function toSliderValue(value: number): number {
  return isValidComp(value) ? value : 0;
}

function toDecValue(value: number): string {
  return isValidComp(value) ? value.toString() : '';
}

function toHexComp(value: number): string {
  return isValidComp(value) ? zeroPad(intToHexStr(value), 2) : '';
}

const ComponentField = styled(TextField)`
  width: 2.8em;
  margin-right: 1em !important;
`;

interface SelectorProps {
  setValue: string | number;
  onValue?: (x: number) => void;
  name?: string;
  floatingLabel?: string;
  topContent?: React.ReactNode;
}

export function ByteValueSelector({
  setValue: setValueProp,
  onValue,
  name,
  floatingLabel,
  topContent,
}: SelectorProps) {
  const [hex, setHex] = useState(() => toHexComp(Number(setValueProp)));
  const [dec, setDec] = useState(() => toDecValue(Number(setValueProp)));
  const [slider, setSlider] = useState(() => toSliderValue(Number(setValueProp)));

  // Sync state from prop changes (React pattern: adjust state during render)
  const [prevSetValueProp, setPrevSetValueProp] = useState(setValueProp);
  if (setValueProp !== prevSetValueProp) {
    setPrevSetValueProp(setValueProp);
    const val = Number(setValueProp);
    setHex(toHexComp(val));
    setDec(toDecValue(val));
    setSlider(toSliderValue(val));
  }

  const showValue = useCallback(
    (val: number, src: string) => {
      if (src !== 'hex') setHex(toHexComp(val));
      if (src !== 'dec') setDec(toDecValue(val));
      if (src !== 'slider') setSlider(toSliderValue(val));
      if (onValue && src !== 'parent') {
        onValue(val);
      }
    },
    [onValue],
  );

  const onHexChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      setHex(val);
      const num = hexStrToInt(val);
      if (isValidComp(num)) showValue(num, 'hex');
    },
    [showValue],
  );

  const onDecChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      setDec(val);
      const num = strToInt(val);
      if (isValidComp(num)) showValue(num, 'dec');
    },
    [showValue],
  );

  const onSliderChange = useCallback(
    (_: unknown, v: number | number[]) => {
      const num = Array.isArray(v) ? v[0] : v;
      showValue(num, 'slider');
    },
    [showValue],
  );

  const content = (
    <Row>
      <Column>
        <Row>
          <ComponentField
            variant="standard"
            label={floatingLabel}
            placeholder="FF"
            inputProps={{ maxLength: 2 }}
            value={hex}
            onChange={onHexChange}
          />
          <ComponentField
            variant="standard"
            label={floatingLabel}
            placeholder="255"
            type="number"
            inputProps={{ maxLength: 3 }}
            value={dec}
            onChange={onDecChange}
          />
        </Row>
        <Row>
          <ComponentField
            style={{ width: '6em' }}
            variant="standard"
            inputProps={{ readOnly: true }}
            value={String(Number(dec) / 255)}
          />
        </Row>
      </Column>
      <Column className={floatingLabel ? 'high' : undefined}>
        {topContent}
        <Slider value={slider} max={255} min={0} step={1} onChange={onSliderChange} />
      </Column>
    </Row>
  );

  return name ? (
    <Item name={name} valueClassName="top">
      {content}
    </Item>
  ) : (
    content
  );
}

const Row = styled('div')`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin: 12px;
`;

const Column = styled('div')`
  width: 100%;
  &.high {
    margin-top: 18px;
  }
`;
