import { Input } from '@mui/material';
import { MaybePromise } from 'app/util/util';
import * as Bacon from 'baconjs';
import md5 from 'md5';
import React, { RefObject } from 'react';

import { Item } from './component/Item';
import Section from './component/Section';
import { SelectableOutput } from './component/SelectableOutput';
import { publishSelectedValue } from './LastValue';

interface CryptographyProps {}

interface CryptoType {
  readonly name: string;
  readonly calculate: (x: string) => MaybePromise<string>;
  readonly code: string;
  valueStream?: Bacon.Bus<string>;
}

export async function hash(x: string, digest: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(x); // Encode message as (utf-8) Uint8Array
  const hashBuffer = await crypto.subtle.digest(digest, msgBuffer); // Calculate SHA-256 digest
  const hashArray = Array.from(new Uint8Array(hashBuffer)); // Convert buffer to byte array
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join(''); // Convert bytes to hex string
  return hashHex;
}

const cryptoList: CryptoType[] = [
  { name: 'MD5', calculate: x => md5(x), code: 'md5' },
  { name: 'SHA-1', calculate: x => hash(x, 'SHA-1'), code: 'sha1' },
  { name: 'SHA-256', calculate: x => hash(x, 'SHA-256'), code: 'sha256' },
  { name: 'SHA-512', calculate: x => hash(x, 'SHA-512'), code: 'sha512' },
];

export class CryptographyPage extends React.Component<CryptographyProps, any> {
  private cryptos: { [key: string]: CryptoType };
  private default: string;
  private inputStream = new Bacon.Bus<string>();
  private cryptoSelectStream = new Bacon.Bus<string>();
  private refsObjects: Record<string, RefObject<SelectableOutput>>;

  constructor(props: CryptographyProps) {
    super(props);
    this.cryptos = {};
    cryptoList.forEach((c: any) => (this.cryptos[c.code] = c));
    this.default = cryptoList[0].code;

    this.state = { input: '', selected: this.default };
    this.refsObjects = Object.fromEntries(cryptoList.map(c => [c.code, React.createRef()]));
  }

  public componentDidMount() {
    this.inputStream.onValue(v =>
      cryptoList.forEach(c => this.refsObjects[c.code]?.current?.setValue(v)),
    );
    cryptoList.forEach(l => {
      l.valueStream = new Bacon.Bus<string>();
      const prop = l.valueStream.toProperty('');
      prop
        .combine(
          this.cryptoSelectStream.toProperty(this.default).map(c => c === l.code),
          (val, match) => [val, match],
        )
        .onValue(x => x[1] && publishSelectedValue(String(x[0])));
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
          <Input onChange={this.inputChanged} fullWidth={true} multiline={true} name="input" />
        </Item>
        {cryptoList.map(this.renderCrypto)}
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
        ref={this.refsObjects[c.code]}
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
