import { isDefined, mapObject } from '../util/util';

const binCharsRE = /[^01]/;
const octCharsRE = /[^0-7]/;
const decCharsRE = /[^0-9]/;
const hexCharsRE = /[^0-9A-Fa-f]/;

export function numberify<T extends object>(t: T): Record<keyof T, number> {
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
  return intToRadixStr(value, 16);
}

export function intToOctalStr(value: number | string): string {
  return intToRadixStr(value, 8);
}

export function intToBinaryStr(value: number | string): string {
  return intToRadixStr(value, 2);
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

/** Negative and non-numeric values give '0', and fractions are truncated */
function intToRadixStr(value: number | string, radix: number): string {
  const num = Math.floor(Number(value));
  return Number.isFinite(num) && num > 0 ? num.toString(radix).toUpperCase() : '0';
}
