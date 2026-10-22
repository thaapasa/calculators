import { bytesToHex } from 'app/calc/bytes';

/** Digest of the data; a string is hashed as its UTF-8 bytes */
export async function hashBytes(x: string | Uint8Array, digest: string): Promise<Uint8Array> {
  const msgBuffer = typeof x === 'string' ? new TextEncoder().encode(x) : x;
  const hashBuffer = await crypto.subtle.digest(digest, msgBuffer as BufferSource);
  return new Uint8Array(hashBuffer);
}

export async function hash(x: string, digest: string): Promise<string> {
  return bytesToHex(await hashBytes(x, digest));
}
