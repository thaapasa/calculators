import { isDefined, isNumber, mapObject } from '../util/util';

const binCharsRE = /[^01]/;
const octCharsRE = /[^0-7]/;
const decCharsRE = /[^0-9]/;
const hexCharsRE = /[^0-9A-Fa-f]/;
const numChars = '0123456789ABCDEF';

export function numberify<T>(t: T) {
  return mapObject(Number, t);
}

export function binaryStrToInt(value: string | number): number {
  return strToIntChecked(value, 2, binCharsRE);
}

export function octalStrToInt(value: string | number): number {
  return strToIntChecked(value, 8, octCharsRE);
}

export function decimalStrToInt(value: string | number): number {
  return strToIntChecked(value, 10, decCharsRE);
}

export function hexStrToInt(value: string | number): number {
  return strToIntChecked(value, 16, hexCharsRE);
}

export function strToInt(v: string | number): number {
  return decimalStrToInt(v);
}

export function intToStr(value: number): string {
  return isDefined(value) ? value.toString() : '';
}

export function intToHexStr(value: number | string): string {
  return intToStrBPC(value, 4);
}

export function intToOctalStr(value: number | string): string {
  return intToStrBPC(value, 3);
}

export function intToBinaryStr(value: number | string): string {
  return intToStrBPC(value, 1);
}

export function charToInt(value: string): number {
  if (!isDefined(value)) {
    return NaN;
  }
  if (typeof value === 'number') {
    return value;
  }
  if (typeof value !== 'string' || value.length === 0) {
    return NaN;
  }
  return value.charCodeAt(0);
}

export function intToChar(value: number): string {
  return typeof value === 'number' && !isNaN(value) ? String.fromCharCode(value) : '';
}

/* Helper functions */
function strToIntChecked(value: any, radix: number, validChars: RegExp): number {
  if (!isDefined(value)) {
    return NaN;
  }
  if (typeof value === 'number') {
    return value;
  }
  if (typeof value !== 'string') {
    return NaN;
  }
  if (value.match(validChars)) {
    return NaN;
  }
  return parseInt(value, radix);
}

function toChar(value: number, radix: number): string | undefined {
  if (!isNumber(value) || value < 0 || value >= radix || value >= numChars.length) {
    return;
  }
  return numChars.charAt(value);
}

function intToStrBPC(value: number | string, bitsPerChar: number): string {
  const radix = 1 << bitsPerChar;
  const mask = (1 << bitsPerChar) - 1;
  let remaining = Number(value);
  const str = [];
  while (remaining > 0) {
    str.push(toChar(remaining & mask, radix));
    remaining >>= bitsPerChar;
  }
  if (str.length === 0) {
    str.push('0');
  }
  return str.reverse().join('');
}
