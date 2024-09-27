import { TextFormat } from '@mui/icons-material';
import { Checkbox, styled, TextField } from '@mui/material';
import * as Bacon from 'baconjs';
import React from 'react';

import { toUpperCase } from '../../util/strings';
import { identity, MaybePromise } from '../../util/util';
import { Item } from './Item';

const StyledItem = styled(Item)`
  & > .name {
    margin-top: 1.2em;
  }
`;

interface SelectableOutputProps {
  readonly type: string;
  readonly label: string;
  readonly calculate: (v: string) => MaybePromise<string>;
  readonly onValue: (v: any) => any;
  readonly onSelect: React.FocusEventHandler;
}

interface SelectableOutputState {
  value: string;
}

type str2str = (x: string) => MaybePromise<string>;

export class SelectableOutput extends React.Component<
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
      this.ucIfChecked(this.ucStream.toProperty(false)),
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
            <Checkbox name={this.props.type + '-upper-case'} onChange={this.checkUpperCase} />
            <TextFormat color="secondary" />
          </>
        }
        valueClassName="top"
      >
        <TextField
          variant="standard"
          label={this.props.label}
          type="text"
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
    calcMapper: Bacon.Property<str2str>,
  ) => {
    const calculated: Bacon.Observable<MaybePromise<string>> = inputStream.map(calculation);
    const mapped = calcMapper
      ? calculated.combine(calcMapper, async (val, m) => m(await val))
      : calculated;
    mapped.onValue(async v => {
      const value = await v;
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

  private ucIfChecked = (stream: Bacon.Property<boolean>): Bacon.Property<str2str> => {
    return stream.map(checked => (checked ? toUpperCase : identity));
  };
}
