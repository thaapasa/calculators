import { Add } from '@mui/icons-material';
import { Avatar, Chip, Divider, IconButton, Slider, styled, TextField } from '@mui/material';
import {
  hexToRGB,
  HSLKey,
  HSLMaxValue,
  hslToRGB,
  HSLValue,
  rgbToHex,
  rgbToHSL,
  rgbToRGBStr,
  RGBValue,
} from 'app/calc/colors';
import { numberify } from 'app/calc/numbers';
import { InputCombiner } from 'app/util/input-combiner';
import { StreamCombiner, StreamDefinition } from 'app/util/stream-combiner';
import { allFieldsOfType, mapObject } from 'app/util/util';
import * as R from 'ramda';
import React from 'react';

import * as store from '../util/store';
import ByteValueSelector from './component/byte-value-selector';
import { ColorBar } from './component/color-bar';
import Item from './component/item';
import { HalfSection } from './component/section';
import { publishSelectedValue } from './LastValue';

const ColorAvatar = styled(Avatar)`
  border: 1px solid #bbbbbb;
`;

const texts = {
  hex: 'Heksakoodi',
  rgb: 'RGB-arvo',
  h: 'H: Sävy',
  s: 'S: Väri',
  l: 'L: Valo',
};

const colors = {
  r: R.range(0, 255).map(r => ({ r, g: 0, b: 0 })),
  g: R.range(0, 255).map(g => ({ r: 0, g, b: 0 })),
  b: R.range(0, 255).map(b => ({ r: 0, g: 0, b })),
  h: R.range(0, 359).map(h =>
    hslToRGB({
      h: (h * HSLMaxValue) / 359,
      s: HSLMaxValue,
      l: HSLMaxValue / 2,
    }),
  ),
  s: (h: number, l: number) =>
    R.range(0, 255).map(s => hslToRGB({ h, s: (s * HSLMaxValue) / 255, l })),
  l: (h: number, s: number) =>
    R.range(0, 255).map(l => hslToRGB({ h, s, l: (l * HSLMaxValue) / 255 })),
};

interface ColorsProps {}

interface StoredColor {
  name: string;
  hex: string;
}

interface ColorState {
  rgb: string;
  r: string;
  g: string;
  b: string;
  hsl: string;
  h: number;
  s: number;
  l: number;
  hexString: string;
  rgbString: string;
  selected: 'hex' | 'rgb';
  colorList: StoredColor[];
}

const rgbCombiner = new InputCombiner({ r: 255, g: 255, b: 255 }, rgbToHex, hexToRGB);

const hslCombiner = new InputCombiner({ h: 255, s: 255, l: 255 }, numberify, numberify);

type SliderStreamType = StreamDefinition<string, RGBValue> | StreamDefinition<HSLValue, RGBValue>;

const types = allFieldsOfType<SliderStreamType>()({
  rgb: {
    read: hexToRGB,
    write: rgbToHex,
  },
  hexString: {
    read: hexToRGB,
    write: rgbToHex,
  },
  rgbString: {
    read: () => ({ r: 0, g: 0, b: 0 }),
    write: rgbToRGBStr,
  },
  hsl: {
    read: hslToRGB,
    write: rgbToHSL,
  },
});

const COLORS_STORE_KEY = 'calculators:colors';

function getColorsFromStore(): StoredColor[] {
  return store.getValue(COLORS_STORE_KEY) || [];
}

function storeColors(colors: StoredColor[]) {
  console.log('Storing colors', colors);
  store.putValue(COLORS_STORE_KEY, colors);
}

export class ColorsPage extends React.Component<ColorsProps, ColorState> {
  public state: ColorState = {
    r: '0',
    g: '0',
    b: '0',
    rgb: '',
    h: 0,
    s: 0,
    l: 0,
    hsl: '',
    hexString: '',
    rgbString: '',
    selected: 'hex',
    colorList: [],
  };

  private streams = new StreamCombiner(types);
  private disposers: Array<() => void> = [];

  constructor(props: ColorsProps) {
    super(props);
    this.disposers.push(rgbCombiner.combined.onValue(this.streams.inputs.rgb));
    this.disposers.push(hslCombiner.combined.onValue(this.streams.inputs.hsl));
    this.disposers.push(this.streams.bindOutputs(this, this.sendToParent));
    this.disposers.push(
      this.streams.output.filter(o => o.selected !== 'rgb').onValue(o => this.setRGB(o.output.rgb)),
    );
    this.disposers.push(
      this.streams.output.filter(o => o.selected !== 'hsl').onValue(o => this.setHSL(o.output.hsl)),
    );
  }

  public componentDidMount() {
    rgbCombiner.init(this);
    this.setState({ colorList: getColorsFromStore() });
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
        avatar={<ColorAvatar style={{ backgroundColor: this.validatedColor }}>&nbsp;</ColorAvatar>}
        action={
          <IconButton aria-label="settings" onClick={this.storeColor}>
            <Add />
          </IconButton>
        }
      >
        <ByteValueSelector
          floatingLabel="Red"
          setValue={this.state.r}
          onValue={rgbCombiner.inputs.r}
          topContent={<ColorBar colors={colors.r} />}
        />
        <ByteValueSelector
          floatingLabel="Green"
          setValue={this.state.g}
          onValue={rgbCombiner.inputs.g}
          topContent={<ColorBar colors={colors.g} />}
        />
        <ByteValueSelector
          floatingLabel="Blue"
          setValue={this.state.b}
          onValue={rgbCombiner.inputs.b}
          topContent={<ColorBar colors={colors.b} />}
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
            placeholder="rgb(1.0,1.0,1.0)"
            value={this.state.rgbString}
            inputProps={{ readOnly: true }}
            onFocus={() => this.select('rgb')}
          />
        </Item>
        <HSLSlider hsl="h" component={this} colorBar={colors.h} />
        <HSLSlider hsl="s" component={this} colorBar={colors.s(this.state.h, this.state.l)} />
        <HSLSlider hsl="l" component={this} colorBar={colors.l(this.state.h, this.state.s)} />
        {this.state.colorList.length > 0 ? (
          <>
            <Divider />
            {this.state.colorList.map((c, i) => this.renderColorChip(c, i))}
          </>
        ) : null}
      </HalfSection>
    );
  }

  private setAllFromHex(hex: string) {
    this.streams.inputs.hexString(hex);
  }

  private renderColorChip(color: StoredColor, index: number) {
    return (
      <PaddedChip
        key={index}
        avatar={<Avatar style={{ backgroundColor: color.hex }} />}
        label={color.name}
        onDelete={() => this.removeColor(index)}
        onClick={() => this.setAllFromHex(color.hex)}
      />
    );
  }

  get validatedColor(): string | undefined {
    const color = this.state.hexString;
    return color && color.length > 3 && color.startsWith('#') ? color : undefined;
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

  private storeColor = () => {
    const name = window.prompt('Anna värin nimi');
    if (name) {
      this.setState(
        s => ({
          ...s,
          colorList: [...s.colorList, { name, hex: s.hexString }],
        }),
        () => storeColors(this.state.colorList),
      );
    }
  };

  private removeColor = (index: number) => {
    this.setState(
      s => {
        const colorList = [...s.colorList];
        colorList.splice(index, 1);
        return { ...s, colorList };
      },
      () => storeColors(this.state.colorList),
    );
  };

  private setRGB = (rgbHex: string) => {
    rgbCombiner.setValue(rgbHex);
    this.setState(mapObject(String, hexToRGB(rgbHex)));
  };

  private setHSL = (hsl: HSLValue) => {
    hslCombiner.setValue(hsl);
    this.setState(hsl);
  };

  private sendToParent = () => {
    publishSelectedValue(this.selectedValue);
  };

  private select = (src: 'hex' | 'rgb') => {
    this.setState({ selected: src }, this.sendToParent);
  };
}

const HSLSlider = ({
  colorBar,
  hsl,
  component,
}: {
  hsl: HSLKey;
  colorBar: RGBValue[];
  component: React.Component<any, { [k in HSLKey]: number }>;
}) => (
  <HSLItem name={texts[hsl]}>
    <ColorBar colors={colorBar} />
    <Slider
      value={component.state[hsl]}
      min={0}
      max={HSLMaxValue}
      step={1}
      onChange={(_, v) => {
        hslCombiner.inputs[hsl](v);
        component.setState({ [hsl]: v } as any);
      }}
    />
  </HSLItem>
);

const HSLItem = styled(Item)`
  margin-top: 16px;
  & .value {
    flex-direction: column;
  }
`;

const PaddedChip = styled(Chip)`
  margin: 8px 4px;
`;
