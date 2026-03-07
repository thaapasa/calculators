import { describe, expect, it } from 'vitest';

import {
  binaryData,
  generateInstanceId,
  PipelineConfig,
  textData,
  toBinary,
  toText,
} from './types';

describe('PipelineData helpers', () => {
  it('toText returns text from text data', () => {
    expect(toText(textData('hello'))).toBe('hello');
  });

  it('toText decodes binary as UTF-8', () => {
    const bytes = new TextEncoder().encode('moi');
    expect(toText(binaryData(bytes))).toBe('moi');
  });

  it('toBinary returns bytes from binary data', () => {
    const bytes = new Uint8Array([1, 2, 3]);
    expect(toBinary(binaryData(bytes))).toEqual(bytes);
  });

  it('toBinary encodes text as UTF-8', () => {
    const result = toBinary(textData('abc'));
    expect(Array.from(result)).toEqual([97, 98, 99]);
  });

  it('textData creates text PipelineData', () => {
    const d = textData('test');
    expect(d).toEqual({ type: 'text', text: 'test' });
  });

  it('binaryData creates binary PipelineData', () => {
    const bytes = new Uint8Array([0xff]);
    const d = binaryData(bytes);
    expect(d).toEqual({ type: 'binary', bytes });
  });

  it('generateInstanceId returns unique ids', () => {
    const a = generateInstanceId();
    const b = generateInstanceId();
    expect(a).not.toBe(b);
  });
});

describe('PipelineConfig serialization', () => {
  it('config is plain JSON-serializable', () => {
    const config: PipelineConfig = {
      version: 1,
      steps: [{ operationId: 'base64-encode' }, { operationId: 'rot13', params: { n: 5 } }],
    };
    const json = JSON.stringify(config);
    const parsed = JSON.parse(json);
    expect(parsed).toEqual(config);
  });
});
