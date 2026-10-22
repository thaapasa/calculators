import { describe, expect, it } from 'vitest';

import { base64ToBytes, bytesToHex, hexToBytes, textToHex } from './bytes';

describe('bytesToHex', () => {
  it('writes two lowercase digits per byte', () => {
    expect(bytesToHex(new Uint8Array([0, 1, 0xab, 0xff]))).toBe('0001abff');
    expect(bytesToHex(new Uint8Array())).toBe('');
  });
});

describe('hexToBytes', () => {
  it('parses upper and lower case and ignores whitespace', () => {
    expect(Array.from(hexToBytes('00 Ab\nff'))).toEqual([0, 0xab, 0xff]);
    expect(hexToBytes('')).toHaveLength(0);
  });

  it('rejects non-hex characters, also where parseInt would accept a prefix', () => {
    expect(() => hexToBytes('0g')).toThrow('Hex input contains non-hex characters');
    expect(() => hexToBytes('zz')).toThrow();
    expect(() => hexToBytes('0x12')).toThrow();
    expect(() => hexToBytes('1-')).toThrow();
  });

  it('rejects an odd number of digits and names the value', () => {
    expect(() => hexToBytes('abc', 'Salt')).toThrow('Salt must have an even number of hex digits');
  });
});

describe('base64ToBytes', () => {
  it('decodes with or without padding', () => {
    expect(Array.from(base64ToBytes('c2FsdA=='))).toEqual([0x73, 0x61, 0x6c, 0x74]);
    expect(Array.from(base64ToBytes('c2FsdA'))).toEqual([0x73, 0x61, 0x6c, 0x74]);
    expect(Array.from(base64ToBytes(' /w== '))).toEqual([0xff]);
  });

  it('rejects invalid Base64 and names the value', () => {
    expect(() => base64ToBytes('c2F$dA==', 'Salt')).toThrow('Salt is not valid Base64');
    expect(() => base64ToBytes('a')).toThrow('Input is not valid Base64');
  });
});

describe('textToHex', () => {
  it('encodes as UTF-8', () => {
    expect(textToHex('ä')).toBe('c3a4');
  });
});
