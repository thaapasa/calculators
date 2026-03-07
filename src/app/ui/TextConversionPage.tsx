import React, { useCallback, useRef, useState } from 'react';

import * as base64 from '../calc/base64';
import rot13 from '../calc/rot13';
import { jsonStringToXml, xmlToJsonString } from '../calc/xml-json';
import * as store from '../util/store';
import * as strings from '../util/strings';
import { MaybePromise } from '../util/util';
import Section from './component/Section';
import { ClipboardButton, copyRefToClipboard } from './component/ToolButton';
import { publishSelectedValue } from './LastValue';
import { FlexRow, LeftPad } from './layout/elements';

interface ConverterInfo {
  readonly encode: (x: string) => MaybePromise<string>;
  readonly decode: (x: string) => MaybePromise<string>;
  readonly name: string;
}

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

const convertInfo: { [key: string]: ConverterInfo } = {
  js2xml: {
    encode: jsonStringToXml,
    decode: xmlToJsonString,
    name: 'JSON ⇆ XML',
  },
  jsonCompactPretty: {
    encode: toPrettyJSON,
    decode: toCompactJSON,
    name: 'JSON compact ⇆ pretty',
  },
  urlEncode: {
    encode: async x => encodeURIComponent(x),
    decode: x => decodeURIComponent(x),
    name: 'URL encode',
  },
  base64: { encode: base64.encode, decode: base64.decode, name: 'Base64' },
  hexStr: {
    encode: strings.toHexString,
    decode: strings.fromHexString,
    name: 'Heksamerkkijono',
  },
  rot13: { encode: rot13, decode: rot13, name: 'ROT-13' },
};
const converters = Object.keys(convertInfo);

const CONVERTER_STORE_KEY = 'calculators:selectedTextConverter';

function getConverterFromStore(): string {
  return store.getValue<string>(CONVERTER_STORE_KEY) || converters[0];
}

function setConverterToStore(converterName: string): void {
  store.putValue(CONVERTER_STORE_KEY, converterName);
}

export function TextConversionPage() {
  const [source, setSource] = useState('');
  const [target, setTarget] = useState('');
  const [selected, setSelected] = useState(getConverterFromStore);

  const sourceRef = useRef<HTMLTextAreaElement>(null);
  const targetRef = useRef<HTMLTextAreaElement>(null);

  const editingRef = useRef<'source' | 'target' | null>(null);

  const onSourceChange = useCallback(
    async (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      if (editingRef.current === 'target') return;
      editingRef.current = 'source';
      const val = e.target.value;
      setSource(val);
      const encoded = await convertInfo[selected].encode(val);
      setTarget(encoded);
      publishSelectedValue(encoded);
      editingRef.current = null;
    },
    [selected],
  );

  const onTargetChange = useCallback(
    async (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      if (editingRef.current === 'source') return;
      editingRef.current = 'target';
      const val = e.target.value;
      setTarget(val);
      const decoded = await convertInfo[selected].decode(val);
      setSource(decoded);
      publishSelectedValue(val);
      editingRef.current = null;
    },
    [selected],
  );

  const onConverterChange = useCallback(
    async (converterName: string) => {
      setSelected(converterName);
      setConverterToStore(converterName);
      if (source) {
        const encoded = await convertInfo[converterName].encode(source);
        setTarget(encoded);
        publishSelectedValue(encoded);
      }
    },
    [source],
  );

  return (
    <Section
      title="Tekstimuunnokset"
      subtitle={convertInfo[selected].name}
      image="/img/header-text-conversion.jpg"
    >
      <div>
        <label className="text-sm text-muted" htmlFor="text-conversion-select">
          Muunnos
        </label>
        <select
          id="text-conversion-select"
          className="w-[260px] ml-2 rounded border border-border bg-transparent px-3 py-2 text-sm"
          value={selected}
          onChange={e => onConverterChange(e.target.value)}
        >
          {converters.map(c => (
            <option value={c} key={c}>
              {convertInfo[c].name}
            </option>
          ))}
        </select>
      </div>
      <FlexRow className="mt-2 justify-center items-start">
        <ClipboardButton
          title="Kopioi lähde leikepöydälle"
          onClick={() => copyRefToClipboard(sourceRef as any)}
          color="secondary"
        />
        <textarea
          className="mt-2 w-full min-h-[60px] border border-border rounded bg-transparent px-3 py-2"
          onChange={onSourceChange}
          ref={sourceRef}
          name="source"
          value={source}
        />
        <LeftPad className="mt-4">{source.length}</LeftPad>
      </FlexRow>
      <FlexRow className="mt-2 justify-center items-start">
        <ClipboardButton
          title="Kopioi kohde leikepöydälle"
          onClick={() => copyRefToClipboard(targetRef as any)}
          color="secondary"
        />
        <textarea
          className="mt-2 w-full min-h-[60px] border border-border rounded bg-transparent px-3 py-2"
          onChange={onTargetChange}
          ref={targetRef}
          name="target"
          value={target}
        />
        <LeftPad className="mt-4">{target.length}</LeftPad>
      </FlexRow>
    </Section>
  );
}
