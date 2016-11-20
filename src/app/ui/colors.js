import React from 'react'
import Section from "./component/section"
import {zeroPad,isNumber} from "../util/util"
import {strToInt,intToHexStr,hexStrToInt} from "../calc/numbers"
import Item from "./component/item"
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

function toRGBColor(r, g, b) {
    return (isNumber(r) && isNumber(g) && isNumber(b)) ? `rgb(${r}, ${g}, ${b})` : ""
}

function toHexColor(r, g, b) {
    return (isNumber(r) && isNumber(g) && isNumber(b)) ? `#${toHexComp(r)}${toHexComp(g)}${toHexComp(b)}` : ""
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

function hexToComponents(value) {
    let r = ""
    let g = ""
    let b = ""
    value.replace(/^#?([0-9A-Za-z]{2})([0-9A-Za-z]{2})([0-9A-Za-z]{2})$/, (m, rr, gg, bb) => {
        r = hexStrToInt(rr)
        g = hexStrToInt(gg)
        b = hexStrToInt(bb)
        return ""
    })

    return [r, g, b]
}

class ColorComponent extends React.Component {

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

    setValue(val, src) {
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

export default class Colors extends React.Component {

    constructor(props) {
        super(props)

        this.setComponent = this.setComponent.bind(this)
        this.setFromHex = this.setFromHex.bind(this)

        this.components = ["r", "g", "b"]
        this.state = {
            r: 255,
            g: 255,
            b: 255,
            hex: ""
        }
    }

    componentDidMount() {
        this.updateHex()
    }

    updateHex() {
        this.setState({ hex: this.asHex() })
    }

    updateComponents(r, g, b) {
        const values = {r: r, g: g, b: b}
        this.setState(values)
        this.components.forEach(c => this.refs[c].setValue(values[c], "parent"))
    }

    isSet() {
        return isNumber(this.state.r) && isNumber(this.state.g) && isNumber(this.state.b)
    }

    asRgb() {
        return toRGBColor(this.state.r, this.state.g, this.state.b)
    }

    asHex() {
        return toHexColor(this.state.r, this.state.g, this.state.b)
    }

    setComponent(c, val) {
        this.setState({[c]: val})
        this.updateHex()
    }

    setFromHex(value) {
        this.setState({hex: value})
        const comps = hexToComponents(value)
        this.updateComponents(comps[0], comps[1], comps[2])
    }

    render() {
        return <Section title="Väri">
            <Item name="Heksa">
                <TextField hintText="#FFFFFF" name="color-hex" value={this.state.hex} maxLength={7}
                           onChange={e => this.setFromHex(e.target.value)}/>
            </Item>
            <Item name="Desimaali">
                <TextField hintText="rgb(255,255,255)" name="color-rgb" value={this.asRgb()} readOnly/>
            </Item>
            <ColorComponent name="Red" value={this.state.r} onValue={v => this.setComponent("r", v)} ref="r"/>
            <ColorComponent name="Green" value={this.state.g} onValue={v => this.setComponent("g", v)} ref="g"/>
            <ColorComponent name="Blue" value={this.state.b} onValue={v => this.setComponent("b", v)} ref="b"/>
        </Section>

    }
}
