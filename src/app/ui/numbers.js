import React from "react"
import {HalfSection} from "./component/section"
import Item from "./component/item"
import * as Bacon from "baconjs"
import * as numbers from "../calc/numbers"
import * as util from "../util/util"
import TextField from "material-ui/TextField"

const texts = {
    "binary": "Binääri",
    "octal": "Oktaali",
    "decimal": "Desimaali",
    "hex": "Heksa"
}

export default class Numbers extends React.Component {

    constructor(props) {
        super(props)
        this.inputChanged = this.inputChanged.bind(this)
        this.selectSrc = this.selectSrc.bind(this)
        this.state = {
            binary: "",
            octal: "",
            decimal: "",
            hex: "",
            selected: "decimal"
        }
        this.types = {
            "binary-input": { read: numbers.binaryStrToInt, state: "binary", write: numbers.intToBinaryStr },
            "octal-input": { read: numbers.octalStrToInt, state: "octal", write: numbers.intToOctalStr },
            "decimal-input": { read: numbers.strToInt, state: "decimal", write: numbers.intToStr },
            "hex-input": { read: numbers.hexStrToInt, state: "hex", write: numbers.intToHexStr }
        }
    }

    componentDidMount() {
        const emptyStream = Bacon.never()
        this.currentInput = new Bacon.Bus()
        const inputConverter = this.currentInput.map((id) => this.types[id].read)
        this.inputStream = new Bacon.Bus()
        const converted = this.inputStream
            .combine(inputConverter, (i, c) => c(i)).map((v) => (typeof(v) == "number" && !isNaN(v)) ? v : undefined)
        this.selectedSrcStr = new Bacon.Bus()
        Object.keys(this.types).forEach((type) => {
            const typeInfo = this.types[type]
            const sourceIsThis = this.currentInput.map((id) => id == type)
            converted.combine(sourceIsThis, (c, i) => [c, i]).flatMapLatest((v) => v[1] ? emptyStream : converted)
                .map(typeInfo.write)
                .map((v) => util.isString(v) ? v : "")
                .onValue((v) => this.setState({[typeInfo.state]: v}))
        })
        this.selectedSrcStr
            .map(t => this.types[t].write)
            .combine(converted, (c, v) => c(v))
            .onValue(v => this.props.onValue && this.props.onValue(v))
    }

    inputChanged(event) {
        const id = event.target.id
        const value = event.target.value
        this.setState({ [this.types[id].state]: value })
        this.currentInput.push(id)
        this.inputStream.push(value)
    }

    selectSrc(event) {
        const src = this.types[event.target.id].state
        this.setState({ selected: src })
        this.selectedSrcStr.push(event.target.id)
    }

    render() {
        return <HalfSection title="Numerot" subtitle={texts[this.state.selected]}>
            <Item name="Binääri">
                <TextField type="number" id="binary-input" hintText={texts["binary"]} maxLength="40"
                           value={this.state.binary} onChange={this.inputChanged} onFocus={this.selectSrc} />
            </Item>
            <Item name="Oktaali">
                <TextField type="number" id="octal-input" hintText={texts["octal"]} maxLength="30"
                           value={this.state.octal} onChange={this.inputChanged} onFocus={this.selectSrc} />
            </Item>
            <Item name="Desimaali">
                <TextField type="number" id="decimal-input" hintText={texts["decimal"]} maxLength="30"
                           value={this.state.decimal} onChange={this.inputChanged} onFocus={this.selectSrc} />
            </Item>
            <Item name="Heksa">
                <TextField type="text" id="hex-input" hintText={texts["hex"]} maxLength="30"
                           value={this.state.hex} onChange={this.inputChanged} onFocus={this.selectSrc} />
            </Item>
        </HalfSection>

    }
}
