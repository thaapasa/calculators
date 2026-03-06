import { Add } from '@mui/icons-material';
import { Avatar, Chip, Divider, IconButton, Input, Slider, styled } from '@mui/material';
import {
  hexToRGB,
  HSLKey,
  HSLMaxValue,
  hslToRGB,
  HSLValue,
  rgbToHex,
  rgbToHSL,
  rgbToRGBStr,
  RGBValue,
} from 'app/calc/colors';
import * as R from 'ramda';
import React, { useCallback, useState } from 'react';

import * as store from '../util/store';
import { ByteValueSelector } from './component/ByteValueSelector';
import { ColorBar } from './component/ColorBar';
import { Item } from './component/item';
import { HalfSection } from './component/section';
import { publishSelectedValue } from './LastValue';

const ColorAvatar = styled(Avatar)`
  border: 1px solid #bbbbbb;
`;

const texts = {
  hex: 'Heksakoodi',
  rgb: 'RGB-arvo',
  h: 'H: Sävy',
  s: 'S: Väri',
  l: 'L: Valo',
};

const staticColors = {
  r: R.range(0, 255).map(r => ({ r, g: 0, b: 0 })),
  g: R.range(0, 255).map(g => ({ r: 0, g, b: 0 })),
  b: R.range(0, 255).map(b => ({ r: 0, g: 0, b })),
  h: R.range(0, 359).map(h =>
    hslToRGB({
      h: (h * HSLMaxValue) / 359,
      s: HSLMaxValue,
      l: HSLMaxValue / 2,
    }),
  ),
};

function saturationColors(h: number, l: number) {
  return R.range(0, 255).map(s => hslToRGB({ h, s: (s * HSLMaxValue) / 255, l }));
}

function lightnessColors(h: number, s: number) {
  return R.range(0, 255).map(l => hslToRGB({ h, s, l: (l * HSLMaxValue) / 255 }));
}

interface StoredColor {
  name: string;
  hex: string;
}

const COLORS_STORE_KEY = 'calculators:colors';

function getColorsFromStore(): StoredColor[] {
  return store.getValue(COLORS_STORE_KEY) || [];
}

function storeColors(colors: StoredColor[]) {
  store.putValue(COLORS_STORE_KEY, colors);
}

export function ColorsPage() {
  const [rgb, setRgb] = useState<RGBValue>({ r: 255, g: 255, b: 255 });
  const [hsl, setHsl] = useState<HSLValue>(() => rgbToHSL({ r: 255, g: 255, b: 255 }));
  const [hexString, setHexString] = useState('#ffffff');
  const [selected, setSelected] = useState<'hex' | 'rgb'>('hex');
  const [colorList, setColorList] = useState<StoredColor[]>(getColorsFromStore);

  const rgbString = rgbToRGBStr(rgb);
  const validatedColor =
    hexString && hexString.length > 3 && hexString.startsWith('#') ? hexString : undefined;

  // Update everything from a new RGB value
  const setAllFromRgb = useCallback(
    (newRgb: RGBValue, src: 'rgb' | 'hsl' | 'hex') => {
      setRgb(newRgb);
      const newHex = rgbToHex(newRgb);
      setHexString(newHex);
      if (src !== 'hsl') {
        setHsl(rgbToHSL(newRgb));
      }
      publishSelectedValue(selected === 'rgb' ? rgbToRGBStr(newRgb) : newHex);
    },
    [selected],
  );

  const onRgbComponentChange = useCallback(
    (component: 'r' | 'g' | 'b', value: number) => {
      const newRgb = { ...rgb, [component]: value };
      setAllFromRgb(newRgb, 'rgb');
    },
    [rgb, setAllFromRgb],
  );

  const onHexChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      setHexString(val);
      if (val.length >= 4) {
        const newRgb = hexToRGB(val);
        setRgb(newRgb);
        setHsl(rgbToHSL(newRgb));
        publishSelectedValue(selected === 'rgb' ? rgbToRGBStr(newRgb) : val);
      }
    },
    [selected],
  );

  const onHslChange = useCallback(
    (component: HSLKey, value: number) => {
      const newHsl = { ...hsl, [component]: value };
      setHsl(newHsl);
      const newRgb = hslToRGB(newHsl);
      setAllFromRgb(newRgb, 'hsl');
    },
    [hsl, setAllFromRgb],
  );

  const setAllFromHex = useCallback(
    (hex: string) => {
      setHexString(hex);
      const newRgb = hexToRGB(hex);
      setRgb(newRgb);
      setHsl(rgbToHSL(newRgb));
      publishSelectedValue(selected === 'rgb' ? rgbToRGBStr(newRgb) : hex);
    },
    [selected],
  );

  const storeColor = useCallback(() => {
    const name = window.prompt('Anna värin nimi');
    if (name) {
      setColorList(prev => {
        const next = [...prev, { name, hex: hexString }];
        storeColors(next);
        return next;
      });
    }
  }, [hexString]);

  const removeColor = useCallback((index: number) => {
    setColorList(prev => {
      const next = [...prev];
      next.splice(index, 1);
      storeColors(next);
      return next;
    });
  }, []);

  const selectMode = useCallback(
    (src: 'hex' | 'rgb') => {
      setSelected(src);
      publishSelectedValue(src === 'rgb' ? rgbString : hexString);
    },
    [rgbString, hexString],
  );

  return (
    <HalfSection
      title="Väri"
      subtitle={texts[selected]}
      image="/img/header-colors.jpg"
      avatar={<ColorAvatar style={{ backgroundColor: validatedColor }}>&nbsp;</ColorAvatar>}
      action={
        <IconButton aria-label="settings" onClick={storeColor}>
          <Add />
        </IconButton>
      }
    >
      <ByteValueSelector
        floatingLabel="Red"
        setValue={rgb.r}
        onValue={v => onRgbComponentChange('r', v)}
        topContent={<ColorBar colors={staticColors.r} />}
      />
      <ByteValueSelector
        floatingLabel="Green"
        setValue={rgb.g}
        onValue={v => onRgbComponentChange('g', v)}
        topContent={<ColorBar colors={staticColors.g} />}
      />
      <ByteValueSelector
        floatingLabel="Blue"
        setValue={rgb.b}
        onValue={v => onRgbComponentChange('b', v)}
        topContent={<ColorBar colors={staticColors.b} />}
      />
      <Item name="Heksa">
        <Input
          placeholder="#FFFFFF"
          value={hexString}
          inputProps={{ maxLength: 7 }}
          onChange={onHexChange}
          onFocus={() => selectMode('hex')}
        />
      </Item>
      <Item name="RGB-arvo">
        <Input
          placeholder="rgb(1.0,1.0,1.0)"
          value={rgbString}
          inputProps={{ readOnly: true }}
          onFocus={() => selectMode('rgb')}
        />
      </Item>
      <HSLSlider
        hsl="h"
        value={hsl.h}
        colorBar={staticColors.h}
        onChange={v => onHslChange('h', v)}
      />
      <HSLSlider
        hsl="s"
        value={hsl.s}
        colorBar={saturationColors(hsl.h, hsl.l)}
        onChange={v => onHslChange('s', v)}
      />
      <HSLSlider
        hsl="l"
        value={hsl.l}
        colorBar={lightnessColors(hsl.h, hsl.s)}
        onChange={v => onHslChange('l', v)}
      />
      {colorList.length > 0 ? (
        <>
          <Divider />
          {colorList.map((c, i) => (
            <PaddedChip
              key={i}
              avatar={
                <Avatar style={{ backgroundColor: c.hex }}>
                  <div />
                </Avatar>
              }
              label={c.name}
              onDelete={() => removeColor(i)}
              onClick={() => setAllFromHex(c.hex)}
            />
          ))}
        </>
      ) : null}
    </HalfSection>
  );
}

const HSLSlider = ({
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
  <HSLItem name={texts[hsl]}>
    <ColorBar colors={colorBar} />
    <Slider
      value={value}
      min={0}
      max={HSLMaxValue}
      step={1}
      onChange={(_, v) => onChange(typeof v === 'number' ? v : v[0])}
    />
  </HSLItem>
);

const HSLItem = styled(Item)`
  margin-top: 16px;
  & .value {
    flex-direction: column;
  }
`;

const PaddedChip = styled(Chip)`
  margin: 8px 4px;
`;
