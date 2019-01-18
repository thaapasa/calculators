import TextField from 'material-ui/TextField';
import { ToolbarGroup } from 'material-ui/Toolbar';
import React from 'react';
import log from '../util/log';
import { ClipboardButton } from './component/tool-button';

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

  private copyToClipboard = () => {
    try {
      if (this.valueField.current) {
        this.valueField.current.select();
        document.execCommand('copy');
      }
    } catch (e) {
      log(`Could not copy: ${e}`);
    }
  };
}
