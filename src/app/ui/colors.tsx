import { Avatar, TextField } from '@material-ui/core';
import {
  hexToRGB,
  hslToRGB,
  HSLValue,
  rgbToHex,
  rgbToHSL,
  rgbToRGBStr,
  RGBValue,
} from 'app/calc/colors';
import { InputCombiner } from 'app/util/input-combiner';
import { StreamCombiner, StreamDefinition } from 'app/util/stream-combiner';

import { numberify } from 'app/calc/numbers';
import { mapObject } from 'app/util/util';
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
  rgb: string;
  r: string;
  g: string;
  b: string;
  hsl: string;
  h: string;
  s: string;
  l: string;
  hexString: string;
  rgbString: string;
  selected: 'hex' | 'rgb';
}

const rgbCombiner = new InputCombiner(
  { r: 255, g: 255, b: 255 },
  rgbToHex,
  hexToRGB
);

const hslCombiner = new InputCombiner(
  { h: 255, s: 255, l: 255 },
  numberify,
  numberify
);

const types = {
  rgb: {
    read: hexToRGB,
    write: rgbToHex,
  } as StreamDefinition<string, RGBValue>,
  hexString: {
    read: hexToRGB,
    write: rgbToHex,
  } as StreamDefinition<string, RGBValue>,
  rgbString: {
    read: () => ({ r: 0, g: 0, b: 0 }),
    write: rgbToRGBStr,
  } as StreamDefinition<string, RGBValue>,
  hsl: {
    read: hslToRGB,
    write: rgbToHSL,
  } as StreamDefinition<HSLValue, RGBValue>,
};

export default class Colors extends React.Component<ColorsProps, ColorState> {
  public state: ColorState = {
    r: '0',
    g: '0',
    b: '0',
    rgb: '',
    h: '0',
    s: '0',
    l: '0',
    hsl: '',
    hexString: '',
    rgbString: '',
    selected: 'hex',
  };

  private streams = new StreamCombiner(types);
  private disposers: Array<() => void> = [];

  constructor(props: ColorsProps) {
    super(props);
    this.disposers.push(rgbCombiner.combined.onValue(this.streams.inputs.rgb));
    this.disposers.push(hslCombiner.combined.onValue(this.streams.inputs.hsl));
    this.disposers.push(this.streams.bindOutputs(this, this.sendToParent));
    this.disposers.push(
      this.streams.output
        .filter(o => o.selected !== 'rgb')
        .onValue(o => this.setRGB(o.output.rgb))
    );
    this.disposers.push(
      this.streams.output
        .filter(o => o.selected !== 'hsl')
        .onValue(o => this.setHSL(o.output.hsl))
    );
  }

  public componentDidMount() {
    rgbCombiner.init(this);
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
          setValue={this.state.r}
          onValue={rgbCombiner.inputs.r}
        />
        <ByteValueSelector
          floatingLabel="Green"
          setValue={this.state.g}
          onValue={rgbCombiner.inputs.g}
        />
        <ByteValueSelector
          floatingLabel="Blue"
          setValue={this.state.b}
          onValue={rgbCombiner.inputs.b}
        />
        <Item name="Heksa">
          <TextField
            placeholder="#FFFFFF"
            value={this.state.hexString}
            inputProps={{ maxLength: 7 }}
            onChange={this.streams.inputs.hexString}
            onFocus={() => this.select('hex')}
          />
        </Item>
        <Item name="RGB-arvo">
          <TextField
            placeholder="rgb(255,255,255)"
            value={this.state.rgbString}
            inputProps={{ readOnly: true }}
            onFocus={() => this.select('rgb')}
          />
        </Item>
        <ByteValueSelector
          floatingLabel="Hue"
          setValue={this.state.h}
          onValue={hslCombiner.inputs.h}
        />
        <ByteValueSelector
          floatingLabel="Sat"
          setValue={this.state.s}
          onValue={hslCombiner.inputs.s}
        />
        <ByteValueSelector
          floatingLabel="Lum"
          setValue={this.state.l}
          onValue={hslCombiner.inputs.l}
        />
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

  private setRGB = (rgbHex: string) => {
    rgbCombiner.setValue(rgbHex);
    this.setState(mapObject(String, hexToRGB(rgbHex)));
  };

  private setHSL = (hsl: HSLValue) => {
    hslCombiner.setValue(hsl);
    this.setState(mapObject(String, hsl));
  };

  private sendToParent = () => {
    if (this.props.onValue) {
      this.props.onValue(this.selectedValue);
    }
  };

  private select = (src: 'hex' | 'rgb') => {
    this.setState({ selected: src }, this.sendToParent);
  };
}
