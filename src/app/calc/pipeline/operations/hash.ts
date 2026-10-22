import { hashBytes } from 'app/util/hash';
import { argon2id, bcrypt, crc32 } from 'hash-wasm';
import md5 from 'md5';

import { binaryData, OperationDef, textData, toBinary, toText } from '../types';

export const md5Op: OperationDef = {
  id: 'md5',
  name: 'MD5',
  category: 'hash',
  process: async input => {
    const bytes = md5(toText(input), { asBytes: true });
    return binaryData(new Uint8Array(bytes));
  },
};

export const sha1Op: OperationDef = {
  id: 'sha1',
  name: 'SHA-1',
  category: 'hash',
  process: async input => binaryData(await hashBytes(toText(input), 'SHA-1')),
};

export const sha256Op: OperationDef = {
  id: 'sha256',
  name: 'SHA-256',
  category: 'hash',
  process: async input => binaryData(await hashBytes(toText(input), 'SHA-256')),
};

export const sha384Op: OperationDef = {
  id: 'sha384',
  name: 'SHA-384',
  category: 'hash',
  process: async input => binaryData(await hashBytes(toText(input), 'SHA-384')),
};

export const sha512Op: OperationDef = {
  id: 'sha512',
  name: 'SHA-512',
  category: 'hash',
  process: async input => binaryData(await hashBytes(toText(input), 'SHA-512')),
};

function hexToBytes(hex: string, what = 'Salt'): Uint8Array {
  const clean = hex.replace(/\s+/g, '');
  if (clean.length % 2 !== 0) throw new Error(`${what} must have an even number of hex digits`);
  const bytes = new Uint8Array(clean.length / 2);
  for (let i = 0; i < bytes.length; i++) {
    const byte = parseInt(clean.slice(i * 2, i * 2 + 2), 16);
    if (Number.isNaN(byte)) throw new Error(`${what} contains non-hex characters`);
    bytes[i] = byte;
  }
  return bytes;
}

async function pbkdf2Derive(
  password: string,
  saltHex: string,
  iterations: number,
  digest: 'SHA-256' | 'SHA-512',
  bits: number,
): Promise<Uint8Array> {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(password),
    { name: 'PBKDF2' },
    false,
    ['deriveBits'],
  );
  const derived = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', hash: digest, salt: hexToBytes(saltHex) as BufferSource, iterations },
    key,
    bits,
  );
  return new Uint8Array(derived);
}

export const pbkdf2Sha256Op: OperationDef = {
  id: 'pbkdf2-sha256',
  name: 'PBKDF2-SHA-256',
  category: 'hash',
  defaultParams: { iterations: 27500, salt: '', bits: 256 },
  process: async (input, params) => {
    const iterations = typeof params?.iterations === 'number' ? params.iterations : 27500;
    const salt = typeof params?.salt === 'string' ? params.salt : '';
    const bits = typeof params?.bits === 'number' ? params.bits : 256;
    return binaryData(await pbkdf2Derive(toText(input), salt, iterations, 'SHA-256', bits));
  },
};

export const pbkdf2Sha512Op: OperationDef = {
  id: 'pbkdf2-sha512',
  name: 'PBKDF2-SHA-512',
  category: 'hash',
  defaultParams: { iterations: 210000, salt: '', bits: 512 },
  process: async (input, params) => {
    const iterations = typeof params?.iterations === 'number' ? params.iterations : 210000;
    const salt = typeof params?.salt === 'string' ? params.salt : '';
    const bits = typeof params?.bits === 'number' ? params.bits : 512;
    return binaryData(await pbkdf2Derive(toText(input), salt, iterations, 'SHA-512', bits));
  },
};

function numParam(params: Record<string, unknown> | undefined, key: string, def: number): number {
  const v = params?.[key];
  return typeof v === 'number' && v > 0 ? v : def;
}

/**
 * Argon2id password hash in the PHC string format
 * (`$argon2id$v=19$m=...,t=...,p=...$salt$hash`), which is what password libraries store and
 * verify against. Defaults follow the OWASP recommendation. An empty typed salt means a random
 * 16-byte salt, so each run gives a different (but equally valid) hash. A salt taken from another
 * pipeline must not be empty.
 */
export const argon2idOp: OperationDef = {
  id: 'argon2id',
  name: 'Argon2id',
  category: 'hash',
  defaultParams: { memory: 19456, iterations: 2, parallelism: 1, hashLength: 32, salt: '' },
  process: async (input, params) => {
    const saltHex = typeof params?.salt === 'string' ? params.salt.trim() : '';
    if (!saltHex && params?.saltSource === 'pipeline') {
      throw new Error('Salt pipeline has no output');
    }
    const salt = saltHex ? hexToBytes(saltHex) : crypto.getRandomValues(new Uint8Array(16));
    if (salt.length < 8) throw new Error('Salt must be at least 8 bytes');
    const parallelism = numParam(params, 'parallelism', 1);
    const encoded = await argon2id({
      password: toText(input),
      salt,
      memorySize: Math.max(numParam(params, 'memory', 19456), 8 * parallelism),
      iterations: numParam(params, 'iterations', 2),
      parallelism,
      hashLength: numParam(params, 'hashLength', 32),
      outputType: 'encoded',
    });
    return textData(encoded);
  },
};

const bcryptMaxPasswordBytes = 72;

/**
 * bcrypt password hash in the modular crypt format (`$2b$12$<salt><hash>`). The library writes
 * the older `$2a$` prefix; for passwords within the 72-byte limit `$2a$` and `$2b$` hash
 * identically, so we output the `$2b$` that current libraries write. An empty typed salt means a
 * random one.
 */
export const bcryptOp: OperationDef = {
  id: 'bcrypt',
  name: 'bcrypt',
  category: 'hash',
  defaultParams: { cost: 12, salt: '' },
  process: async (input, params) => {
    const password = toBinary(input);
    if (password.length > bcryptMaxPasswordBytes) {
      throw new Error(`bcrypt passwords can be at most ${bcryptMaxPasswordBytes} bytes`);
    }
    const saltHex = typeof params?.salt === 'string' ? params.salt.trim() : '';
    if (!saltHex && params?.saltSource === 'pipeline') {
      throw new Error('Salt pipeline has no output');
    }
    const salt = saltHex ? hexToBytes(saltHex) : crypto.getRandomValues(new Uint8Array(16));
    if (salt.length !== 16) throw new Error('bcrypt salt must be exactly 16 bytes');
    const cost = numParam(params, 'cost', 12);
    if (cost < 4 || cost > 31) throw new Error('bcrypt cost must be between 4 and 31');
    const encoded = await bcrypt({ password, salt, costFactor: cost, outputType: 'encoded' });
    return textData(encoded.replace(/^\$2a\$/, '$2b$'));
  },
};

type HmacDigest = 'SHA-1' | 'SHA-256' | 'SHA-384' | 'SHA-512';
const hmacDigests: HmacDigest[] = ['SHA-1', 'SHA-256', 'SHA-384', 'SHA-512'];

/** HMAC over the input. The key arrives as hex in `params.key`. */
export const hmacOp: OperationDef = {
  id: 'hmac',
  name: 'HMAC',
  category: 'hash',
  defaultParams: { digest: 'SHA-256', key: '', keySource: 'text' },
  process: async (input, params) => {
    const digest = hmacDigests.find(d => d === params?.digest) ?? 'SHA-256';
    const keyHex = typeof params?.key === 'string' ? params.key : '';
    if (!keyHex.trim()) throw new Error('HMAC key is empty');
    const key = await crypto.subtle.importKey(
      'raw',
      hexToBytes(keyHex, 'Key') as BufferSource,
      { name: 'HMAC', hash: digest },
      false,
      ['sign'],
    );
    const mac = await crypto.subtle.sign('HMAC', key, toBinary(input) as BufferSource);
    return binaryData(new Uint8Array(mac));
  },
};

/** CRC-32 (the zip/gzip/PNG variant), as 4 big-endian bytes */
export const crc32Op: OperationDef = {
  id: 'crc32',
  name: 'CRC-32',
  category: 'hash',
  process: async input => binaryData(hexToBytes(await crc32(toBinary(input)))),
};

export const hashOperations: OperationDef[] = [
  md5Op,
  sha1Op,
  sha256Op,
  sha384Op,
  sha512Op,
  hmacOp,
  pbkdf2Sha256Op,
  pbkdf2Sha512Op,
  argon2idOp,
  bcryptOp,
  crc32Op,
];
