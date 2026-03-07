import { jsonStringToXml, xmlToJsonString } from 'app/calc/xml-json';

import { OperationDef, textData, toText } from '../types';

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

export const formatOperations: OperationDef[] = [
  jsonPrettyOp,
  jsonCompactOp,
  jsonToXmlOp,
  xmlToJsonOp,
];
