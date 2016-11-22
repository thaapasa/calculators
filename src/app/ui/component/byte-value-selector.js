import React from 'react'
import {zeroPad,isNumber} from "../../util/util"
import {strToInt,intToHexStr,hexStrToInt} from "../../calc/numbers"
import Item from "../component/item"
import TextField from "material-ui/TextField"
import Slider from 'material-ui/Slider';
import * as Bacon from "baconjs"

const styles = {
    component: {
        width: "3em",
        marginRight: "1em"
    },
    slider: {
        width: "10em",
        height: "1em"
    }
}

function isValidComp(value) {
    return isNumber(value) && !isNaN(value) &&  value >= 0 && value <= 255
}

function toSliderValue(value) {
    return isValidComp(value) ? value / 255 : 0
}

function toDecValue(value) {
    return isValidComp(value) ? value : ""
}

function toHexComp(value) {
    return isValidComp(value) ? zeroPad(intToHexStr(value), 2) : ""
}

function sliderToVal(value) {
    return Math.round(value * 255)
}

export default class ByteValueSelector extends React.Component {

    constructor(props) {
        super(props)
        this.types = ["dec", "hex", "slider"]
        this.pushValue = this.pushValue.bind(this)
        this.typeInfo = {
            "dec": { read: strToInt, write: toDecValue },
            "hex": { read: hexStrToInt, write: toHexComp },
            "slider": { read: sliderToVal, write: toSliderValue }
        }
        this.state = {}
        this.types.forEach(t => this.state[t] = this.typeInfo[t].write(this.props.value))
    }

    setValue(val, src = "parent") {
        let ns = {}
        this.types.filter(t => t != src).forEach(t => ns[t] = this.typeInfo[t].write(val))
        this.setState(ns)
        if (this.props.onValue && this.types.includes(src)) this.props.onValue(val)
    }

    componentDidMount() {
        this.curSrcStr = new Bacon.Bus()
        this.types.forEach(t => this.typeInfo[t].stream = new Bacon.Bus())
        const newValStr = Bacon.mergeAll(this.types.map(t => this.typeInfo[t].stream.map(this.typeInfo[t].read)))
        newValStr.combine(this.curSrcStr, (v, s) => [v, s]).onValue(r => this.setValue(r[0], r[1]))
    }

    pushValue(src, value) {
        this.setState({ [src]: value })
        this.curSrcStr.push(src)
        this.typeInfo[src].stream.push(value)
    }

    render() {
        return <Item name={this.props.name}>
            <TextField hintText="FF" style={styles.component} maxLength="2" value={this.state.hex}
                       onChange={e => this.pushValue("hex", e.target.value)}/>
            <TextField hintText="255" style={styles.component} type="number" maxLength="3" value={this.state.dec}
                       onChange={e => this.pushValue("dec", e.target.value)}/>
            <Slider value={this.state.slider} style={styles.slider} max={1} min={0}
                    onChange={(e, v) => this.pushValue("slider", v)}/>
        </Item>
    }
}
