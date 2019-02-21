import { Avatar, TextField } from '@material-ui/core';
import {
  hexToComponents,
  hexToRGB,
  rgbToHex,
  RGBValue,
  toHexColor,
  toRGBColor,
  validateHex,
} from 'app/calc/colors';
import { InputCombiner } from 'app/util/input-combiner';
import { StreamCombiner, StreamDefinition } from 'app/util/stream-combiner';
import React from 'react';
import styled from 'styled-components';
import ByteValueSelector from './component/byte-value-selector';
import Item from './component/item';
import { HalfSection } from './component/section';

const ColorAvatar = styled(Avatar)`
  border: 1px solid #bbbbbb;
` as typeof Avatar;

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
  selected: 'hex' | 'rgb' | 'hsl';
}

const rgbCombiner = new InputCombiner({ r: 0, g: 0, b: 0 }, rgbToHex, hexToRGB);

const types = {
  rgb: {
    read: hexToRGB,
    write: rgbToHex,
  } as StreamDefinition<RGBValue>,
};

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
  private streams = new StreamCombiner(types);
  private disposers: Array<() => void> = [];

  constructor(props: ColorsProps) {
    super(props);
    this.disposers.push(rgbCombiner.combined.onValue(this.streams.inputs.rgb));
    this.disposers.push(rgbCombiner.bindOutputs(this));
  }

  public componentDidMount() {
    this.updateHex({ r: this.state.r, g: this.state.g, b: this.state.b });
  }

  public componentWillUnmount() {
    this.disposers.forEach(d => d());
  }

  public render() {
    return (
      <HalfSection
        title="Väri"
        subtitle={texts[this.state.selected]}
        image="/img/header-colors.jpg"
        avatar={
          <ColorAvatar style={{ backgroundColor: this.state.color }}>
            &nbsp;
          </ColorAvatar>
        }
      >
        <ByteValueSelector
          floatingLabel="Red"
          value={rgbCombiner.outputs.r}
          onValue={rgbCombiner.inputs.r}
        />
        <ByteValueSelector
          floatingLabel="Green"
          value={rgbCombiner.outputs.g}
          onValue={rgbCombiner.inputs.g}
        />
        <ByteValueSelector
          floatingLabel="Blue"
          value={rgbCombiner.outputs.b}
          onValue={rgbCombiner.inputs.b}
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
