import * as React from "react"
import {HalfSection} from "./component/section"
import {isNumber} from "../util/util"
import {zeroPad} from "../util/strings"
import {intToHexStr,hexStrToInt} from "../calc/numbers"
import Item from "./component/item"
import TextField from "material-ui/TextField"
import Avatar from "material-ui/Avatar"
import ByteValueSelector from "./component/byte-value-selector"

const styles = {
    avatar: {
        border: "1px solid #BBBBBB"
    }
}

function toRGBColor(r: number, g: number, b: number) {
    return (isNumber(r) && isNumber(g) && isNumber(b)) ? `rgb(${r}, ${g}, ${b})` : ""
}

function toHexColor(r: number, g: number, b: number) {
    return (isNumber(r) && isNumber(g) && isNumber(b)) ? `#${toHexComp(r)}${toHexComp(g)}${toHexComp(b)}` : ""
}

function isValidComp(value: number) {
    return isNumber(value) && !isNaN(value) &&  value >= 0 && value <= 255
}

function toHexComp(value: number) {
    return isValidComp(value) ? zeroPad(intToHexStr(value), 2) : ""
}

function validateHex(value: number) {
    return (value && value[0] == "#") ? value : "#" + value
}

function hexToComponents(value: string) {
    let r = 0
    let g = 0
    let b = 0
    value.replace(/^#?([0-9A-Za-z]{2})([0-9A-Za-z]{2})([0-9A-Za-z]{2})$/, (m, rr, gg, bb) => {
        r = hexStrToInt(rr)
        g = hexStrToInt(gg)
        b = hexStrToInt(bb)
        return ""
    })

    return [r, g, b]
}

const texts = {
    hex: "Heksakoodi",
    rgb: "RGB-arvo"
}

interface ColorsProps {
    onValue: (x: any) => any
}

export default class Colors extends React.Component<ColorsProps, any> {

    private components: any

    constructor(props: ColorsProps) {
        super(props)

        this.setComponent = this.setComponent.bind(this)
        this.setFromHex = this.setFromHex.bind(this)
        this.select = this.select.bind(this)

        this.components = ["r", "g", "b"]
        this.state = {
            r: 255,
            g: 255,
            b: 255,
            hex: "#FFFFFF",
            color: "#FFFFFF",
            selected: "hex"
        }
    }

    componentDidMount() {
        this.updateHex({ r: this.state.r, g: this.state.g, b: this.state.b })
    }

    updateHex(values: any) {
        const hexd = toHexColor(values.r, values.g, values.b)
        this.setState({ hex: hexd, color: hexd })
    }

    updateComponents(r: any, g: any, b: any) {
        const values = {r: r, g: g, b: b}
        this.setState(values)
        this.components.forEach((c: any) => (this.refs[c] as ByteValueSelector).setValue(values[c]))
    }

    asRgb() {
        return toRGBColor(this.state.r, this.state.g, this.state.b)
    }

    setComponent(c: any, val: any) {
        let values = { r: this.state.r, g: this.state.g, b: this.state.b }
        this.setState({[c]: val})
        values[c] = val
        this.updateHex(values)
        this.sendToParent()
    }

    setFromHex(value: any) {
        this.setState({hex: value, color: validateHex(value)})
        const comps = hexToComponents(value)
        this.updateComponents(comps[0], comps[1], comps[2])
        this.sendToParent()
    }

    sendToParent(src: any = undefined) {
        const val = (src || this.state.selected) == "hex" ? this.state.hex : this.asRgb()
        this.props.onValue && this.props.onValue(val)
    }

    select(src: any) {
        this.setState({ selected: src })
        this.sendToParent(src)
    }

    render() {
        return <HalfSection title="Väri" subtitle={texts[this.state.selected]}
                        avatar={<Avatar backgroundColor={this.state.color} style={styles.avatar}>&nbsp;</Avatar>}>
            <ByteValueSelector floatingLabel="Red" value={this.state.r} onValue={(v: any) => this.setComponent("r", v)} ref="r"/>
            <ByteValueSelector floatingLabel="Green" value={this.state.g} onValue={(v: any) => this.setComponent("g", v)} ref="g"/>
            <ByteValueSelector floatingLabel="Blue" value={this.state.b} onValue={(v: any) => this.setComponent("b", v)} ref="b"/>
            <Item name="Heksa">
                <TextField hintText="#FFFFFF" name="color-hex" value={this.state.hex} maxlength="7"
                           onChange={(e, t) => this.setFromHex(t)} onFocus={e => this.select("hex")}/>
            </Item>
            <Item name="RGB-arvo">
                <TextField hintText="rgb(255,255,255)" name="color-rgb" value={this.asRgb()} read-only
                           onFocus={e => this.select("rgb")}/>
            </Item>
        </HalfSection>

    }
}
