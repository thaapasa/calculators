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
import { Avatar } from 'components/ui/avatar';
import { Badge } from 'components/ui/badge';
import { Button } from 'components/ui/button';
import { Separator } from 'components/ui/separator';
import { Slider } from 'components/ui/slider';
import { Plus } from 'lucide-react';
import * as R from 'ramda';
import React, { useCallback, useState } from 'react';

import * as store from '../util/store';
import { ByteValueSelector } from './component/ByteValueSelector';
import { ColorBar } from './component/ColorBar';
import { Item } from './component/Item';
import { HalfSection } from './component/Section';
import { publishSelectedValue } from './LastValue';

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
      avatar={
        <Avatar className="border border-[#bbbbbb]">
          <div style={{ backgroundColor: validatedColor, width: '100%', height: '100%' }}>
            &nbsp;
          </div>
        </Avatar>
      }
      action={
        <Button variant="ghost" size="icon" aria-label="settings" onClick={storeColor}>
          <Plus />
        </Button>
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
        <input
          className="input-inline flex-1"
          placeholder="#FFFFFF"
          value={hexString}
          maxLength={7}
          onChange={onHexChange}
          onFocus={() => selectMode('hex')}
        />
      </Item>
      <Item name="RGB-arvo">
        <input
          className="input-inline flex-1"
          placeholder="rgb(1.0,1.0,1.0)"
          value={rgbString}
          readOnly
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
          <Separator className="my-4" />
          <div className="mx-3 -mb-3">
            {colorList.map((c, i) => (
              <Badge
                key={i}
                className="m-1 px-3 py-1 cursor-pointer"
                onDelete={() => removeColor(i)}
                onClick={() => setAllFromHex(c.hex)}
              >
                <span
                  className="inline-block w-4 h-4 rounded-full mr-1"
                  style={{ backgroundColor: c.hex }}
                />
                {c.name}
              </Badge>
            ))}
          </div>
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
  <Item className="mt-4 [&>.grow]:flex-col [&>.grow]:gap-2" name={texts[hsl]}>
    <ColorBar colors={colorBar} />
    <Slider value={value} min={0} max={HSLMaxValue} step={1} onValueChange={onChange} />
  </Item>
);
