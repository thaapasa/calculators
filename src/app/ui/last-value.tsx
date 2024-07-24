import { styled, TextField } from '@mui/material';
import React from 'react';

import { ClipboardButton, copyRefToClipboard } from './component/tool-button';

interface LastValueState {
  value: string;
}

export default class LastValue extends React.Component<object, LastValueState> {
  public state: LastValueState = {
    value: '',
  };

  private valueField = React.createRef<HTMLInputElement>();

  public render() {
    return (
      <Container>
        <ClipboardButton
          title="Kopioi leikepöydälle"
          onClick={this.copyToClipboard}
          color="secondary"
        />
        <TextField
          value={this.state.value}
          inputRef={this.valueField}
          name="lastValue"
          fullWidth={true}
          placeholder="Viimeisin arvo"
          onChange={this.changeValue}
        />
      </Container>
    );
  }

  public setValue = (v: string) => {
    this.setState({ value: v || '' });
  };

  private changeValue = (e: any) => this.setValue(e.target.value);

  private copyToClipboard = () => copyRefToClipboard(this.valueField);
}

const Container = styled('div')`
  display: inline-flex;
  align-items: center;
`;
