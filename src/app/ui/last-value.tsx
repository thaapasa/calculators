import React from 'react'
import { ClipboardButton } from './component/tool-button'
import log from '../util/log'
import TextField from 'material-ui/TextField'
import { ToolbarGroup } from 'material-ui/Toolbar'

interface LastValueState {
    value: string
}

export default class LastValue extends React.Component<{}, LastValueState> {

    private valueField: TextField | null

    public state: LastValueState = {
        value: '',
    }

    public setValue = (v: string) => {
        this.setState({ value: v || '' })
    }

    private changeValue = (_: any, v: string) => this.setValue(v)

    private copyToClipboard = () => {
        try {
            if (this.valueField !== null) {
                this.valueField.select()
                document.execCommand('copy')
            }
        } catch (e) {
            log(`Could not copy: ${e}`)
        }
    }

    public render() {
        return <ToolbarGroup>
            <ClipboardButton title="Kopioi leikepöydälle" onClick={this.copyToClipboard} />
            <TextField value={this.state.value} ref={r => this.valueField = r} name="lastValue" fullWidth={true}
                hintText="Viimeisin arvo" onChange={this.changeValue} />
        </ToolbarGroup>
    }
}
