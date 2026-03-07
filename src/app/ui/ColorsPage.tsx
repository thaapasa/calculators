import { lightnessColors, saturationColors, staticColors } from 'app/calc/colorData';
import {
  hexToRGB,
  HSLKey,
  hslToRGB,
  HSLValue,
  rgbToHex,
  rgbToHSL,
  rgbToRGBStr,
  RGBValue,
} from 'app/calc/colors';
import { getColorsFromStore, storeColors, StoredColor } from 'app/util/colorStorage';
import { Avatar } from 'components/ui/avatar';
import { Badge } from 'components/ui/badge';
import { Button } from 'components/ui/button';
import { Separator } from 'components/ui/separator';
import { Plus } from 'lucide-react';
import React, { useCallback, useState } from 'react';

import { ByteValueSelector } from './component/ByteValueSelector';
import { ColorBar } from './component/ColorBar';
import { HSLSlider } from './component/HSLSlider';
import { Item } from './component/Item';
import { HalfSection } from './component/Section';
import { publishSelectedValue } from './LastValue';

const texts = {
  hex: 'Heksakoodi',
  rgb: 'RGB-arvo',
};

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

  const subtitle = selected === 'hex' ? texts.hex : texts.rgb;

  return (
    <HalfSection
      title="Väri"
      subtitle={subtitle}
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
