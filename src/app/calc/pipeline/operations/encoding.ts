import * as base64 from 'app/calc/base64';
import { fromHexString, toHexString } from 'app/util/strings';

import { OperationDef, textData, toText } from '../types';

export const base64EncodeOp: OperationDef = {
  id: 'base64-encode',
  name: 'Base64 encode',
  category: 'encoding',
  process: async input => textData(base64.encode(toText(input))),
};

export const base64DecodeOp: OperationDef = {
  id: 'base64-decode',
  name: 'Base64 decode',
  category: 'encoding',
  process: async input => textData(base64.decode(toText(input))),
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
  name: 'Hex-merkkijono',
  category: 'encoding',
  process: async input => textData(toHexString(toText(input))),
};

export const hexDecodeOp: OperationDef = {
  id: 'hex-decode',
  name: 'Hex-merkkijonosta',
  category: 'encoding',
  process: async input => textData(fromHexString(toText(input))),
};

export const encodingOperations: OperationDef[] = [
  base64EncodeOp,
  base64DecodeOp,
  urlEncodeOp,
  urlDecodeOp,
  hexEncodeOp,
  hexDecodeOp,
];
