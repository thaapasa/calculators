import { jsonStringToXml, xmlToJsonString } from 'app/calc/xml-json';

import { OperationDef, textData, toText } from '../types';
import {
  coerceJsonValue,
  getAtPath,
  parseJsonPath,
  renderExtractedValue,
  setAtPath,
} from './jsonPath';

function toPrettyJSON(s: string, indent: number | string = 2): string {
  try {
    return JSON.stringify(JSON.parse(s), null, indent);
  } catch (_e) {
    return s;
  }
}

function toCompactJSON(s: string): string {
  try {
    return JSON.stringify(JSON.parse(s));
  } catch (_e) {
    return s;
  }
}

export const jsonPrettyOp: OperationDef = {
  id: 'json-pretty',
  name: 'JSON pretty',
  category: 'format',
  defaultParams: { indent: 2 },
  process: async (input, params) => {
    const indent = params?.indent === 'tab' ? '\t' : Number(params?.indent ?? 2);
    return textData(toPrettyJSON(toText(input), indent));
  },
};

export const jsonCompactOp: OperationDef = {
  id: 'json-compact',
  name: 'JSON compact',
  category: 'format',
  process: async input => textData(toCompactJSON(toText(input))),
};

export const jsonToXmlOp: OperationDef = {
  id: 'json-to-xml',
  name: 'JSON → XML',
  category: 'format',
  process: async input => textData(jsonStringToXml(toText(input))),
};

export const xmlToJsonOp: OperationDef = {
  id: 'xml-to-json',
  name: 'XML → JSON',
  category: 'format',
  process: async input => textData(await xmlToJsonString(toText(input))),
};

export const jsonExtractOp: OperationDef = {
  id: 'json-extract',
  name: 'JSON extract',
  category: 'format',
  description: 'Extract value at JSON path (e.g. $.user.name, /user/name, items[0].id)',
  defaultParams: { path: '' },
  process: async (input, params) => {
    const path = typeof params?.path === 'string' ? params.path : '';
    const segments = parseJsonPath(path);
    const parsed = JSON.parse(toText(input));
    const value = getAtPath(parsed, segments);
    return textData(renderExtractedValue(value));
  },
};

export const jsonMergeOp: OperationDef = {
  id: 'json-merge',
  name: 'JSON set value',
  category: 'format',
  description: 'Set/insert a value at a JSON path. Value from text or another pipeline.',
  defaultParams: { path: '', value: '', valueType: 'auto', indent: 2 },
  process: async (input, params) => {
    const path = typeof params?.path === 'string' ? params.path : '';
    const valueText = typeof params?.value === 'string' ? params.value : '';
    const valueType: 'auto' | 'string' | 'json' =
      params?.valueType === 'string' || params?.valueType === 'json' ? params.valueType : 'auto';
    const indent = params?.indent === 'tab' ? '\t' : Number(params?.indent ?? 2);
    const segments = parseJsonPath(path);
    const inputText = toText(input).trim();
    const root =
      inputText === ''
        ? segments.length > 0 && typeof segments[0] === 'number'
          ? []
          : {}
        : JSON.parse(inputText);
    const value = coerceJsonValue(valueText, valueType);
    const updated = setAtPath(root, segments, value);
    return textData(JSON.stringify(updated, null, indent));
  },
};

export const formatOperations: OperationDef[] = [
  jsonPrettyOp,
  jsonCompactOp,
  jsonExtractOp,
  jsonMergeOp,
  jsonToXmlOp,
  xmlToJsonOp,
];
