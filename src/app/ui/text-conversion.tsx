import Bacon from 'baconjs';
import MenuItem from 'material-ui/MenuItem';
import SelectField from 'material-ui/SelectField';
import TextField from 'material-ui/TextField';
import React from 'react';
import styled from 'styled-components';
import * as base64 from '../calc/base64';
import rot13 from '../calc/rot13';
import { svgToReactNative } from '../calc/svg-react-native';
import { jsonStringToXml, xmlToJsonString } from '../calc/xml-json';
import * as store from '../util/store';
import * as strings from '../util/strings';
import { identity } from '../util/util';
import Section from './component/section';
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

const convertInfo: { [key: string]: ConverterInfo } = {
  js2xml: {
    encode: jsonStringToXml,
    decode: xmlToJsonString,
    name: 'JSON ⇆ XML',
  },
  svg2RN: {
    encode: svgToReactNative,
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

  private sourceStr = new Bacon.Bus<any, string>();
  private targetStr = new Bacon.Bus<any, string>();
  private selectedStr = new Bacon.Bus<any, string>();

  public componentDidMount() {
    const initialConverter = getConverterFromStore();
    this.sourceStr.onValue(v => this.setState({ source: v }));
    this.targetStr.onValue(v => this.setState({ target: v }));
    const selected = this.selectedStr
      .toProperty(initialConverter)
      .skipDuplicates();
    selected.onValue(v => {
      this.setState({ selected: v });
      setConverterToStore(v);
    });
    const encStr = this.sourceStr.combine(selected, (val, c) =>
      convertInfo[c].encode(val)
    );
    encStr.onValue(async v => this.setState({ target: await v }));
    const decStr = this.targetStr.combine(selected, (val, c) =>
      convertInfo[c].decode(val)
    );
    decStr.onValue(async v => this.setState({ source: await v }));
    Bacon.mergeAll(encStr.changes(), decStr.changes()).onValue(
      async v => this.props.onValue && this.props.onValue(await v)
    );
    this.selectedStr.push(initialConverter);
  }

  public render() {
    return (
      <Section
        title="Tekstimuunnokset"
        subtitle={convertInfo[this.state.selected].name}
      >
        <SelectField
          value={this.state.selected}
          onChange={(e, i, v) => this.selectedStr.push(v)}
          floatingLabelText="Konversio"
        >
          {converters.map(c => (
            <MenuItem value={c} key={c} primaryText={convertInfo[c].name} />
          ))}
        </SelectField>
        <FlexRow className="center">
          <FlexTextField
            floatingLabelText="Lähde"
            onChange={(e, v) => this.sourceStr.push(v)}
            fullWidth={true}
            multiLine={true}
            name="source"
            value={this.state.source}
          />
          <LeftPad>{this.state.source.length}</LeftPad>
        </FlexRow>
        <FlexRow className="center">
          <FlexTextField
            floatingLabelText="Kohde"
            onChange={(e, v) => this.targetStr.push(v)}
            fullWidth={true}
            multiLine={true}
            name="target"
            value={this.state.target}
          />
          <LeftPad>{this.state.target.length}</LeftPad>
        </FlexRow>
      </Section>
    );
  }
}

const FlexTextField = styled(TextField)`
  flex: 1;
`;
