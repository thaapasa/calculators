import { FormControl, InputLabel, MenuItem, Select, TextField } from '@material-ui/core';
import * as Bacon from 'baconjs';
import React from 'react';
import styled from 'styled-components';
import svgToReactNative from 'svg-rn';

import * as base64 from '../calc/base64';
import rot13 from '../calc/rot13';
import { jsonStringToXml, xmlToJsonString } from '../calc/xml-json';
import * as store from '../util/store';
import * as strings from '../util/strings';
import { identity } from '../util/util';
import Section from './component/section';
import { ClipboardButton, copyRefToClipboard } from './component/tool-button';
import { FlexRow, LeftPad } from './layout/elements';

interface ConverterInfo {
  readonly encode: (x: string) => Promise<string> | string;
  readonly decode: (x: string) => Promise<string> | string;
  readonly name: string;
}

function toPrettyJSON(s: string): string {
  try {
    return JSON.stringify(JSON.parse(s), null, 2);
  } catch (e) {
    return s;
  }
}

function toCompactJSON(s: string): string {
  try {
    return JSON.stringify(JSON.parse(s));
  } catch (e) {
    return s;
  }
}

function svgToRn(s: string): string {
  try {
    return svgToReactNative(s);
  } catch (e) {
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

interface TextConversionProps {
  readonly onValue: (x: string) => any;
}

interface TextConversionState {
  source: string;
  target: string;
  selected: any;
}

const CONVERTER_STORE_KEY = 'calculators:selectedTextConverter';

function getConverterFromStore(): string {
  return store.getValue<string>(CONVERTER_STORE_KEY) || converters[0];
}

function setConverterToStore(converterName: string): void {
  store.putValue(CONVERTER_STORE_KEY, converterName);
}

export default class TextConversion extends React.Component<
  TextConversionProps,
  TextConversionState
> {
  public state: TextConversionState = {
    source: '',
    target: '',
    selected: converters[0],
  };

  private sourceRef = React.createRef<HTMLInputElement>();
  private targetRef = React.createRef<HTMLInputElement>();

  private sourceStr = new Bacon.Bus<string>();
  private targetStr = new Bacon.Bus<string>();
  private selectedStr = new Bacon.Bus<string>();

  public componentDidMount() {
    const initialConverter = getConverterFromStore();
    this.sourceStr.onValue(v => this.setState({ source: v }));
    this.targetStr.onValue(v => this.setState({ target: v }));
    const selected = this.selectedStr.toProperty(initialConverter).skipDuplicates();
    selected.onValue(v => {
      this.setState({ selected: v });
      setConverterToStore(v);
    });
    const encStr = this.sourceStr.combine(selected, (val, c) => convertInfo[c].encode(val));
    encStr.onValue(async v => this.setState({ target: await v }));
    const decStr = this.targetStr.combine(selected, (val, c) => convertInfo[c].decode(val));
    decStr.onValue(async v => this.setState({ source: await v }));
    Bacon.mergeAll(encStr.changes(), decStr.changes()).onValue(
      async v => this.props.onValue && this.props.onValue(await v),
    );
    this.selectedStr.push(initialConverter);
  }

  public render() {
    return (
      <Section
        title="Tekstimuunnokset"
        subtitle={convertInfo[this.state.selected].name}
        image="/img/header-text-conversion.jpg"
      >
        <FormControl>
          <InputLabel htmlFor="conversion">Muunnos</InputLabel>
          <StyledSelect
            inputProps={{ id: 'conversion' }}
            value={this.state.selected}
            onChange={e => this.selectedStr.push(e.target.value as any)}
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
            onClick={this.copySourceToClipboard}
            color="secondary"
          />
          <TextEdit
            onChange={e => this.sourceStr.push(e.target.value)}
            fullWidth={true}
            multiline={true}
            inputRef={this.sourceRef}
            name="source"
            value={this.state.source}
          />
          <LenghtArea>{this.state.source.length}</LenghtArea>
        </TextRow>
        <TextRow className="center-horizontal top">
          <ClipboardButton
            title="Kopioi kohde leikepöydälle"
            onClick={this.copyTargetToClipboard}
            color="secondary"
          />
          <TextEdit
            onChange={e => this.targetStr.push(e.target.value)}
            fullWidth={true}
            multiline={true}
            inputRef={this.targetRef}
            name="target"
            value={this.state.target}
          />
          <LenghtArea>{this.state.target.length}</LenghtArea>
        </TextRow>
      </Section>
    );
  }

  private copySourceToClipboard = () => copyRefToClipboard(this.sourceRef);
  private copyTargetToClipboard = () => copyRefToClipboard(this.targetRef);
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
