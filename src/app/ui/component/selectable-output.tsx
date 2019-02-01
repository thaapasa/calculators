import { Checkbox, TextField } from '@material-ui/core';
import { TextFormat } from '@material-ui/icons';
import Bacon from 'baconjs';
import React from 'react';
import styled from 'styled-components';
import { toUpperCase } from '../../util/strings';
import { identity } from '../../util/util';
import Item from './item';

const StyledItem = styled(Item)`
  & > .name {
    margin-top: 1.7em;
  }
`;

interface SelectableOutputProps {
  readonly type: string;
  readonly label: string;
  readonly calculate: (v: string) => string;
  readonly onValue: (v: any) => any;
  readonly onSelect: React.FocusEventHandler<{}>;
}

interface SelectableOutputState {
  value: string;
}

type str2str = (x: string) => string;

export default class SelectableOutput extends React.Component<
  SelectableOutputProps,
  SelectableOutputState
> {
  public state: SelectableOutputState = {
    value: '',
  };

  private inputStream = new Bacon.Bus<any, string>();
  private ucStream = new Bacon.Bus<any, boolean>();

  public componentDidMount() {
    this.streamCalculation(
      this.inputStream,
      this.props.calculate,
      this.ucIfChecked(this.ucStream.toProperty(false))
    );
  }

  public setValue = (val: any) => {
    this.inputStream.push(val);
  };

  public render() {
    return (
      <StyledItem
        name={
          <Checkbox
            name={this.props.type + '-upper-case'}
            icon={<TextFormat />}
            onChange={this.checkUpperCase}
          />
        }
        valueClassName="top"
      >
        <TextField
          type="text"
          className="wide"
          value={this.state.value}
          fullWidth={true}
          read-only="read-only"
          name="output"
          onFocus={this.props.onSelect}
        />
      </StyledItem>
    );
  }

  private streamCalculation = (
    inputStream: Bacon.Bus<any, string>,
    calculation: str2str,
    calcMapper: Bacon.Property<any, str2str>
  ) => {
    const calculated: Bacon.Observable<any, string> = inputStream.map(
      calculation
    );
    const mapped = calcMapper
      ? (calculated.combine(calcMapper, (val, m) => m(val)) as Bacon.Property<
          any,
          string
        >)
      : calculated;
    mapped.onValue(value => {
      this.setState({ value });
      if (this.props.onValue) {
        this.props.onValue(value);
      }
    });
  };

  private checkUpperCase = (event: React.ChangeEvent, checked: boolean) => {
    this.ucStream.push(checked);
    if (this.props.onSelect) {
      this.props.onSelect(event as any);
    }
  };

  private ucIfChecked = (
    stream: Bacon.Property<any, boolean>
  ): Bacon.Property<any, str2str> => {
    return stream.map(checked => (checked ? toUpperCase : identity));
  };
}
