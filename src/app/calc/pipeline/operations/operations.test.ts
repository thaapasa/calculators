import { describe, expect, it } from 'vitest';

import { binaryData, OperationDef, PipelineData, textData, toBinary, toText } from '../types';
import {
  base64DecodeOp,
  base64EncodeOp,
  base64UrlDecodeOp,
  base64UrlEncodeOp,
  hexDecodeOp,
  hexEncodeOp,
  htmlDecodeOp,
  htmlEncodeOp,
  urlDecodeOp,
  urlEncodeOp,
} from './encoding';
import { jsonCompactOp, jsonPrettyOp } from './format';
import {
  argon2idOp,
  bcryptOp,
  crc32Op,
  hmacOp,
  md5Op,
  pbkdf2Sha256Op,
  pbkdf2Sha512Op,
  sha256Op,
  sha384Op,
} from './hash';
import { lowercaseOp, reverseOp, rot13Op, uppercaseOp } from './text';

async function runPipeline(input: PipelineData, ops: OperationDef[]): Promise<PipelineData> {
  let data = input;
  for (const op of ops) data = await op.process(data);
  return data;
}

describe('encoding operations', () => {
  it('base64 encode/decode roundtrip', async () => {
    const input = textData('Hello, World!');
    const encoded = await base64EncodeOp.process(input);
    expect(toText(encoded)).toBe('SGVsbG8sIFdvcmxkIQ==');
    const decoded = await base64DecodeOp.process(encoded);
    expect(toText(decoded)).toBe('Hello, World!');
  });

  it('base64 encode/decode preserves UTF-8 multi-byte characters', async () => {
    const input = textData('Hyvää päivää! 🎉');
    const encoded = await base64EncodeOp.process(input);
    expect(toText(encoded)).toBe('SHl2w6TDpCBww6RpdsOkw6QhIPCfjok=');
    const decoded = await runPipeline(input, [base64EncodeOp, base64DecodeOp]);
    expect(toText(decoded)).toBe('Hyvää päivää! 🎉');
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

  it('hex encode defaults to lowercase', async () => {
    const result = await hexEncodeOp.process(textData('hello'));
    expect(toText(result)).toBe('68656c6c6f');
  });

  it('hex encode respects the uppercase case option', async () => {
    const result = await hexEncodeOp.process(textData('hello'), { case: 'upper' });
    expect(toText(result)).toBe('68656C6C6F');
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

describe('base64url and HTML entities', () => {
  it('base64url encodes without padding and with URL-safe characters', async () => {
    const encoded = await base64UrlEncodeOp.process(binaryData(new Uint8Array([0xfb, 0xff])));
    expect(toText(encoded)).toBe('-_8');
    const decoded = await base64UrlDecodeOp.process(encoded);
    expect(Array.from(toBinary(decoded))).toEqual([0xfb, 0xff]);
  });

  it('base64url decode accepts padded and plain Base64 input', async () => {
    expect(toText(await base64UrlDecodeOp.process(textData('aGk=')))).toBe('hi');
    expect(Array.from(toBinary(await base64UrlDecodeOp.process(textData('+/8='))))).toEqual([
      0xfb, 0xff,
    ]);
  });

  it('HTML encode escapes the special characters', async () => {
    expect(toText(await htmlEncodeOp.process(textData(`<a href="x">Tom & Jerry's</a>`)))).toBe(
      '&lt;a href=&quot;x&quot;&gt;Tom &amp; Jerry&#39;s&lt;/a&gt;',
    );
  });

  it('HTML decode handles named and numeric entities and leaves unknown ones', async () => {
    expect(
      toText(await htmlDecodeOp.process(textData('&lt;p&gt; p&auml;iv&#228;&#xE4; &bogus; &amp;'))),
    ).toBe('<p> päivää &bogus; &');
  });
});

describe('hash operations', () => {
  async function hashHex(op: OperationDef, input: PipelineData, params?: Record<string, unknown>) {
    const bytes = await op.process(input, params);
    return toText(await hexEncodeOp.process(bytes));
  }

  it('MD5 produces correct hash', async () => {
    expect(await hashHex(md5Op, textData('hello'))).toBe('5d41402abc4b2a76b9719d911017c592');
  });

  it('SHA-256 produces correct hash', async () => {
    expect(await hashHex(sha256Op, textData('hello'))).toBe(
      '2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824',
    );
  });

  // Test vectors from Stephen Thomas's IETF draft (password="password", salt="salt")
  it('PBKDF2-SHA-256 matches the known test vector at 1 iteration', async () => {
    expect(
      await hashHex(pbkdf2Sha256Op, textData('password'), {
        iterations: 1,
        salt: '73616c74', // "salt" as hex
        bits: 256,
      }),
    ).toBe('120fb6cffcf8b32c43e7225256c4f837a86548c92ccc35480805987cb70be17b');
  });

  it('PBKDF2-SHA-256 changes output when iterations change', async () => {
    const one = await hashHex(pbkdf2Sha256Op, textData('password'), {
      iterations: 1,
      salt: '73616c74',
      bits: 256,
    });
    const two = await hashHex(pbkdf2Sha256Op, textData('password'), {
      iterations: 2,
      salt: '73616c74',
      bits: 256,
    });
    expect(one).not.toBe(two);
    expect(two).toBe('ae4d0c95af6b46d32d0adff928f06dd02a303f8ef3c251dfd6e2d85a95474c43');
  });

  it('PBKDF2-SHA-512 produces a 128-hex-char output at 512 bits', async () => {
    const hex = await hashHex(pbkdf2Sha512Op, textData('password'), {
      iterations: 1,
      salt: '73616c74',
      bits: 512,
    });
    expect(hex).toHaveLength(128);
  });

  it('PBKDF2 rejects invalid salt hex', async () => {
    await expect(
      pbkdf2Sha256Op.process(textData('password'), { iterations: 1, salt: 'zz', bits: 256 }),
    ).rejects.toThrow();
    await expect(
      pbkdf2Sha256Op.process(textData('password'), { iterations: 1, salt: 'abc', bits: 256 }),
    ).rejects.toThrow();
  });
});

describe('more hashes', () => {
  async function hex(op: OperationDef, input: PipelineData, params?: Record<string, unknown>) {
    return toText(await hexEncodeOp.process(await op.process(input, params)));
  }
  const asHex = (text: string) => Buffer.from(text).toString('hex');

  it('SHA-384 produces correct hash', async () => {
    expect(await hex(sha384Op, textData('abc'))).toBe(
      'cb00753f45a35e8bb5a03d699ac65007272c32ab0eded1631a8b605a43ff5bed8086072ba1e7cc2358baeca134c825a7',
    );
  });

  // RFC 4231 test case 2
  it('HMAC-SHA-256 matches the RFC 4231 test vector', async () => {
    const params = { digest: 'SHA-256', key: asHex('Jefe') };
    expect(await hex(hmacOp, textData('what do ya want for nothing?'), params)).toBe(
      '5bdcc146bf60754e6a042426089575c75a003f089d2739839dec58b964ec3843',
    );
  });

  it('HMAC output length follows the digest', async () => {
    const out = await hmacOp.process(textData('x'), { digest: 'SHA-512', key: asHex('k') });
    expect(toBinary(out)).toHaveLength(64);
  });

  it('HMAC rejects an empty key', async () => {
    await expect(hmacOp.process(textData('x'), { key: '' })).rejects.toThrow();
  });

  it('CRC-32 matches the standard check value', async () => {
    expect(await hex(crc32Op, textData('123456789'))).toBe('cbf43926');
  });

  // OpenBSD test vector; the salt "CCCCCCCCCCCCCCCCCCCCC." decodes to these 16 bytes
  it('bcrypt matches the OpenBSD test vector', async () => {
    const result = await bcryptOp.process(textData('U*U'), {
      cost: 5,
      salt: '104104'.repeat(5) + '10',
    });
    expect(toText(result)).toBe('$2b$05$CCCCCCCCCCCCCCCCCCCCC.E5YPO9kmyuRGyh0XouQYb4YMJKvyOeW');
  });

  it('bcrypt uses a random salt when none is given', async () => {
    const one = toText(await bcryptOp.process(textData('pw'), { cost: 4 }));
    const two = toText(await bcryptOp.process(textData('pw'), { cost: 4 }));
    expect(one).toMatch(/^\$2b\$04\$[./A-Za-z0-9]{53}$/);
    expect(one).not.toBe(two);
  });

  it('bcrypt rejects passwords over 72 bytes and salts that are not 16 bytes', async () => {
    await expect(bcryptOp.process(textData('x'.repeat(73)), { cost: 4 })).rejects.toThrow();
    await expect(bcryptOp.process(textData('pw'), { cost: 4, salt: 'abcd' })).rejects.toThrow();
  });
});

describe('argon2id', () => {
  // Test vector from the reference implementation (phc-winner-argon2 test.c)
  it('matches the reference test vector', async () => {
    const result = await argon2idOp.process(textData('password'), {
      memory: 65536,
      iterations: 2,
      parallelism: 1,
      hashLength: 32,
      salt: '736f6d6573616c74', // "somesalt" as hex
    });
    expect(toText(result)).toBe(
      '$argon2id$v=19$m=65536,t=2,p=1$c29tZXNhbHQ$CTFhFdXPJO1aFaMaO6Mm5c8y7cJHAph8ArZWb2GRPPc',
    );
  });

  it('uses a random salt when none is given', async () => {
    const params = { memory: 64, iterations: 1, parallelism: 1 };
    const one = toText(await argon2idOp.process(textData('password'), params));
    const two = toText(await argon2idOp.process(textData('password'), params));
    expect(one).toMatch(/^\$argon2id\$v=19\$m=64,t=1,p=1\$[A-Za-z0-9+/]{22}\$[A-Za-z0-9+/]{43}$/);
    expect(one).not.toBe(two);
  });

  it('rejects an empty salt taken from another pipeline', async () => {
    await expect(
      argon2idOp.process(textData('password'), { salt: '', saltSource: 'pipeline' }),
    ).rejects.toThrow();
  });

  it('rejects a salt shorter than 8 bytes', async () => {
    await expect(argon2idOp.process(textData('password'), { salt: 'abcd' })).rejects.toThrow();
  });
});

describe('pipeline combinations', () => {
  it('base64-decode → JSON pretty reveals JSON hidden inside a base64 payload', async () => {
    const payload = '{"user":"tuukka","roles":["admin","editor"]}';
    const encoded = await base64EncodeOp.process(textData(payload));
    const result = await runPipeline(encoded, [base64DecodeOp, jsonPrettyOp]);
    expect(toText(result)).toBe(
      '{\n  "user": "tuukka",\n  "roles": [\n    "admin",\n    "editor"\n  ]\n}',
    );
  });

  it('JSON pretty → JSON compact roundtrips through formatting', async () => {
    const compact = '{"a":1,"b":[2,3]}';
    const result = await runPipeline(textData(compact), [jsonPrettyOp, jsonCompactOp]);
    expect(toText(result)).toBe(compact);
  });

  it('applying ROT-13 twice is identity', async () => {
    const result = await runPipeline(textData('Attack at dawn'), [rot13Op, rot13Op]);
    expect(toText(result)).toBe('Attack at dawn');
  });

  it('uppercase → reverse composes', async () => {
    const result = await runPipeline(textData('hello'), [uppercaseOp, reverseOp]);
    expect(toText(result)).toBe('OLLEH');
  });

  it('lowercase → MD5 → hex encode hashes the case-folded value', async () => {
    const result = await runPipeline(textData('HELLO'), [lowercaseOp, md5Op, hexEncodeOp]);
    expect(toText(result)).toBe('5d41402abc4b2a76b9719d911017c592');
  });

  it('hex encode → hex decode roundtrips binary-safe payloads', async () => {
    const result = await runPipeline(textData('Hello'), [hexEncodeOp, hexDecodeOp]);
    expect(toText(result)).toBe('Hello');
  });
});
