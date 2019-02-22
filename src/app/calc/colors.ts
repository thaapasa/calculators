import { zeroPad } from 'app/util/strings';
import { hexStrToInt, intToHexStr } from './numbers';

export interface RGBValue {
  r: number;
  g: number;
  b: number;
}

export function rgbToRGBStr(c: RGBValue): string {
  return c ? `rgb(${Number(c.r)}, ${Number(c.g)}, ${Number(c.b)})` : '';
}

export function toHexComp(value: number | string): string {
  return zeroPad(intToHexStr(value), 2);
}

export function hexToRGB(value: string): RGBValue {
  let r = 0;
  let g = 0;
  let b = 0;
  const l = value.length <= 4 ? 1 : 2;
  const re = new RegExp(
    `^#?([0-9A-Za-z]{${l}})([0-9A-Za-z]{${l}})([0-9A-Za-z]{${l}})$`
  );

  value.replace(re, (_, hr, hg, hb) => {
    r = (r = hexStrToInt(hr)) + (l === 1 ? r << 4 : 0);
    g = (g = hexStrToInt(hg)) + (l === 1 ? g << 4 : 0);
    b = (b = hexStrToInt(hb)) + (l === 1 ? b << 4 : 0);
    return '';
  });

  return { r, g, b };
}

export function rgbToHex(rgb: RGBValue): string {
  return `#${toHexComp(rgb.r)}${toHexComp(rgb.g)}${toHexComp(rgb.b)}`;
}

// https://stackoverflow.com/questions/39118528/rgb-to-hsl-conversion
export function rgb2hsl(r: number, g: number, b: number) {
  // see https://en.wikipedia.org/wiki/HSL_and_HSV#Formal_derivation
  // convert r,g,b [0,255] range to [0,1]
  (r = r / 255), (g = g / 255), (b = b / 255);
  // get the min and max of r,g,b
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  // lightness is the average of the largest and smallest color components
  let lum = (max + min) / 2;
  let hue = 0;
  let sat;
  if (max === min) {
    // no saturation
    hue = 0;
    sat = 0;
  } else {
    const c = max - min; // chroma
    // saturation is simply the chroma scaled to fill
    // the interval [0, 1] for every combination of hue and lightness
    sat = c / (1 - Math.abs(2 * lum - 1));
    switch (max) {
      case r:
        // hue = (g - b) / c;
        hue = ((g - b) / c) % 6;
        // hue = (g - b) / c + (g < b ? 6 : 0);
        break;
      case g:
        hue = (b - r) / c + 2;
        break;
      case b:
        hue = (r - g) / c + 4;
        break;
    }
  }
  hue = Math.round(hue * 60); // °
  sat = Math.round(sat * 100); // %
  lum = Math.round(lum * 100); // %
  return [hue, sat, lum];
}
