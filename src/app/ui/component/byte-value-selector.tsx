import * as React from "react"
import {isNumber,identity} from "../../util/util"
import {zeroPad} from "../../util/strings"
import {strToInt,intToHexStr,hexStrToInt} from "../../calc/numbers"
import Item from "../component/item"
import TextField from "material-ui/TextField"
import Slider from "material-ui/Slider"
import * as Bacon from "baconjs"

function isValidComp(value: number): value is number {
    return isNumber(value) && !isNaN(value) && value >= 0 && value <= 255
}

function toSliderValue(value: number): number {
    return isValidComp(value) ? value : 0
}

function toDecValue(value: number): string {
    return isValidComp(value) ? value.toString() : ''
}

function toHexComp(value: number): string {
    return isValidComp(value) ? zeroPad(intToHexStr(value), 2) : ''
}

function sliderToVal(value: number): number {
    return value
}

const styles = {
    component: {
        width: '3em',
        marginRight: '1em'
    },
    itemValue: {
        alignItems: 'flex-start'
    },
}

const types = ['parent', 'dec', 'hex', 'slider']

interface TypeInfoType<I> {
    readonly read: (x: I) => number;
    readonly write: (x: number) => I;
}

const typeInfo: { readonly [key: string]: TypeInfoType<any> } = {
    'parent': { read: identity, write: identity },
    'dec': { read: strToInt, write: toDecValue },
    'hex': { read: hexStrToInt, write: toHexComp },
    'slider': { read: sliderToVal, write: toSliderValue },
}

type NumericSelectorType = 'parent' | 'slider';
type StringSelectorType = 'dec' | 'hex';
type SelectorType = NumericSelectorType | StringSelectorType;

interface SelectorState {
    hex: string;
    dec: string;
    parent: number;
    slider: number;
}

interface SelectorProps {
    readonly value: any;
    readonly onValue?: (x: number) => any;
    readonly name: string;
    readonly floatingLabel?: string;
};

export default class ByteValueSelector extends React.Component<SelectorProps, SelectorState> {

    public state: SelectorState = {
        hex: '',
        dec: '',
        parent: 0,
        slider: 0,
    }
    private curSrcStr = new Bacon.Bus<any, SelectorType>()
    private inputStr: { [key: string]: Bacon.Bus<any, string | number> } = {}

    constructor(props: SelectorProps) {
        super(props)

        types.forEach(t => {
            this.state[t] = typeInfo[t].write(this.props.value)
            this.inputStr[t] = new Bacon.Bus<any, string | number>()
        })

        const newValStr = Bacon.mergeAll(types.map(t => this.inputStr[t].map(typeInfo[t].read)))
        Bacon.combineAsArray(newValStr, this.curSrcStr.toProperty('parent'))
            .onValue(x => this.showValue(x[0], x[1]))
    }

    public setValue = (value: number) => {
        this.pushNumberValue(value, 'parent')
    }

    private showValue = (val: number, src: string) => {
        let ns = {}
        types.filter(t => t != src).forEach(t => ns[t] = typeInfo[t].write(val))
        this.setState(ns)
        if (this.props.onValue && src != 'parent') this.props.onValue(val)
    }

    private pushStringValue = (value: string, src: StringSelectorType) => {
        this.setState({ [src]: value } as Pick<SelectorState, StringSelectorType>)
        this.curSrcStr.push(src)
        this.inputStr[src].push(value)
    }

    private pushNumberValue = (value: number, src: NumericSelectorType) => {
        this.setState({ [src]: value } as Pick<SelectorState, NumericSelectorType>)
        this.curSrcStr.push(src)
        this.inputStr[src].push(value)
    }

    render() {
        const content = <div style={{ display: "flex", padding: "0 0.75em" }}>
            <TextField floatingLabelText={this.props.floatingLabel} floatingLabelFixed={true} hintText="FF" style={styles.component} max-length="2" value={this.state.hex}
                       onChange={(e, t) => this.pushStringValue(t, 'hex')}/>
            <TextField floatingLabelText={this.props.floatingLabel} floatingLabelFixed={true} hintText="255" style={styles.component} type="number" max-length="3" value={this.state.dec}
                       onChange={(e, t) => this.pushStringValue(t, 'dec')} min={0} max={255}/>
            <Slider value={this.state.slider} style={{
                flexgrow: "1",
                width: "10em",
                height: "1em",
                paddingTop: this.props.floatingLabel ? "0.75em" : "inherit"
            }} max={255} min={0} step={1}
                    onChange={(e, v: number) => this.pushNumberValue(v, 'slider')}/>
        </div>

        return this.props.name ?
            <Item name={this.props.name} valueStyle={styles.itemValue}>{ content }</Item> :
            content
    }
}
