import { TextField } from '@material-ui/core';
import { Slider } from '@material-ui/lab';
import * as Bacon from 'baconjs';
import React from 'react';
import styled from 'styled-components';
import { hexStrToInt, intToHexStr, strToInt } from '../../calc/numbers';
import { zeroPad } from '../../util/strings';
import { identity, isNumber } from '../../util/util';
import Item from '../component/item';

function isValidComp(value: number): value is number {
  return isNumber(value) && !isNaN(value) && value >= 0 && value <= 255;
}

function toSliderValue(value: number): number {
  return isValidComp(value) ? value : 0;
}

function toDecValue(value: number): string {
  return isValidComp(value) ? value.toString() : '';
}

function toHexComp(value: number): string {
  return isValidComp(value) ? zeroPad(intToHexStr(value), 2) : '';
}

function sliderToVal(value: number): number {
  return value;
}

const ComponentField = styled(TextField)`
  width: 4em;
  margin-right: 1em;
` as typeof TextField;

const ByteSlider = styled(Slider)`
  &.high {
    margin.top: 12px;
  }
` as typeof Slider;

const types = ['parent', 'dec', 'hex', 'slider'];

interface TypeInfoType<I> {
  readonly read: (x: I) => number;
  readonly write: (x: number) => I;
}

const typeInfo: { readonly [key: string]: TypeInfoType<any> } = {
  parent: { read: identity, write: identity },
  dec: { read: strToInt, write: toDecValue },
  hex: { read: hexStrToInt, write: toHexComp },
  slider: { read: sliderToVal, write: toSliderValue },
};

type NumericSelectorType = 'parent' | 'slider';
type StringSelectorType = 'dec' | 'hex';
type SelectorType = NumericSelectorType | StringSelectorType;

interface SelectorState {
  hex: string;
  dec: string;
  parent: number;
  slider: number;
}

interface SelectorProps {
  readonly value: any;
  readonly onValue?: (x: number) => any;
  readonly name?: string;
  readonly floatingLabel?: string;
}

export default class ByteValueSelector extends React.Component<
  SelectorProps,
  SelectorState
> {
  public state: SelectorState = {
    hex: '',
    dec: '',
    parent: 0,
    slider: 0,
  };
  private curSrcStr = new Bacon.Bus<any, SelectorType>();
  private inputStr: { [key: string]: Bacon.Bus<any, string | number> } = {};

  constructor(props: SelectorProps) {
    super(props);

    types.forEach(t => {
      this.state[t] = typeInfo[t].write(this.props.value);
      this.inputStr[t] = new Bacon.Bus<any, string | number>();
    });

    const newValStr = Bacon.mergeAll(
      types.map(t => this.inputStr[t].map(typeInfo[t].read))
    );
    Bacon.combineAsArray(
      newValStr,
      this.curSrcStr.toProperty('parent')
    ).onValue(x => this.showValue(x[0], x[1]));
  }

  public setValue = (value: number) => {
    this.pushNumberValue(value, 'parent');
  };

  public render() {
    const content = (
      <Row>
        <ComponentField
          label={this.props.floatingLabel}
          placeholder="FF"
          inputProps={{ maxLength: 2 }}
          value={this.state.hex}
          onChange={e => this.pushStringValue(e.target.value, 'hex')}
        />
        <ComponentField
          label={this.props.floatingLabel}
          placeholder="255"
          type="number"
          inputProps={{ maxLength: 3 }}
          value={this.state.dec}
          onChange={e => this.pushStringValue(e.target.value, 'dec')}
        />
        <ByteSlider
          value={this.state.slider}
          max={255}
          min={0}
          className={this.props.floatingLabel ? 'high' : undefined}
          step={1}
          onChange={(e, v: number) => this.pushNumberValue(v, 'slider')}
        />
      </Row>
    );

    return this.props.name ? (
      <Item name={this.props.name} valueClassName="top">
        {content}
      </Item>
    ) : (
      content
    );
  }

  private showValue = (val: number, src: string) => {
    const ns = {};
    types.filter(t => t !== src).forEach(t => (ns[t] = typeInfo[t].write(val)));
    this.setState(ns);
    if (this.props.onValue && src !== 'parent') {
      this.props.onValue(val);
    }
  };

  private pushStringValue = (value: string, src: StringSelectorType) => {
    this.setState({ [src]: value } as Pick<SelectorState, StringSelectorType>);
    this.curSrcStr.push(src);
    this.inputStr[src].push(value);
  };

  private pushNumberValue = (value: number, src: NumericSelectorType) => {
    this.setState({ [src]: value } as Pick<SelectorState, NumericSelectorType>);
    this.curSrcStr.push(src);
    this.inputStr[src].push(value);
  };
}

const Row = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin: 12px;
`;
