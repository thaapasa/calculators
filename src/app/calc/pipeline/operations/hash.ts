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

export const hashOperations: OperationDef[] = [md5Op, sha1Op, sha256Op, sha512Op];
