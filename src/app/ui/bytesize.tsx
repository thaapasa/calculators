import Bacon from 'baconjs';
import TextField from 'material-ui/TextField';
import React, { CSSProperties } from 'react';
import styled from 'styled-components';
import { isString, pairsToObject } from '../util/util';
import Item from './component/item';
import { HalfSection } from './component/section';
import { Flex, FlexRow } from './layout/elements';

interface TypeInfo {
  readonly read: (x: string) => number;
  readonly write: (x: number) => string;
  readonly name: string;
  readonly hint: string;
  readonly unit: string;
}

const KIBI = 1024;
const MEBI = KIBI * KIBI;
const GIBI = MEBI * KIBI;
const TEBI = GIBI * KIBI;

const KILO = 1000;
const MEGA = KILO * KILO;
const GIGA = MEGA * KILO;
const TERA = GIGA * KILO;

const converter = (
  name: string,
  unit: string,
  ratio: number,
  decimals: number = 3
): TypeInfo => ({
  name,
  hint: unit,
  unit,
  read: x => Number(x) * ratio,
  write: x => (x / ratio).toFixed(decimals),
});

const types = {
  byte: converter('Tavua', 'B', 1, 0),
  kibi: converter('Kibitavua', 'KiB', KIBI),
  mebi: converter('Mebitavua', 'MiB', MEBI),
  gibi: converter('Gibitavua', 'GiB', GIBI),
  tebi: converter('Tebitavua', 'TiB', TEBI),
  kilo: converter('Kilotavua', 'Kt', KILO),
  mega: converter('Megatavua', 'Mt', MEGA),
  giga: converter('Gigatavua', 'Gt', GIGA),
  tera: converter('Teratavua', 'Tt', TERA),
};
const typeKeys = Object.keys(types);

const leftColumn: string[] = ['kibi', 'mebi', 'gibi', 'tebi'];
const rightColumn: string[] = ['kilo', 'mega', 'giga', 'tera'];

interface ByteSizeProps {
  onValue: (x: any) => any;
}

interface ByteSizeState {
  selected: string;
  values: Record<string, string>;
}

const emptyStream = Bacon.never();

export default class ByteSizes extends React.Component<
  ByteSizeProps,
  ByteSizeState
> {
  public state: ByteSizeState = {
    selected: 'byte',
    values: pairsToObject(
      Object.keys(types).map<[string, string]>(t => [t, ''])
    ),
  };

  private currentInput = new Bacon.Bus<any, string>();
  private inputStream = new Bacon.Bus<any, string>();
  private selectedSrcStr = new Bacon.Bus<any, string>();

  public componentDidMount() {
    this.currentInput = new Bacon.Bus();
    const inputConverter = this.currentInput
      .map(t => types[t].read)
      .toProperty(Number);
    const converted = this.inputStream
      .combine(inputConverter, (i, c) => c(i))
      .map(v => (typeof v === 'number' && !isNaN(v) ? v : undefined));
    typeKeys.forEach(t => {
      const typeInfo = types[t];
      const sourceIsThis = this.currentInput
        .map(name => t === name)
        .toProperty(false);
      converted
        .combine(sourceIsThis, (c, i) => [c, i])
        .flatMapLatest(v => (v[1] ? emptyStream : converted))
        .map(typeInfo.write)
        .map(v => (isString(v) ? v : ''))
        .onValue(v => this.mergeValues({ [t]: v }));
    });
    this.selectedSrcStr
      .toProperty('byte')
      .map(t => types[t].write)
      .combine(converted, (c, v) => v && c(v))
      .onValue(v => v && this.props.onValue && this.props.onValue(v));
  }

  public render() {
    return (
      <HalfSection title="Tavukoot" subtitle={types[this.state.selected].name}>
        <Item name="Tavua">
          <Editor
            type="byte"
            value={this.state.values.byte}
            onChange={this.inputChanged}
            onFocus={this.selectSrc}
          />
        </Item>
        <FlexRow>
          <Flex>
            {leftColumn.map(t => (
              <Editor
                key={t}
                type={t}
                value={this.state.values[t]}
                onChange={this.inputChanged}
                onFocus={this.selectSrc}
              />
            ))}
          </Flex>
          <Flex>
            {rightColumn.map(t => (
              <Editor
                key={t}
                type={t}
                value={this.state.values[t]}
                onChange={this.inputChanged}
                onFocus={this.selectSrc}
              />
            ))}
          </Flex>
        </FlexRow>
      </HalfSection>
    );
  }

  private mergeValues = (x: any) =>
    this.setState(s => ({ values: { ...s.values, ...x } }));

  private inputChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
    const name = event.target.name;
    const value = event.target.value;
    this.mergeValues({ [name]: value });
    this.currentInput.push(name);
    this.inputStream.push(value);
  };

  private selectSrc = (event: React.FocusEvent<HTMLInputElement>) => {
    const src = event.target.name;
    this.setState({ selected: src });
    this.selectedSrcStr.push(event.target.name);
  };
}

const Editor = (p: {
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFocus: (e: React.FocusEvent<HTMLInputElement>) => void;
}) => {
  const info = types[p.type];
  return (
    <FlexRow>
      <TextField
        style={TextFieldStyle}
        name={p.type}
        type="number"
        hintText={info.name}
        value={p.value}
        onChange={p.onChange}
        inputStyle={TextStyle}
        onFocus={p.onFocus}
      />
      <Unit>{info.unit}</Unit>
    </FlexRow>
  );
};

const TextStyle: CSSProperties = {
  textAlign: 'right',
};

const TextFieldStyle: CSSProperties = {
  flex: 1,
  width: 100,
};

const Unit = styled.div`
  width: 25px;
  text-align: right;
  padding-top: 14px;
  padding-right: 8px;
  margin-left: 8px;
`;
