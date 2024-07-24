import { TextField } from '@material-ui/core';
import * as Bacon from 'baconjs';
import React, { ChangeEvent } from 'react';
import styled from 'styled-components';

import * as util from '../../util/util';
import Item from './item';
import { GenerateButton } from './tool-button';

const CheckItem = styled(Item)`
  height: 48px;
`;

const CheckField = styled(TextField)`
  width: 1em;
`;

interface CheckProps {
  readonly width: string;
  readonly check?: (x: string) => string;
  readonly combine?: (a: string, b: string) => string;
  readonly name: string;
  readonly id: string | number;
  readonly 'max-length'?: string;
  readonly generate?: () => string;
  readonly onValue: (x: any) => any;
}

interface CheckState {
  input: string;
  value: string;
  checkValue: string;
}

export default class CheckValue extends React.Component<CheckProps, CheckState> {
  public state: CheckState = {
    input: '',
    value: '',
    checkValue: '',
  };

  private inputStyle = {
    width: '',
  };

  private inputStream: Bacon.Bus<string> = new Bacon.Bus<string>();

  public constructor(props: CheckProps) {
    super(props);
    if (this.props.width) {
      this.inputStyle.width = this.props.width;
    }
  }

  public componentDidMount() {
    this.streamToCheck(this.props.check, this.props.combine);
  }

  public render() {
    return (
      <CheckItem name={this.props.name} valueClassName="top">
        {this.props.generate ? (
          <GenerateButton onClick={this.generate} title="Luo uusi" />
        ) : (
          <GeneratePlaceholder />
        )}
        <TextField
          type="text"
          id={`${this.props.id}-input`}
          onChange={this.inputChanged}
          style={this.inputStyle}
          value={this.state.input}
          max-length={this.props['max-length']}
        />
        <CheckField
          id={`${this.props.id}-check`}
          className="letter"
          read-only="read-only"
          value={this.state.checkValue}
        />
        <input type="hidden" id={`${this.props.id}-value`} value={this.state.value} />
      </CheckItem>
    );
  }

  private generate = () => {
    if (!this.props.generate) {
      return;
    }
    const generated: string = this.props.generate().toString();
    this.setState({ input: generated });
    this.inputStream.push(generated);
  };

  private inputChanged = (e: ChangeEvent<HTMLInputElement>) => {
    this.setState({ input: e.target.value });
    this.inputStream.push(e.target.value);
  };

  private streamToCheck(
    calculateCheck?: (x: string) => string,
    combiner: (a: string, b: string) => string = util.combineWith(''),
  ) {
    if (calculateCheck) {
      const checkValue = this.inputStream.map(calculateCheck);
      checkValue.onValue(value => this.setState({ checkValue: value }));
      checkValue
        .combine(this.inputStream.toProperty(''), (chk, inp) => chk && combiner(inp, chk))
        .filter(util.nonEmpty)
        .onValue(this.updateValue);
    } else {
      this.inputStream.onValue(this.updateValue);
    }
  }

  private updateValue = (value: string) => {
    this.setState({ value });
    if (this.props.onValue) {
      this.props.onValue(value);
    }
  };
}

const GeneratePlaceholder = styled.div`
  width: 48px;
  height: 48px;
`;
