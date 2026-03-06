import { FormControl, InputLabel, MenuItem, Select, styled, TextField } from '@mui/material';
import React, { useCallback, useRef, useState } from 'react';
import svgToReactNative from 'svg-rn';

import * as base64 from '../calc/base64';
import rot13 from '../calc/rot13';
import { jsonStringToXml, xmlToJsonString } from '../calc/xml-json';
import * as store from '../util/store';
import * as strings from '../util/strings';
import { identity, MaybePromise } from '../util/util';
import Section from './component/section';
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

function svgToRn(s: string): string {
  try {
    return svgToReactNative(s);
  } catch (_e) {
    return 'Virheellinen SVG';
  }
}

const convertInfo: { [key: string]: ConverterInfo } = {
  js2xml: {
    encode: jsonStringToXml,
    decode: xmlToJsonString,
    name: 'JSON ⇆ XML',
  },
  svg2RN: {
    encode: svgToRn,
    decode: identity,
    name: 'SVG → React Native',
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

  const sourceRef = useRef<HTMLInputElement>(null);
  const targetRef = useRef<HTMLInputElement>(null);

  // Track which field is being edited to prevent circular updates
  const editingRef = useRef<'source' | 'target' | null>(null);

  const onSourceChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
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
    async (e: React.ChangeEvent<HTMLInputElement>) => {
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
      <FormControl>
        <InputLabel id="text-conversion-label">Muunnos</InputLabel>
        <StyledSelect
          labelId="text-conversion-label"
          id="text-conversion-select"
          label="Muunnos"
          value={selected}
          onChange={e => onConverterChange(e.target.value as string)}
        >
          {converters.map(c => (
            <MenuItem value={c} key={c}>
              {convertInfo[c].name}
            </MenuItem>
          ))}
        </StyledSelect>
      </FormControl>
      <TextRow className="center-horizontal top">
        <ClipboardButton
          title="Kopioi lähde leikepöydälle"
          onClick={() => copyRefToClipboard(sourceRef)}
          color="secondary"
        />
        <TextEdit
          onChange={onSourceChange}
          fullWidth={true}
          multiline={true}
          inputRef={sourceRef}
          name="source"
          value={source}
        />
        <LenghtArea>{source.length}</LenghtArea>
      </TextRow>
      <TextRow className="center-horizontal top">
        <ClipboardButton
          title="Kopioi kohde leikepöydälle"
          onClick={() => copyRefToClipboard(targetRef)}
          color="secondary"
        />
        <TextEdit
          onChange={onTargetChange}
          fullWidth={true}
          multiline={true}
          inputRef={targetRef}
          name="target"
          value={target}
        />
        <LenghtArea>{target.length}</LenghtArea>
      </TextRow>
    </Section>
  );
}

const StyledSelect = styled(Select)`
  width: 260px;
`;

const LenghtArea = styled(LeftPad)`
  margin-top: 16px;
`;

const TextRow = styled(FlexRow)`
  margin-top: 8px;
`;

const TextEdit = styled(TextField)`
  margin-top: 8px !important;
`;
