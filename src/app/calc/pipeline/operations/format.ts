import { jsonStringToXml, xmlToJsonString } from 'app/calc/xml-json';

import { OperationDef, textData, toText } from '../types';

function toPrettyJSON(s: string): string {
  try {
    return JSON.stringify(JSON.parse(s), null, 2);
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
  name: 'JSON muotoiltu',
  category: 'format',
  process: async input => textData(toPrettyJSON(toText(input))),
};

export const jsonCompactOp: OperationDef = {
  id: 'json-compact',
  name: 'JSON tiivis',
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
