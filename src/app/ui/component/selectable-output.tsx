import * as React from 'react'
import * as Bacon from 'baconjs'
import { identity } from '../../util/util'
import { toUpperCase } from '../../util/strings'
import Item from './item'
import Checkbox from 'material-ui/Checkbox'
import TextField from 'material-ui/TextField'
import FontIcon from 'material-ui/FontIcon'
import { red500 } from 'material-ui/styles/colors'

const styles: { [key: string]: React.CSSProperties } = {
    itemName: { marginTop: '1.7em' },
    itemValue: { alignItems: 'flex-start' },
}

interface SelectableOutputProps {
    readonly type: string
    readonly label: string
    readonly calculate: (v: string) => string
    readonly onValue: (v: any) => any
    readonly onSelect: React.FocusEventHandler<{}>
}

interface SelectableOutputState {
    value: string
}

type str2str = (x: string) => string

export default class SelectableOutput extends React.Component<SelectableOutputProps, SelectableOutputState> {

    private inputStream: Bacon.Bus<any, string>
    private ucStream: Bacon.Bus<any, boolean>

    public state: SelectableOutputState = {
        value: '',
    }

    public componentDidMount() {
        this.inputStream = new Bacon.Bus<any, string>()
        this.ucStream = new Bacon.Bus<any, boolean>()
        this.streamCalculation(this.inputStream, this.props.calculate, this.ucIfChecked(this.ucStream.toProperty(false)))
    }

    public setValue = (val: any) => {
        this.inputStream.push(val)
    }

    private streamCalculation = (inputStream: Bacon.Bus<any, string>, calculation: str2str, calcMapper: Bacon.Property<any, str2str>) => {
        const calculated: Bacon.Observable<any, string> = inputStream.map(calculation)
        const mapped = calcMapper ? calculated.combine(calcMapper, (val, m) => m(val)) as Bacon.Property<any, string> : calculated
        mapped.onValue(value => {
            this.setState({ value })
            if (this.props.onValue) { this.props.onValue(value) }
        })
    }

    private checkUpperCase = (event: React.MouseEvent<{}>, checked: boolean) => {
        this.ucStream.push(checked)
        if (this.props.onSelect) { this.props.onSelect(event as any) }
    }

    private ucIfChecked = (stream: Bacon.Property<any, Boolean>): Bacon.Property<any, str2str> => {
        return stream.map(checked => checked ? toUpperCase : identity)
    }

    public render() {
        const my = this
        return <Item name={<Checkbox name={my.props.type + '-upper-case'} label={
            <FontIcon className="material-icons" color={red500}>text_format</FontIcon>
        } onCheck={this.checkUpperCase} />} valueStyle={styles.itemValue} nameStyle={styles.itemName}>
            <TextField type="text" floatingLabelText={this.props.label} className="wide" value={this.state.value}
                fullWidth={true} read-only="read-only" name="output" onFocus={this.props.onSelect} />
        </Item>
    }
}
