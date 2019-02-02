import { TextField } from '@material-ui/core';
import Bacon from 'baconjs';
import React from 'react';
import styled from 'styled-components';
import * as numbers from '../calc/numbers';
import { zeroPad } from '../util/strings';
import * as util from '../util/util';
import Item from './component/item';
import { HalfSection } from './component/section';

const texts = {
  binary: 'Binääri',
  octal: 'Oktaali',
  decimal: 'Desimaali',
  hex: 'Heksa',
  char: 'Merkki',
  unicode: 'Unicode',
  html: 'HTML-koodi',
};

interface TypeInfo {
  readonly read: (x: string) => number;
  readonly write: (x: number) => string;
  readonly inputType: 'number' | 'text';
  readonly maxLength: number;
  readonly readOnly?: boolean;
}

function readZero(_: string): number {
  return 0;
}

const types: Record<string, TypeInfo> = {
  binary: {
    read: numbers.binaryStrToInt,
    write: numbers.intToBinaryStr,
    inputType: 'number',
    maxLength: 50,
  },
  octal: {
    read: numbers.octalStrToInt,
    write: numbers.intToOctalStr,
    inputType: 'number',
    maxLength: 40,
  },
  decimal: {
    read: numbers.strToInt,
    write: numbers.intToStr,
    inputType: 'number',
    maxLength: 40,
  },
  hex: {
    read: numbers.hexStrToInt,
    write: numbers.intToHexStr,
    inputType: 'text',
    maxLength: 30,
  },
  char: {
    read: numbers.charToInt,
    write: numbers.intToChar,
    inputType: 'text',
    maxLength: 1,
  },
  unicode: {
    read: readZero,
    write: intToUnicodeStr,
    inputType: 'text',
    maxLength: 6,
    readOnly: true,
  },
  html: {
    read: readZero,
    write: intToHTMLCode,
    inputType: 'text',
    maxLength: 10,
    readOnly: true,
  },
};

const typeKeys = Object.keys(types);

function intToUnicodeStr(value: number): string {
  const str = numbers.intToHexStr(value);
  return typeof str === 'string' ? 'U+' + zeroPad(str, 4) : '';
}

function intToHTMLCode(value: number): string {
  const str = numbers.intToStr(value);
  return typeof str === 'string' ? `&#${str};` : '';
}

interface NumbersProps {
  onValue: (x: any) => any;
}

interface NumbersState {
  selected: string;
  unicode: string;
  values: Record<string, string>;
}

const emptyStream = Bacon.never<any, number>();

export default class Numbers extends React.Component<
  NumbersProps,
  NumbersState
> {
  public state: NumbersState = {
    selected: 'decimal',
    unicode: '',
    values: util.pairsToObject(
      Object.keys(types).map<[string, string]>(t => [t, ''])
    ),
  };

  private currentInput = new Bacon.Bus<any, string>();
  private inputStream = new Bacon.Bus<any, string>();
  private selectedSrcStr = new Bacon.Bus<any, string>();

  constructor(props: NumbersProps) {
    super(props);
    this.initializeStreams();
  }

  public render() {
    return (
      <HalfSection
        title="Numerot"
        subtitle={texts[this.state.selected]}
        image="/img/header-numbers.jpg"
      >
        {typeKeys.map(t => (
          <NumberItem name={texts[t]} key={`${t}-item`}>
            <TextField
              type={types[t].inputType}
              name={t}
              placeholder={texts[t]}
              value={this.state.values[t]}
              onChange={this.inputChanged}
              onFocus={this.selectSrc}
              inputProps={{
                maxLength: types[t].maxLength,
                readOnly: types[t].readOnly || false,
              }}
              key={t}
            />
          </NumberItem>
        ))}
      </HalfSection>
    );
  }

  private initializeStreams() {
    const inputConverter = this.currentInput
      .map(t => types[t].read)
      .toProperty(types.decimal.read);

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
        .map(v => typeInfo.write(v || 0))
        .map(v => (util.isString(v) ? v : ''))
        .onValue(v => this.mergeValues({ [t]: v }));
      converted.onValue(v =>
        this.mergeValues({
          unicode: intToUnicodeStr(v || 0),
          html: intToHTMLCode(v || 0),
        })
      );
    });
    this.selectedSrcStr
      .map(t => types[t].write)
      .combine(converted, (c, v) => c(v || 0))
      .onValue(v => this.props.onValue && this.props.onValue(v));
  }

  private mergeValues = (x: Record<string, string>) =>
    this.setState(s => ({ values: { ...s.values, ...x } }));

  private inputChanged = (event: any) => {
    const name = event.target.name;
    const value = event.target.value;
    this.mergeValues({ [name]: value });
    this.currentInput.push(name);
    this.inputStream.push(value);
  };

  private selectSrc = (event: any) => {
    const src = event.target.name;
    this.setState({ selected: src });
    this.selectedSrcStr.push(event.target.name);
  };
}

const NumberItem = styled(Item)`
  margin-top: 8px;
`;
