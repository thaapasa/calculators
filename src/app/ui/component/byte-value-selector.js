import React from "react"
import {zeroPad,isNumber,identity} from "../../util/util"
import {strToInt,intToHexStr,hexStrToInt} from "../../calc/numbers"
import Item from "../component/item"
import TextField from "material-ui/TextField"
import Slider from "material-ui/Slider"
import * as Bacon from "baconjs"

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

const types = ["parent", "dec", "hex", "slider"]

const typeInfo = {
    "parent": { read: identity, write: identity },
    "dec": { read: strToInt, write: toDecValue },
    "hex": { read: hexStrToInt, write: toHexComp },
    "slider": { read: sliderToVal, write: toSliderValue }
}

export default class ByteValueSelector extends React.Component {

    constructor(props) {
        super(props)
        this.setValue = this.setValue.bind(this)
        this.pushValue = this.pushValue.bind(this)
        this.showValue = this.showValue.bind(this)
        this.state = {}
        this.curSrcStr = new Bacon.Bus()
        this.inputStr = {}

        types.forEach(t => {
            this.state[t] = typeInfo[t].write(this.props.value)
            this.inputStr[t] = new Bacon.Bus()
        })

        const newValStr = Bacon.mergeAll(types.map(t => this.inputStr[t].map(typeInfo[t].read)))
        newValStr.combine(this.curSrcStr, (v, s) => [v, s]).onValue(r => this.showValue(r[0], r[1]))
    }

    setValue(value) {
        this.pushValue(value, "parent")
    }

    showValue(val, src) {
        let ns = {}
        types.filter(t => t != src).forEach(t => ns[t] = typeInfo[t].write(val))
        this.setState(ns)
        if (this.props.onValue && src != "parent") this.props.onValue(val)
    }

    pushValue(value, src) {
        this.setState({ [src]: value })
        this.curSrcStr.push(src)
        this.inputStr[src].push(value)
    }

    render() {
        return <Item name={this.props.name}>
            <TextField hintText="FF" style={styles.component} maxLength="2" value={this.state.hex}
                       onChange={e => this.pushValue(e.target.value, "hex")}/>
            <TextField hintText="255" style={styles.component} type="number" maxLength="3" value={this.state.dec}
                       onChange={e => this.pushValue(e.target.value, "dec")}/>
            <Slider value={this.state.slider} style={styles.slider} max={1} min={0}
                    onChange={(e, v) => this.pushValue(v, "slider")}/>
        </Item>
    }
}
