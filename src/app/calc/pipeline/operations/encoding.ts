import { binaryData, OperationDef, textData, toBinary, toText } from '../types';

export const base64EncodeOp: OperationDef = {
  id: 'base64-encode',
  name: 'Base64 encode',
  category: 'encoding',
  process: async input => {
    const bytes = toBinary(input);
    let binary = '';
    for (let i = 0; i < bytes.length; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return textData(btoa(binary));
  },
};

export const base64DecodeOp: OperationDef = {
  id: 'base64-decode',
  name: 'Base64 decode',
  category: 'encoding',
  process: async input => {
    const binary = atob(toText(input).trim());
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return binaryData(bytes);
  },
};

export const urlEncodeOp: OperationDef = {
  id: 'url-encode',
  name: 'URL encode',
  category: 'encoding',
  process: async input => textData(encodeURIComponent(toText(input))),
};

export const urlDecodeOp: OperationDef = {
  id: 'url-decode',
  name: 'URL decode',
  category: 'encoding',
  process: async input => textData(decodeURIComponent(toText(input))),
};

export const hexEncodeOp: OperationDef = {
  id: 'hex-encode',
  name: 'Hex encode',
  category: 'encoding',
  defaultParams: { case: 'lower' },
  process: async (input, params) => {
    const bytes = toBinary(input);
    const hex = Array.from(bytes, b => b.toString(16).padStart(2, '0')).join('');
    return textData(params?.case === 'upper' ? hex.toUpperCase() : hex.toLowerCase());
  },
};

export const hexDecodeOp: OperationDef = {
  id: 'hex-decode',
  name: 'Hex decode',
  category: 'encoding',
  process: async input => {
    const clean = toText(input).replace(/\s+/g, '');
    if (clean.length % 2 !== 0) throw new Error('Hex input must have an even number of digits');
    const bytes = new Uint8Array(clean.length / 2);
    for (let i = 0; i < bytes.length; i++) {
      const byte = parseInt(clean.slice(i * 2, i * 2 + 2), 16);
      if (Number.isNaN(byte)) throw new Error('Hex input contains non-hex characters');
      bytes[i] = byte;
    }
    return binaryData(bytes);
  },
};

/** Decode JWT token payload to JSON */
export const jwtDecodeOp: OperationDef = {
  id: 'jwt-decode',
  name: 'JWT decode',
  category: 'encoding',
  process: async input => {
    const token = toText(input).trim();
    const parts = token.split('.');
    if (parts.length !== 3) throw new Error('Invalid JWT (expected 3 parts)');
    const payload = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const padded = payload + '='.repeat((4 - (payload.length % 4)) % 4);
    const decoded = atob(padded);
    // Decode as UTF-8 for non-ASCII content
    const bytes = new Uint8Array(decoded.length);
    for (let i = 0; i < decoded.length; i++) {
      bytes[i] = decoded.charCodeAt(i);
    }
    return textData(new TextDecoder().decode(bytes));
  },
};

export const encodingOperations: OperationDef[] = [
  base64EncodeOp,
  base64DecodeOp,
  urlEncodeOp,
  urlDecodeOp,
  hexEncodeOp,
  hexDecodeOp,
  jwtDecodeOp,
];
