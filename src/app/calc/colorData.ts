import { HSLMaxValue, hslToRGB, RGBValue } from 'app/calc/colors';
import * as R from 'ramda';

export const staticColors = {
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

export function saturationColors(h: number, l: number): RGBValue[] {
  return R.range(0, 255).map(s => hslToRGB({ h, s: (s * HSLMaxValue) / 255, l }));
}

export function lightnessColors(h: number, s: number): RGBValue[] {
  return R.range(0, 255).map(l => hslToRGB({ h, s, l: (l * HSLMaxValue) / 255 }));
}
