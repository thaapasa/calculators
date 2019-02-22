import { Avatar, TextField } from '@material-ui/core';
import { hexToRGB, rgbToHex, rgbToRGBStr, RGBValue } from 'app/calc/colors';
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
  r: string;
  g: string;
  b: string;
  rgb: string;
  hexString: string;
  rgbString: string;
  selected: 'hex' | 'rgb' | 'hsl';
}

const rgbCombiner = new InputCombiner(
  { r: 255, g: 255, b: 255 },
  rgbToHex,
  hexToRGB
);

const types = {
  rgb: {
    read: hexToRGB,
    write: rgbToHex,
  } as StreamDefinition<RGBValue>,
  hexString: {
    read: hexToRGB,
    write: rgbToHex,
  } as StreamDefinition<RGBValue>,
  rgbString: {
    read: () => ({ r: 0, g: 0, b: 0 }),
    write: rgbToRGBStr,
  } as StreamDefinition<RGBValue>,
};

export default class Colors extends React.Component<ColorsProps, ColorState> {
  public state: ColorState = {
    r: '0',
    g: '0',
    b: '0',
    rgb: '',
    hexString: '',
    rgbString: '',
    selected: 'hex',
  };

  private streams = new StreamCombiner(types);
  private disposers: Array<() => void> = [];

  constructor(props: ColorsProps) {
    super(props);
    this.disposers.push(rgbCombiner.combined.onValue(this.streams.inputs.rgb));
    this.disposers.push(rgbCombiner.bindOutputs(this));
    this.disposers.push(this.streams.bindOutputs(this));
  }

  public componentDidMount() {
    rgbCombiner.init();
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
          <ColorAvatar style={{ backgroundColor: this.validatedColor }}>
            &nbsp;
          </ColorAvatar>
        }
      >
        <ByteValueSelector
          floatingLabel="Red"
          value={this.state.r}
          onValue={rgbCombiner.inputs.r}
        />
        <ByteValueSelector
          floatingLabel="Green"
          value={this.state.g}
          onValue={rgbCombiner.inputs.g}
        />
        <ByteValueSelector
          floatingLabel="Blue"
          value={this.state.b}
          onValue={rgbCombiner.inputs.b}
        />
        <Item name="Heksa">
          <TextField
            placeholder="#FFFFFF"
            name="color-hex"
            value={this.state.hexString}
            max-length="7"
            onChange={this.streams.inputs.hexString}
            onFocus={() => this.select('hex')}
          />
        </Item>
        <Item name="RGB-arvo">
          <TextField
            placeholder="rgb(255,255,255)"
            name="color-rgb"
            value={this.state.rgbString}
            read-only="read-only"
            onFocus={() => this.select('rgb')}
          />
        </Item>
      </HalfSection>
    );
  }

  get validatedColor(): string | undefined {
    const color = this.state.hexString;
    return color && color.length > 3 && color.startsWith('#')
      ? color
      : undefined;
  }

  get selectedValue(): string {
    switch (this.state.selected) {
      case 'rgb':
        return this.state.rgbString;
      case 'hex':
      default:
        return this.state.hexString;
    }
  }

  private sendToParent = () => {
    if (this.props.onValue) {
      this.props.onValue(this.selectedValue);
    }
  };

  private select = (src: 'hex' | 'rgb') => {
    this.setState({ selected: src }, this.sendToParent);
  };
}
