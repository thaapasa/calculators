import { HSLKey, HSLMaxValue, RGBValue } from 'app/calc/colors';
import { Slider } from 'components/ui/slider';
import React from 'react';

import { ColorBar } from './ColorBar';
import { Item } from './Item';

const texts: Record<HSLKey, string> = {
  h: 'H: Sävy',
  s: 'S: Väri',
  l: 'L: Valo',
};

export const HSLSlider = ({
  colorBar,
  hsl,
  value,
  onChange,
}: {
  hsl: HSLKey;
  colorBar: RGBValue[];
  value: number;
  onChange: (v: number) => void;
}) => (
  <Item className="mt-4 [&>.grow]:flex-col [&>.grow]:gap-2" name={texts[hsl]}>
    <ColorBar colors={colorBar} />
    <Slider value={value} min={0} max={HSLMaxValue} step={1} onValueChange={onChange} />
  </Item>
);
