import rot13 from 'app/calc/rot13';
import { reverse, toLowerCase, toUpperCase } from 'app/util/strings';

import { OperationDef, textData, toText } from '../types';

export const rot13Op: OperationDef = {
  id: 'rot13',
  name: 'ROT-13',
  category: 'text',
  process: async input => textData(rot13(toText(input))),
};

export const uppercaseOp: OperationDef = {
  id: 'uppercase',
  name: 'Isot kirjaimet',
  category: 'text',
  process: async input => textData(toUpperCase(toText(input))),
};

export const lowercaseOp: OperationDef = {
  id: 'lowercase',
  name: 'Pienet kirjaimet',
  category: 'text',
  process: async input => textData(toLowerCase(toText(input))),
};

export const reverseOp: OperationDef = {
  id: 'reverse',
  name: 'Käänteinen',
  category: 'text',
  process: async input => textData(reverse(toText(input))),
};

export const textOperations: OperationDef[] = [rot13Op, uppercaseOp, lowercaseOp, reverseOp];
