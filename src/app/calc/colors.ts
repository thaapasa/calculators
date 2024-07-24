import { zeroPad } from 'app/util/strings';
import { mapObject } from 'app/util/util';

import { hexStrToInt, intToHexStr } from './numbers';

export interface RGBValue {
  r: number;
  g: number;
  b: number;
}

export type RGBKey = 'r' | 'g' | 'b';

export interface HSLValue {
  h: number;
  s: number;
  l: number;
}

export type HSLKey = 'h' | 's' | 'l';

export const HSLMaxValue = 719;

export function rgbToRGBStr(c: RGBValue): string {
  return c
    ? `rgb(${decToDisplayFloat(c.r)}, ${decToDisplayFloat(c.g)}, ${decToDisplayFloat(c.b)})`
    : '';
}

function decToDisplayFloat(x: string | number): string {
  return (Number(x) / 255).toFixed(3);
}

export function toHexComp(value: number | string): string {
  return zeroPad(intToHexStr(value), 2);
}

function toByteRange(val: number): number {
  return Math.min(Math.floor(val * 256), 255);
}

function toHSLRange(val: number): number {
  return Math.min(Math.floor(val * (HSLMaxValue + 1)), HSLMaxValue);
}

function hexToParts(value: string): [number, number, number] {
  let r = 0;
  let g = 0;
  let b = 0;
  const l = value.length <= 4 ? 1 : 2;
  const re = new RegExp(`^#?([0-9A-Za-z]{${l}})([0-9A-Za-z]{${l}})([0-9A-Za-z]{${l}})$`);

  value.replace(re, (_, hr, hg, hb) => {
    r = (r = hexStrToInt(hr)) + (l === 1 ? r << 4 : 0);
    g = (g = hexStrToInt(hg)) + (l === 1 ? g << 4 : 0);
    b = (b = hexStrToInt(hb)) + (l === 1 ? b << 4 : 0);
    return '';
  });

  return [r, g, b];
}

export function hexToRGB(value: string): RGBValue {
  const [r, g, b] = hexToParts(value);
  return { r, g, b };
}

export function rgbToHex(rgb: RGBValue): string {
  return `#${toHexComp(rgb.r)}${toHexComp(rgb.g)}${toHexComp(rgb.b)}`;
}

// See https://stackoverflow.com/questions/2353211/hsl-to-rgb-color-conversion

function hue2rgb(p: number, q: number, t: number): number {
  if (t < 0) {
    t += 1;
  }
  if (t > 1) {
    t -= 1;
  }
  if (t < 1 / 6) {
    return p + (q - p) * 6 * t;
  }
  if (t < 1 / 2) {
    return q;
  }
  if (t < 2 / 3) {
    return p + (q - p) * (2 / 3 - t) * 6;
  }
  return p;
}

/**
 * Converts an HSL color value to RGB. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
 * All RGB values are assumed to be in the range [0, 255], and
 * all HSL values are assumed to be in the range [0, HSLMaxValue].
 */
export function hslToRGB(hsl: HSLValue): RGBValue {
  let r, g, b;
  let { h, s, l } = hsl;
  h /= HSLMaxValue;
  s /= HSLMaxValue;
  l /= HSLMaxValue;

  if (s === 0) {
    r = g = b = l; // achromatic
  } else {
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  return mapObject(toByteRange, { r, g, b });
}

/**
 * Converts an RGB color value to HSL. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
 * All values are assumed to be in the range [0, 255], and
 * all HSL values are assumed to be in the range [0, HSLMaxValue].
 */
export function rgbToHSL(rgb: RGBValue): HSLValue {
  let { r, g, b } = rgb;
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0,
    s = 0;
  const l = (max + min) / 2;

  if (max === min) {
    h = s = 0; // achromatic
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }

  return mapObject(toHSLRange, { h, s, l });
}
