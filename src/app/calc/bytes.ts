/** Lowercase hex, two digits per byte */
export function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes, b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Parses hex into bytes. Whitespace is ignored. `what` names the value in error messages, such
 * as "Salt must have an even number of hex digits".
 */
export function hexToBytes(hex: string, what = 'Hex input'): Uint8Array {
  const clean = hex.replace(/\s+/g, '');
  if (!/^[0-9a-fA-F]*$/.test(clean)) throw new Error(`${what} contains non-hex characters`);
  if (clean.length % 2 !== 0) throw new Error(`${what} must have an even number of hex digits`);
  const bytes = new Uint8Array(clean.length / 2);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(clean.slice(i * 2, i * 2 + 2), 16);
  }
  return bytes;
}

/** Decodes standard Base64. Whitespace is ignored and padding is optional. */
export function base64ToBytes(b64: string, what = 'Input'): Uint8Array {
  let binary: string;
  try {
    binary = atob(b64.replace(/\s+/g, ''));
  } catch {
    throw new Error(`${what} is not valid Base64`);
  }
  return Uint8Array.from(binary, c => c.charCodeAt(0));
}

/** UTF-8 bytes of the text as hex */
export function textToHex(text: string): string {
  return bytesToHex(new TextEncoder().encode(text));
}
