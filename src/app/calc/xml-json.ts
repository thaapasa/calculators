import { XMLBuilder, XMLParser } from 'fast-xml-parser';

const parser = new XMLParser({
  ignoreAttributes: false,
  trimValues: true,
  parseAttributeValue: true,
  parseTagValue: true,
});

const builder = new XMLBuilder({
  ignoreAttributes: false,
  format: true,
  indentBy: '  ',
});

export function xmlToJson<T>(x: string): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    try {
      resolve(parser.parse(x));
    } catch (_e) {
      reject('Invalid XML');
    }
  });
}

export async function xmlToJsonString(x: string): Promise<string> {
  try {
    return JSON.stringify(await xmlToJson(x), null, 2);
  } catch (_e) {
    return 'Invalid XML';
  }
}

export function jsonToXml(x: unknown): string {
  return builder.build(x);
}

export function jsonStringToXml(x: string): string {
  try {
    return jsonToXml(JSON.parse(x));
  } catch (_e) {
    return 'Invalid JSON';
  }
}
