import { hash } from 'app/util/hash';
import md5 from 'md5';

import { OperationDef, textData, toText } from '../types';

export const md5Op: OperationDef = {
  id: 'md5',
  name: 'MD5',
  category: 'hash',
  process: async input => textData(md5(toText(input))),
};

export const sha1Op: OperationDef = {
  id: 'sha1',
  name: 'SHA-1',
  category: 'hash',
  process: async input => textData(await hash(toText(input), 'SHA-1')),
};

export const sha256Op: OperationDef = {
  id: 'sha256',
  name: 'SHA-256',
  category: 'hash',
  process: async input => textData(await hash(toText(input), 'SHA-256')),
};

export const sha512Op: OperationDef = {
  id: 'sha512',
  name: 'SHA-512',
  category: 'hash',
  process: async input => textData(await hash(toText(input), 'SHA-512')),
};

function hexToBytes(hex: string): Uint8Array {
  const clean = hex.replace(/\s+/g, '');
  if (clean.length % 2 !== 0) throw new Error('Salt must have an even number of hex digits');
  const bytes = new Uint8Array(clean.length / 2);
  for (let i = 0; i < bytes.length; i++) {
    const byte = parseInt(clean.slice(i * 2, i * 2 + 2), 16);
    if (Number.isNaN(byte)) throw new Error('Salt contains non-hex characters');
    bytes[i] = byte;
  }
  return bytes;
}

function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes, b => b.toString(16).padStart(2, '0')).join('');
}

async function pbkdf2Derive(
  password: string,
  saltHex: string,
  iterations: number,
  digest: 'SHA-256' | 'SHA-512',
  bits: number,
): Promise<string> {
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
  return bytesToHex(new Uint8Array(derived));
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
    return textData(await pbkdf2Derive(toText(input), salt, iterations, 'SHA-256', bits));
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
    return textData(await pbkdf2Derive(toText(input), salt, iterations, 'SHA-512', bits));
  },
};

export const hashOperations: OperationDef[] = [
  md5Op,
  sha1Op,
  sha256Op,
  sha512Op,
  pbkdf2Sha256Op,
  pbkdf2Sha512Op,
];
