import { describe, expect, it } from 'vitest';

import { textData, toText } from '../types';
import {
  base64DecodeOp,
  base64EncodeOp,
  hexDecodeOp,
  hexEncodeOp,
  urlDecodeOp,
  urlEncodeOp,
} from './encoding';
import { jsonCompactOp, jsonPrettyOp } from './format';
import { md5Op, sha256Op } from './hash';
import { lowercaseOp, reverseOp, rot13Op, uppercaseOp } from './text';

describe('encoding operations', () => {
  it('base64 encode/decode roundtrip', async () => {
    const input = textData('Hello, World!');
    const encoded = await base64EncodeOp.process(input);
    expect(toText(encoded)).toBe('SGVsbG8sIFdvcmxkIQ==');
    const decoded = await base64DecodeOp.process(encoded);
    expect(toText(decoded)).toBe('Hello, World!');
  });

  it('URL encode/decode roundtrip', async () => {
    const input = textData('hello world&foo=bar');
    const encoded = await urlEncodeOp.process(input);
    expect(toText(encoded)).toBe('hello%20world%26foo%3Dbar');
    const decoded = await urlDecodeOp.process(encoded);
    expect(toText(decoded)).toBe('hello world&foo=bar');
  });

  it('hex encode/decode roundtrip', async () => {
    const input = textData('AB');
    const encoded = await hexEncodeOp.process(input);
    expect(toText(encoded)).toBe('4142');
    const decoded = await hexDecodeOp.process(encoded);
    expect(toText(decoded)).toBe('AB');
  });
});

describe('text operations', () => {
  it('ROT-13', async () => {
    const result = await rot13Op.process(textData('Hello'));
    expect(toText(result)).toBe('Uryyb');
  });

  it('uppercase', async () => {
    const result = await uppercaseOp.process(textData('hello'));
    expect(toText(result)).toBe('HELLO');
  });

  it('lowercase', async () => {
    const result = await lowercaseOp.process(textData('HELLO'));
    expect(toText(result)).toBe('hello');
  });

  it('reverse', async () => {
    const result = await reverseOp.process(textData('abc'));
    expect(toText(result)).toBe('cba');
  });
});

describe('format operations', () => {
  it('JSON pretty formats compact JSON', async () => {
    const result = await jsonPrettyOp.process(textData('{"a":1}'));
    expect(toText(result)).toBe('{\n  "a": 1\n}');
  });

  it('JSON compact minifies pretty JSON', async () => {
    const result = await jsonCompactOp.process(textData('{\n  "a": 1\n}'));
    expect(toText(result)).toBe('{"a":1}');
  });
});

describe('hash operations', () => {
  it('MD5 produces correct hash', async () => {
    const result = await md5Op.process(textData('hello'));
    expect(toText(result)).toBe('5d41402abc4b2a76b9719d911017c592');
  });

  it('SHA-256 produces correct hash', async () => {
    const result = await sha256Op.process(textData('hello'));
    expect(toText(result)).toBe('2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824');
  });
});
