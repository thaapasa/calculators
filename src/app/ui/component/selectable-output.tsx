import { Checkbox, TextField } from '@material-ui/core';
import { TextFormat } from '@material-ui/icons';
import * as Bacon from 'baconjs';
import React from 'react';
import styled from 'styled-components';
import { toUpperCase } from '../../util/strings';
import { identity } from '../../util/util';
import Item from './item';

const StyledItem = styled(Item)`
  & > .name {
    margin-top: 1.2em;
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

  private inputStream = new Bacon.Bus<string>();
  private ucStream = new Bacon.Bus<boolean>();

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
          <>
            <Checkbox
              name={this.props.type + '-upper-case'}
              onChange={this.checkUpperCase}
            />
            <TextFormat color="secondary" />
          </>
        }
        valueClassName="top"
      >
        <TextField
          type="text"
          label={this.props.label}
          placeholder={this.props.label}
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
    inputStream: Bacon.Bus<string>,
    calculation: str2str,
    calcMapper: Bacon.Property<str2str>
  ) => {
    const calculated: Bacon.Observable<string> = inputStream.map(calculation);
    const mapped = calcMapper
      ? (calculated.combine(calcMapper, (val, m) => m(val)) as Bacon.Property<
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
    stream: Bacon.Property<boolean>
  ): Bacon.Property<str2str> => {
    return stream.map(checked => (checked ? toUpperCase : identity));
  };
}
