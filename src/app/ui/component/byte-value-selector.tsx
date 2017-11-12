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
    return isValidComp(value) ? value.toString() : ""
}

function toHexComp(value: number): string {
    return isValidComp(value) ? zeroPad(intToHexStr(value), 2) : ""
}

function sliderToVal(value: number): number {
    return value
}

const styles = {
    component: {
        width: "3em",
        marginRight: "1em"
    },
    itemValue: {
        alignItems: "flex-start"
    }
}

const types = ["parent", "dec", "hex", "slider"]

const typeInfo = {
    "parent": { read: identity, write: identity },
    "dec": { read: strToInt, write: toDecValue },
    "hex": { read: hexStrToInt, write: toHexComp },
    "slider": { read: sliderToVal, write: toSliderValue }
}

interface SelectorState {
    hex: string;
    dec: string;
    parent: string;
    slider: number;
}

export default class ByteValueSelector extends React.Component<any, any> {

    public state: SelectorState = {
        hex: "",
        dec: "",
        parent: "",
        slider: 0,
    }
    private curSrcStr = new Bacon.Bus<string, any>()
    private inputStr: any = {}

    constructor(props: any) {
        super(props)
        this.setValue = this.setValue.bind(this)
        this.pushValue = this.pushValue.bind(this)
        this.showValue = this.showValue.bind(this)

        types.forEach(t => {
            this.state[t] = typeInfo[t].write(this.props.value)
            this.inputStr[t] = new Bacon.Bus()
        })

        const newValStr = Bacon.mergeAll(types.map(t => this.inputStr[t].map(typeInfo[t].read)))
        newValStr.combine(this.curSrcStr.toProperty(), (v, s) => [v, s]).onValue(r => this.showValue(r[0], r[1]))
    }

    setValue(value: string) {
        this.pushValue(value, "parent")
    }

    showValue(val: number, src: string) {
        let ns = {}
        types.filter(t => t != src).forEach(t => ns[t] = typeInfo[t].write(val))
        this.setState(ns)
        if (this.props.onValue && src != "parent") this.props.onValue(val)
    }

    pushValue(value: string, src: 'hex' | 'parent' | 'dec' | 'slider') {
        this.setState({ [src]: value })
        this.curSrcStr.push(src)
        this.inputStr[src].push(value)
    }

    pushSliderValue(value: number) {
        this.setState({ slider: value })
        this.curSrcStr.push('slider')
        this.inputStr.slider.push(value)
    }

    render() {
        const content = <div style={{ display: "flex", padding: "0 0.75em" }}>
            <TextField floatingLabelText={this.props.floatingLabel} floatingLabelFixed={true} hintText="FF" style={styles.component} maxlength="2" value={this.state.hex}
                       onChange={(e, t) => this.pushValue(t, "hex")}/>
            <TextField floatingLabelText={this.props.floatingLabel} floatingLabelFixed={true} hintText="255" style={styles.component} type="number" maxlength="3" value={this.state.dec}
                       onChange={(e, t) => this.pushValue(t, "dec")}/>
            <Slider value={this.state.slider} style={{
                flexgrow: "1",
                width: "10em",
                height: "1em",
                paddingTop: this.props.floatingLabel ? "0.75em" : "inherit"
            }} max={255} min={0} step={1}
                    onChange={(e, v) => this.pushValue(v.toString(), "slider")}/>
        </div>

        return this.props.name ?
            <Item name={this.props.name} valueStyle={styles.itemValue}>{ content }</Item> :
            content
    }
}
