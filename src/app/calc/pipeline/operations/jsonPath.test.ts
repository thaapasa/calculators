import { describe, expect, it } from 'vitest';

import { textData, toText } from '../types';
import { jsonExtractOp, jsonMergeOp } from './format';
import {
  coerceJsonValue,
  getAtPath,
  parseJsonPath,
  renderExtractedValue,
  setAtPath,
} from './jsonPath';

describe('parseJsonPath', () => {
  it('parses dotted paths', () => {
    expect(parseJsonPath('a.b.c')).toEqual(['a', 'b', 'c']);
  });

  it('strips $ and $.', () => {
    expect(parseJsonPath('$.a.b')).toEqual(['a', 'b']);
    expect(parseJsonPath('$a.b')).toEqual(['a', 'b']);
    expect(parseJsonPath('$')).toEqual([]);
  });

  it('parses bracket indices', () => {
    expect(parseJsonPath('items[0].name')).toEqual(['items', 0, 'name']);
    expect(parseJsonPath('a.0.b')).toEqual(['a', 0, 'b']);
  });

  it('parses bracketed quoted keys with dots', () => {
    expect(parseJsonPath('a["b.c"][0]')).toEqual(['a', 'b.c', 0]);
    expect(parseJsonPath("a['b.c']")).toEqual(['a', 'b.c']);
  });

  it('parses JSON Pointer syntax', () => {
    expect(parseJsonPath('/a/b/0')).toEqual(['a', 'b', 0]);
    expect(parseJsonPath('/a~1b/c~0d')).toEqual(['a/b', 'c~d']);
  });

  it('rejects malformed paths', () => {
    expect(() => parseJsonPath('a..b')).toThrow();
  });
});

describe('getAtPath', () => {
  const data = { a: { b: [{ c: 1 }, { c: 2 }] }, x: 'hi' };

  it('navigates objects and arrays', () => {
    expect(getAtPath(data, ['a', 'b', 0, 'c'])).toBe(1);
    expect(getAtPath(data, ['a', 'b', 1, 'c'])).toBe(2);
    expect(getAtPath(data, ['x'])).toBe('hi');
  });

  it('returns root for empty path', () => {
    expect(getAtPath(data, [])).toBe(data);
  });

  it('returns undefined for missing segments', () => {
    expect(getAtPath(data, ['missing'])).toBeUndefined();
    expect(getAtPath(data, ['a', 'b', 99, 'c'])).toBeUndefined();
  });
});

describe('setAtPath', () => {
  it('sets a value at an existing path', () => {
    const result = setAtPath({ a: { b: 1 } }, ['a', 'b'], 42) as { a: { b: number } };
    expect(result).toEqual({ a: { b: 42 } });
  });

  it('creates missing intermediate objects', () => {
    expect(setAtPath({}, ['a', 'b', 'c'], 1)).toEqual({ a: { b: { c: 1 } } });
  });

  it('creates arrays when next segment is numeric', () => {
    expect(setAtPath({}, ['items', 0, 'id'], 'x')).toEqual({ items: [{ id: 'x' }] });
  });

  it('does not mutate the original object', () => {
    const original = { a: { b: 1 } };
    setAtPath(original, ['a', 'c'], 2);
    expect(original).toEqual({ a: { b: 1 } });
  });

  it('replaces the root for an empty path', () => {
    expect(setAtPath({ a: 1 }, [], { b: 2 })).toEqual({ b: 2 });
  });
});

describe('renderExtractedValue', () => {
  it('returns strings unquoted', () => {
    expect(renderExtractedValue('hello')).toBe('hello');
  });

  it('stringifies primitives', () => {
    expect(renderExtractedValue(42)).toBe('42');
    expect(renderExtractedValue(true)).toBe('true');
    expect(renderExtractedValue(null)).toBe('null');
  });

  it('JSON-stringifies objects and arrays', () => {
    expect(renderExtractedValue({ a: 1 })).toBe('{"a":1}');
    expect(renderExtractedValue([1, 2])).toBe('[1,2]');
  });

  it('returns empty string for undefined', () => {
    expect(renderExtractedValue(undefined)).toBe('');
  });
});

describe('coerceJsonValue', () => {
  it('auto-parses JSON when possible', () => {
    expect(coerceJsonValue('42', 'auto')).toBe(42);
    expect(coerceJsonValue('"hi"', 'auto')).toBe('hi');
    expect(coerceJsonValue('{"a":1}', 'auto')).toEqual({ a: 1 });
  });

  it('auto falls back to raw string when not JSON', () => {
    expect(coerceJsonValue('hello', 'auto')).toBe('hello');
  });

  it('forces string mode', () => {
    expect(coerceJsonValue('42', 'string')).toBe('42');
  });

  it('forces JSON mode and rejects non-JSON', () => {
    expect(() => coerceJsonValue('hello', 'json')).toThrow();
  });
});

describe('jsonExtractOp', () => {
  it('extracts a primitive string without quotes', async () => {
    const result = await jsonExtractOp.process(textData('{"name":"Tuukka"}'), {
      path: '$.name',
    });
    expect(toText(result)).toBe('Tuukka');
  });

  it('extracts a number as plain text', async () => {
    const result = await jsonExtractOp.process(textData('{"n":42}'), { path: 'n' });
    expect(toText(result)).toBe('42');
  });

  it('extracts an object as JSON', async () => {
    const result = await jsonExtractOp.process(textData('{"u":{"id":1}}'), { path: 'u' });
    expect(toText(result)).toBe('{"id":1}');
  });

  it('walks arrays via [n]', async () => {
    const result = await jsonExtractOp.process(textData('{"xs":[10,20,30]}'), {
      path: 'xs[1]',
    });
    expect(toText(result)).toBe('20');
  });

  it('returns empty string for missing path', async () => {
    const result = await jsonExtractOp.process(textData('{"a":1}'), { path: 'missing' });
    expect(toText(result)).toBe('');
  });
});

describe('jsonMergeOp', () => {
  it('sets a string value with auto coercion', async () => {
    const result = await jsonMergeOp.process(textData('{"a":1}'), {
      path: 'b',
      value: 'hello',
      valueType: 'auto',
      indent: 0,
    });
    expect(JSON.parse(toText(result))).toEqual({ a: 1, b: 'hello' });
  });

  it('parses JSON values in auto mode', async () => {
    const result = await jsonMergeOp.process(textData('{}'), {
      path: 'n',
      value: '42',
      valueType: 'auto',
      indent: 0,
    });
    expect(JSON.parse(toText(result))).toEqual({ n: 42 });
  });

  it('keeps text literal in string mode', async () => {
    const result = await jsonMergeOp.process(textData('{}'), {
      path: 'n',
      value: '42',
      valueType: 'string',
      indent: 0,
    });
    expect(JSON.parse(toText(result))).toEqual({ n: '42' });
  });

  it('creates nested structure when path does not exist', async () => {
    const result = await jsonMergeOp.process(textData('{}'), {
      path: 'user.name',
      value: 'Tuukka',
      indent: 0,
    });
    expect(JSON.parse(toText(result))).toEqual({ user: { name: 'Tuukka' } });
  });

  it('handles empty input as empty object', async () => {
    const result = await jsonMergeOp.process(textData(''), {
      path: 'a',
      value: '1',
      indent: 0,
    });
    expect(JSON.parse(toText(result))).toEqual({ a: 1 });
  });

  it('pretty-prints with indent', async () => {
    const result = await jsonMergeOp.process(textData('{}'), {
      path: 'a',
      value: '1',
      indent: 2,
    });
    expect(toText(result)).toBe('{\n  "a": 1\n}');
  });
});
