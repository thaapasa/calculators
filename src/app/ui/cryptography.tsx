import { TextField } from '@material-ui/core';
import * as Bacon from 'baconjs';
import crypto = require('crypto-browserify');
import React from 'react';
import Item from './component/item';
import Section from './component/section';
import SelectableOutput from './component/selectable-output';

interface CryptographyProps {
  readonly onValue: (x: any) => any;
}

interface CryptoType {
  readonly name: string;
  readonly calculate: (x: string) => string;
  readonly code: string;
  valueStream?: Bacon.Bus<string>;
}

export function hash(x: string, algorithm: string): string {
  return crypto
    .createHash(algorithm)
    .update(x)
    .digest('hex');
}

export default class Cryptography extends React.Component<
  CryptographyProps,
  any
> {
  private cryptoList: CryptoType[];
  private cryptos: { [key: string]: CryptoType };
  private default: string;
  private inputStream = new Bacon.Bus<string>();
  private cryptoSelectStream = new Bacon.Bus<string>();

  constructor(props: CryptographyProps) {
    super(props);
    this.cryptoList = [
      { name: 'MD5', calculate: x => hash(x, 'md5'), code: 'md5' },
      { name: 'SHA-1', calculate: x => hash(x, 'sha1'), code: 'sha1' },
      { name: 'SHA-256', calculate: x => hash(x, 'sha256'), code: 'sha256' },
      { name: 'SHA-512', calculate: x => hash(x, 'sha512'), code: 'sha512' },
    ];
    this.cryptos = {};
    this.cryptoList.forEach((c: any) => (this.cryptos[c.code] = c));
    this.default = this.cryptoList[0].code;

    this.state = { input: '', selected: this.default };
  }

  public componentDidMount() {
    this.inputStream.onValue(v =>
      this.cryptoList.forEach(c =>
        (this.refs[c.code] as SelectableOutput).setValue(v)
      )
    );
    this.cryptoList.forEach(l => {
      l.valueStream = new Bacon.Bus<string>();
      const prop = l.valueStream.toProperty('');
      prop
        .combine(
          this.cryptoSelectStream
            .toProperty(this.default)
            .map(c => c === l.code),
          (val, match) => [val, match]
        )
        .onValue(x => x[1] && this.props.onValue(x[0]));
    });
  }

  public render() {
    return (
      <Section
        title="Kryptografia"
        subtitle={this.cryptos[this.state.selected].name}
        image="/img/header-cryptography.jpg"
      >
        <Item name="Syöte">
          <TextField
            onChange={this.inputChanged}
            fullWidth={true}
            multiline={true}
            name="input"
          />
        </Item>
        {this.cryptoList.map(this.renderCrypto)}
      </Section>
    );
  }

  private inputChanged = (event: any) => {
    const inp = event.target.value;
    this.setState({ input: inp });
    this.inputStream.push(inp);
  };

  private selectCrypto(code: any) {
    this.setState({ selected: code });
    this.cryptoSelectStream.push(code);
  }

  private renderCrypto = (c: CryptoType) => {
    return (
      <SelectableOutput
        ref={c.code}
        type={c.code}
        label={c.name}
        calculate={c.calculate}
        onValue={v => c.valueStream && c.valueStream.push(v)}
        key={c.code}
        onSelect={() => this.selectCrypto(c.code)}
      />
    );
  };
}
