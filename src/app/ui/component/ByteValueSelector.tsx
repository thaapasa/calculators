import { Slider } from 'components/ui/slider';
import { cn } from 'lib/utils';
import React, { useCallback, useState } from 'react';

import { hexStrToInt, intToHexStr, strToInt } from '../../calc/numbers';
import { zeroPad } from '../../util/strings';
import { isNumber } from '../../util/util';
import { Item } from './Item';

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
  const [activeSource, setActiveSource] = useState<string | null>(null);

  const [prevSetValueProp, setPrevSetValueProp] = useState(setValueProp);
  if (setValueProp !== prevSetValueProp) {
    setPrevSetValueProp(setValueProp);
    const val = Number(setValueProp);
    if (activeSource !== 'hex') setHex(toHexComp(val));
    if (activeSource !== 'dec') setDec(toDecValue(val));
    if (activeSource !== 'slider') setSlider(toSliderValue(val));
    if (activeSource !== null) setActiveSource(null);
  }

  const showValue = useCallback(
    (val: number, src: string) => {
      setActiveSource(src);
      if (src !== 'hex') setHex(toHexComp(val));
      if (src !== 'dec') setDec(toDecValue(val));
      setSlider(toSliderValue(val));
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
    (num: number) => {
      showValue(num, 'slider');
    },
    [showValue],
  );

  const content = (
    <div className="flex justify-start items-center mx-3 mb-6">
      <div>
        <div className="flex justify-start items-center gap-4">
          <div className="w-[2.8em]">
            {floatingLabel && <label className="text-xs text-muted">{floatingLabel}</label>}
            <input
              className="w-full border-b border-border bg-transparent outline-none"
              placeholder="FF"
              maxLength={2}
              value={hex}
              onChange={onHexChange}
            />
          </div>
          <div className="w-[2.8em]">
            {floatingLabel && <label className="text-xs text-muted">{floatingLabel}</label>}
            <input
              className="w-full border-b border-border bg-transparent outline-none"
              placeholder="255"
              type="number"
              maxLength={3}
              value={dec}
              onChange={onDecChange}
            />
          </div>
        </div>
        <div className="flex justify-start items-center mt-1">
          <div className="w-[6em]">
            <input
              className="w-full border-b border-border bg-transparent outline-none"
              readOnly
              value={String(Number(dec) / 255)}
            />
          </div>
        </div>
      </div>
      <div className={cn('flex-1 ml-4', floatingLabel && 'mt-4.5')}>
        {topContent}
        <Slider value={slider} max={255} min={0} step={1} onValueChange={onSliderChange} />
      </div>
    </div>
  );

  return name ? (
    <Item name={name} valueClassName="top">
      {content}
    </Item>
  ) : (
    content
  );
}
