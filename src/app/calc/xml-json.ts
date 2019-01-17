import * as xml2js from 'xml2js';
import { parseBooleans, parseNumbers } from 'xml2js/lib/processors';

export function xmlToJson<T>(x: string): Promise<T> {
  return new Promise<T>((resolve, reject) =>
    xml2js.parseString(
      x,
      {
        ignoreAttrs: false,
        trim: true,
        valueProcessors: [parseNumbers, parseBooleans],
        explicitArray: false,
      },
      (err, res) => {
        if (err) {
          reject('Invalid XML');
        } else {
          resolve(res);
        }
      }
    )
  );
}

export async function xmlToJsonString(x: string): Promise<string> {
  try {
    return JSON.stringify(await xmlToJson(x), null, 2);
  } catch (e) {
    return 'Invalid XML';
  }
}

const xmlBuilder = new xml2js.Builder();

export function jsonToXml(x: any): string {
  return xmlBuilder.buildObject(x).toString();
}

export function jsonStringToXml(x: string): string {
  try {
    return jsonToXml(JSON.parse(x));
  } catch (e) {
    return 'Invalid JSON';
  }
}
