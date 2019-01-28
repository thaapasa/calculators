import { Avatar, TextField } from '@material-ui/core';
import React from 'react';
import { hexStrToInt, intToHexStr } from '../calc/numbers';
import { zeroPad } from '../util/strings';
import { isNumber } from '../util/util';
import ByteValueSelector from './component/byte-value-selector';
import Item from './component/item';
import { HalfSection } from './component/section';

const styles: { [key: string]: React.CSSProperties } = {
  avatar: {
    border: '1px solid #BBBBBB',
  },
};

function toRGBColor(r: number, g: number, b: number): string {
  return isNumber(r) && isNumber(g) && isNumber(b)
    ? `rgb(${r}, ${g}, ${b})`
    : '';
}

function toHexColor(r: number, g: number, b: number): string {
  return isNumber(r) && isNumber(g) && isNumber(b)
    ? `#${toHexComp(r)}${toHexComp(g)}${toHexComp(b)}`
    : '';
}

function isValidComp(value: any): value is number {
  return isNumber(value) && !isNaN(value) && value >= 0 && value <= 255;
}

function toHexComp(value: number): string {
  return isValidComp(value) ? zeroPad(intToHexStr(value), 2) : '';
}

function validateHex(value: number): string {
  return value && value[0] === '#' ? value.toString() : '#' + value;
}

function hexToComponents(value: string): [number, number, number] {
  let r = 0;
  let g = 0;
  let b = 0;
  const l = value.length <= 4 ? 1 : 2;
  const re = new RegExp(
    `^#?([0-9A-Za-z]{${l}})([0-9A-Za-z]{${l}})([0-9A-Za-z]{${l}})$`
  );

  value.replace(re, (m, hr, hg, hb) => {
    r = (r = hexStrToInt(hr)) + (l === 1 ? r << 4 : 0);
    g = (g = hexStrToInt(hg)) + (l === 1 ? g << 4 : 0);
    b = (b = hexStrToInt(hb)) + (l === 1 ? b << 4 : 0);
    return '';
  });

  return [r, g, b];
}

type Component = 'r' | 'g' | 'b';

const texts = {
  hex: 'Heksakoodi',
  rgb: 'RGB-arvo',
};

interface ColorsProps {
  onValue: (x: string) => void;
}

interface ColorState {
  r: number;
  g: number;
  b: number;
  hex: string;
  color: string;
  selected: 'hex' | 'rgb';
}

export default class Colors extends React.Component<ColorsProps, ColorState> {
  public state: ColorState = {
    r: 255,
    g: 255,
    b: 255,
    hex: '#FFFFFF',
    color: '#FFFFFF',
    selected: 'hex',
  };

  private components = ['r', 'g', 'b'];

  public componentDidMount() {
    this.updateHex({ r: this.state.r, g: this.state.g, b: this.state.b });
  }

  public render() {
    return (
      <HalfSection
        title="Väri"
        subtitle={texts[this.state.selected]}
        avatar={
          <Avatar color={this.state.color} style={styles.avatar}>
            &nbsp;
          </Avatar>
        }
      >
        <ByteValueSelector
          floatingLabel="Red"
          value={this.state.r}
          onValue={v => this.setComponent('r', v)}
          ref="r"
        />
        <ByteValueSelector
          floatingLabel="Green"
          value={this.state.g}
          onValue={v => this.setComponent('g', v)}
          ref="g"
        />
        <ByteValueSelector
          floatingLabel="Blue"
          value={this.state.b}
          onValue={v => this.setComponent('b', v)}
          ref="b"
        />
        <Item name="Heksa">
          <TextField
            placeholder="#FFFFFF"
            name="color-hex"
            value={this.state.hex}
            max-length="7"
            onChange={e => this.setFromHex(e.target.value)}
            onFocus={_ => this.select('hex')}
          />
        </Item>
        <Item name="RGB-arvo">
          <TextField
            placeholder="rgb(255,255,255)"
            name="color-rgb"
            value={toRGBColor(this.state.r, this.state.g, this.state.b)}
            read-only="read-only"
            onFocus={_ => this.select('rgb')}
          />
        </Item>
      </HalfSection>
    );
  }

  private updateHex(values: any): string {
    const hexd = toHexColor(values.r, values.g, values.b);
    this.setState({ hex: hexd, color: hexd }, this.sendToParent);
    return hexd;
  }

  private updateComponents = (r: any, g: any, b: any) => {
    const values = { r, g, b };
    this.setState(values, this.sendToParent);
    this.components.forEach((c: any) =>
      (this.refs[c] as ByteValueSelector).setValue(values[c])
    );
  };

  private setComponent = (c: Component, val: number) => {
    const values = { r: this.state.r, g: this.state.g, b: this.state.b };
    this.setState({ [c]: val } as any);
    values[c] = val;
    this.updateHex(values);
  };

  private setFromHex = (value: any) => {
    this.setState({ hex: value, color: validateHex(value) });
    const c = hexToComponents(value);
    const [r, g, b] = c;
    this.updateComponents(r, g, b);
  };

  private getRGBColor() {
    const { r, g, b } = this.state;
    return toRGBColor(r, g, b);
  }

  private sendToParent = () => {
    const val =
      this.state.selected === 'rgb' ? this.getRGBColor() : this.state.hex;
    if (this.props.onValue) {
      this.props.onValue(val);
    }
  };

  private select = (src: 'hex' | 'rgb') => {
    this.setState({ selected: src }, this.sendToParent);
  };
}
