import { rotN } from 'app/calc/rot13';
import { reverse, toLowerCase, toUpperCase } from 'app/util/strings';

import { OperationDef, textData, toText } from '../types';

export const rot13Op: OperationDef = {
  id: 'rot13',
  name: 'ROT-N',
  category: 'text',
  defaultParams: { shift: 13 },
  process: async (input, params) => {
    const shift = typeof params?.shift === 'number' ? params.shift : 13;
    return textData(rotN(toText(input), shift));
  },
};

export const uppercaseOp: OperationDef = {
  id: 'uppercase',
  name: 'Uppercase',
  category: 'text',
  process: async input => textData(toUpperCase(toText(input))),
};

export const lowercaseOp: OperationDef = {
  id: 'lowercase',
  name: 'Lowercase',
  category: 'text',
  process: async input => textData(toLowerCase(toText(input))),
};

export const reverseOp: OperationDef = {
  id: 'reverse',
  name: 'Reverse',
  category: 'text',
  process: async input => textData(reverse(toText(input))),
};

export const lineSortOp: OperationDef = {
  id: 'line-sort',
  name: 'Sort lines',
  category: 'text',
  defaultParams: { direction: 'asc' },
  process: async (input, params) => {
    const lines = toText(input).split('\n');
    lines.sort((a, b) => a.localeCompare(b));
    if (params?.direction === 'desc') lines.reverse();
    return textData(lines.join('\n'));
  },
};

export const uniqueLinesOp: OperationDef = {
  id: 'unique-lines',
  name: 'Unique lines',
  category: 'text',
  process: async input => {
    const lines = toText(input).split('\n');
    return textData(Array.from(new Set(lines)).join('\n'));
  },
};

export const trimOp: OperationDef = {
  id: 'trim',
  name: 'Trim',
  category: 'text',
  process: async input =>
    textData(
      toText(input)
        .split('\n')
        .map(line => line.trim())
        .join('\n'),
    ),
};

export const textOperations: OperationDef[] = [
  rot13Op,
  uppercaseOp,
  lowercaseOp,
  reverseOp,
  lineSortOp,
  uniqueLinesOp,
  trimOp,
];
