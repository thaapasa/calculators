import { TextField } from '@material-ui/core';
import React from 'react';
import { ClipboardButton, copyRefToClipboard } from './component/tool-button';

interface LastValueState {
  value: string;
}

export default class LastValue extends React.Component<{}, LastValueState> {
  public state: LastValueState = {
    value: '',
  };

  private valueField = React.createRef<HTMLInputElement>();

  public render() {
    return (
      <>
        <ClipboardButton
          title="Kopioi leikepöydälle"
          onClick={this.copyToClipboard}
        />
        <TextField
          value={this.state.value}
          inputRef={this.valueField}
          name="lastValue"
          fullWidth={true}
          placeholder="Viimeisin arvo"
          onChange={this.changeValue}
        />
      </>
    );
  }

  public setValue = (v: string) => {
    this.setState({ value: v || '' });
  };

  private changeValue = (e: any) => this.setValue(e.target.value);

  private copyToClipboard = () => copyRefToClipboard(this.valueField);
}
