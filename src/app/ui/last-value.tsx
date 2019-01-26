import TextField from 'material-ui/TextField';
import { ToolbarGroup } from 'material-ui/Toolbar';
import React from 'react';
import { ClipboardButton, copyRefToClipboard } from './component/tool-button';

interface LastValueState {
  value: string;
}

export default class LastValue extends React.Component<{}, LastValueState> {
  public state: LastValueState = {
    value: '',
  };

  private valueField = React.createRef<TextField>();

  public render() {
    return (
      <ToolbarGroup>
        <ClipboardButton
          title="Kopioi leikepöydälle"
          onClick={this.copyToClipboard}
        />
        <TextField
          value={this.state.value}
          ref={this.valueField}
          name="lastValue"
          fullWidth={true}
          hintText="Viimeisin arvo"
          onChange={this.changeValue}
        />
      </ToolbarGroup>
    );
  }

  public setValue = (v: string) => {
    this.setState({ value: v || '' });
  };

  private changeValue = (_: any, v: string) => this.setValue(v);

  private copyToClipboard = () => copyRefToClipboard(this.valueField);
}
