import { zeroPad } from 'app/util/strings';
import { isNumber } from 'app/util/util';
import { hexStrToInt, intToHexStr } from './numbers';

export function toRGBColor(r: number, g: number, b: number): string {
  return isNumber(r) && isNumber(g) && isNumber(b)
    ? `rgb(${r}, ${g}, ${b})`
    : '';
}

export function toHexColor(r: number, g: number, b: number): string {
  return isNumber(r) && isNumber(g) && isNumber(b)
    ? `#${toHexComp(r)}${toHexComp(g)}${toHexComp(b)}`
    : '';
}

export function isValidComp(value: any): value is number {
  return isNumber(value) && !isNaN(value) && value >= 0 && value <= 255;
}

export function toHexComp(value: number): string {
  return isValidComp(value) ? zeroPad(intToHexStr(value), 2) : '';
}

export function validateHex(value: number): string {
  return value && value[0] === '#' ? value.toString() : '#' + value;
}

export function hexToComponents(value: string): [number, number, number] {
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

  return [r, g, b];
}
