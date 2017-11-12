import * as React from "react"
import {HalfSection} from "./component/section"
import Item from "./component/item"
import * as Bacon from "baconjs"
import * as numbers from "../calc/numbers"
import * as util from "../util/util"
import {zeroPad} from "../util/strings"
import TextField from "material-ui/TextField"

const texts = {
    "binary": "Binääri",
    "octal": "Oktaali",
    "decimal": "Desimaali",
    "hex": "Heksa",
    "char": "Merkki",
    "unicode": "Unicode",
    "html": "HTML-koodi"
}

const types = {
    "binary": { read: numbers.binaryStrToInt, write: numbers.intToBinaryStr, inputType: "number", maxLength: 50 },
    "octal": { read: numbers.octalStrToInt, write: numbers.intToOctalStr, inputType: "number", maxLength: 40 },
    "decimal": { read: numbers.strToInt, write: numbers.intToStr, inputType: "number", maxLength: 40 },
    "hex": { read: numbers.hexStrToInt, write: numbers.intToHexStr, inputType: "text", maxLength: 30 },
    "char": { read: numbers.charToInt, write: numbers.intToChar, inputType: "text", maxLength: 1 },
    "unicode": { read: util.identity, write: intToUnicodeStr, inputType: "text", maxLength: 6, readOnly: true },
    "html": { read: util.identity, write: intToHTMLCode, inputType: "text", maxLength: 10, readOnly: true }
}
const typeKeys = Object.keys(types)

function intToUnicodeStr(value: number): string {
    const str = numbers.intToHexStr(value)
    return typeof str == "string" ? "U+" + zeroPad(str, 4) : ""
}

function intToHTMLCode(value: number): string {
    const str = numbers.intToStr(value)
    return typeof str == "string" ? `&#${str};` : ""
}

interface NumbersProps {
    onValue: (x: any) => any
}

export default class Numbers extends React.Component<NumbersProps, any> {

    public state: any = { selected: "decimal", unicode: "" };

    private currentInput: any
    private inputStream: any
    private selectedSrcStr: any

    constructor(props: NumbersProps) {
        super(props)
        this.inputChanged = this.inputChanged.bind(this)
        this.selectSrc = this.selectSrc.bind(this)
        typeKeys.forEach(t => this.state[t] = "")
    }

    componentDidMount() {
        const emptyStream = Bacon.never()
        this.currentInput = new Bacon.Bus()
        const inputConverter = this.currentInput.map((t: any) => types[t].read)
        this.inputStream = new Bacon.Bus()
        const converted = this.inputStream
            .combine(inputConverter, (i: any, c: any) => c(i)).map((v: any) => (typeof(v) == "number" && !isNaN(v)) ? v : undefined)
        this.selectedSrcStr = new Bacon.Bus()
        typeKeys.forEach(t => {
            const typeInfo = types[t]
            const sourceIsThis = this.currentInput.map((name: any) => t == name)
            converted.combine(sourceIsThis, (c: any, i: any) => [c, i]).flatMapLatest((v: any) => v[1] ? emptyStream : converted)
                .map(typeInfo.write)
                .map((v: any) => util.isString(v) ? v : "")
                .onValue((v: any) => this.setState({[t]: v}))
            converted.onValue((v: any) => this.setState({ unicode: intToUnicodeStr(v), html: intToHTMLCode(v) }))
        })
        this.selectedSrcStr
            .map((t: any) => types[t].write)
            .combine(converted, (c: any, v: any) => c(v))
            .onValue((v: any) => this.props.onValue && this.props.onValue(v))
    }

    inputChanged(event: any) {
        const name = event.target.name
        const value = event.target.value
        this.setState({ [name]: value })
        this.currentInput.push(name)
        this.inputStream.push(value)
    }

    selectSrc(event: any) {
        const src = event.target.name
        this.setState({ selected: src })
        this.selectedSrcStr.push(event.target.name)
    }

    render() {
        return <HalfSection title="Numerot" subtitle={texts[this.state.selected]}>
            {
                typeKeys.map(t => <Item name={texts[t]} key={`${t}-item`}>
                    <TextField type={types[t].inputType}
                               name={t}
                               hintText={texts[t]}
                               max-length={types[t].maxLength}
                               value={this.state[t]}
                               onChange={this.inputChanged}
                               onFocus={this.selectSrc}
                               read-only={util.htmlBoolean(types[t].readOnly, 'readonly')}
                               key={t} />
                </Item>)
            }
        </HalfSection>

    }
}
