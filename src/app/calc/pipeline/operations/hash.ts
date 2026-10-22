import { hexToBytes } from 'app/calc/bytes';
import { hashBytes } from 'app/util/hash';
import { argon2id, bcrypt, crc32 } from 'hash-wasm';
import md5 from 'md5';

import { binaryData, OperationDef, textData, toBinary } from '../types';

export const md5Op: OperationDef = {
  id: 'md5',
  name: 'MD5',
  category: 'hash',
  process: async input => {
    const bytes = md5(toBinary(input), { asBytes: true });
    return binaryData(new Uint8Array(bytes));
  },
};

export const sha1Op: OperationDef = {
  id: 'sha1',
  name: 'SHA-1',
  category: 'hash',
  process: async input => binaryData(await hashBytes(toBinary(input), 'SHA-1')),
};

export const sha256Op: OperationDef = {
  id: 'sha256',
  name: 'SHA-256',
  category: 'hash',
  process: async input => binaryData(await hashBytes(toBinary(input), 'SHA-256')),
};

export const sha384Op: OperationDef = {
  id: 'sha384',
  name: 'SHA-384',
  category: 'hash',
  process: async input => binaryData(await hashBytes(toBinary(input), 'SHA-384')),
};

export const sha512Op: OperationDef = {
  id: 'sha512',
  name: 'SHA-512',
  category: 'hash',
  process: async input => binaryData(await hashBytes(toBinary(input), 'SHA-512')),
};

/**
 * Reads a byte-valued param set by the config's byte source picker (see `ByteSourceInput`). The
 * picker stores hex in `params[name]`, or null when the typed Base64 does not decode. Returns null
 * when the user left the field empty. An empty value taken from another pipeline is an error.
 */
function byteParam(
  params: Record<string, unknown> | undefined,
  name: string,
  what: string,
): Uint8Array | null {
  const value = params?.[name];
  if (value === null) throw new Error(`${what} is not valid Base64`);
  const hex = typeof value === 'string' ? value.trim() : '';
  if (hex) return hexToBytes(hex, what);
  if (params?.[`${name}Source`] === 'pipeline') throw new Error(`${what} pipeline has no output`);
  return null;
}

async function pbkdf2Derive(
  password: Uint8Array,
  salt: Uint8Array,
  iterations: number,
  digest: 'SHA-256' | 'SHA-512',
  bits: number,
): Promise<Uint8Array> {
  const key = await crypto.subtle.importKey(
    'raw',
    password as BufferSource,
    { name: 'PBKDF2' },
    false,
    ['deriveBits'],
  );
  const derived = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', hash: digest, salt: salt as BufferSource, iterations },
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
    const salt = byteParam(params, 'salt', 'Salt') ?? new Uint8Array();
    const bits = typeof params?.bits === 'number' ? params.bits : 256;
    return binaryData(await pbkdf2Derive(toBinary(input), salt, iterations, 'SHA-256', bits));
  },
};

export const pbkdf2Sha512Op: OperationDef = {
  id: 'pbkdf2-sha512',
  name: 'PBKDF2-SHA-512',
  category: 'hash',
  defaultParams: { iterations: 210000, salt: '', bits: 512 },
  process: async (input, params) => {
    const iterations = typeof params?.iterations === 'number' ? params.iterations : 210000;
    const salt = byteParam(params, 'salt', 'Salt') ?? new Uint8Array();
    const bits = typeof params?.bits === 'number' ? params.bits : 512;
    return binaryData(await pbkdf2Derive(toBinary(input), salt, iterations, 'SHA-512', bits));
  },
};

function numParam(params: Record<string, unknown> | undefined, key: string, def: number): number {
  const v = params?.[key];
  return typeof v === 'number' && v > 0 ? v : def;
}

/**
 * Limits for the Argon2id settings. The hash runs on the main thread, and its time grows with
 * memory × iterations: about 1.3 ms per MiB per iteration on a fast laptop, so the 4 GiB budget
 * means about 5 s. 1 GiB of memory covers common real-world settings; browsers often cannot
 * allocate more. hash-wasm runs the lanes one after another, so parallelism hardly changes the
 * time.
 */
export const argon2Limits = {
  memoryKiB: { min: 8, max: 1024 * 1024 },
  iterations: { min: 1, max: 10 },
  parallelism: { min: 1, max: 16 },
  memoryTimesIterationsKiB: 4 * 1024 * 1024,
};

function checkArgon2Limits(memory: number, iterations: number, parallelism: number) {
  const { memoryKiB, memoryTimesIterationsKiB } = argon2Limits;
  if (memory < memoryKiB.min || memory > memoryKiB.max) {
    throw new Error(`Memory must be between ${memoryKiB.min} and ${memoryKiB.max} KiB`);
  }
  if (iterations > argon2Limits.iterations.max) {
    throw new Error(`Iterations can be at most ${argon2Limits.iterations.max}`);
  }
  if (parallelism > argon2Limits.parallelism.max) {
    throw new Error(`Parallelism can be at most ${argon2Limits.parallelism.max}`);
  }
  if (memory * iterations > memoryTimesIterationsKiB) {
    throw new Error('Memory × iterations can be at most 4 GiB (for example 1 GiB × 4)');
  }
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
  expensive: true,
  defaultParams: { memory: 19456, iterations: 2, parallelism: 1, hashLength: 32, salt: '' },
  process: async (input, params) => {
    const salt = byteParam(params, 'salt', 'Salt') ?? crypto.getRandomValues(new Uint8Array(16));
    if (salt.length < 8) throw new Error('Salt must be at least 8 bytes');
    const memory = numParam(params, 'memory', 19456);
    const iterations = numParam(params, 'iterations', 2);
    const parallelism = numParam(params, 'parallelism', 1);
    checkArgon2Limits(memory, iterations, parallelism);
    const encoded = await argon2id({
      password: toBinary(input),
      salt,
      memorySize: Math.max(memory, 8 * parallelism),
      iterations,
      parallelism,
      hashLength: numParam(params, 'hashLength', 32),
      outputType: 'encoded',
    });
    return textData(encoded);
  },
};

const bcryptMaxPasswordBytes = 72;
/**
 * bcrypt itself allows costs up to 31, but every step doubles the time and the hash runs on the
 * main thread: cost 12 takes about 0.3 s on a fast laptop and cost 16 about 4 s.
 */
export const bcryptMinCost = 4;
export const bcryptMaxCost = 16;

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
  expensive: true,
  defaultParams: { cost: 12, salt: '' },
  process: async (input, params) => {
    const password = toBinary(input);
    if (password.length > bcryptMaxPasswordBytes) {
      throw new Error(`bcrypt passwords can be at most ${bcryptMaxPasswordBytes} bytes`);
    }
    const salt = byteParam(params, 'salt', 'Salt') ?? crypto.getRandomValues(new Uint8Array(16));
    if (salt.length !== 16) throw new Error('bcrypt salt must be exactly 16 bytes');
    const cost = numParam(params, 'cost', 12);
    if (cost < bcryptMinCost || cost > bcryptMaxCost) {
      throw new Error(`bcrypt cost must be between ${bcryptMinCost} and ${bcryptMaxCost}`);
    }
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
    const keyBytes = byteParam(params, 'key', 'Key');
    if (!keyBytes?.length) throw new Error('HMAC key is empty');
    const key = await crypto.subtle.importKey(
      'raw',
      keyBytes as BufferSource,
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
