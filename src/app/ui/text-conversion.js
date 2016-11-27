import React from "react"
import Section from "./component/section"
import TextField from "material-ui/TextField"
import * as Bacon from "baconjs"
import SelectField from "material-ui/SelectField"
import MenuItem from "material-ui/MenuItem"
import * as base64 from "../calc/base64"
import rot13 from "../calc/rot13"
import * as strings from "../util/strings"

const convertInfo = {
    base64: { encode: base64.encode, decode: base64.decode, name: "Base64" },
    rot13: { encode: rot13, decode: rot13, name: "ROT-13" },
    hexStr: { encode: strings.toHexString, decode: strings.fromHexString, name: "Heksamerkkijono"}
}
const converters = Object.keys(convertInfo)

export default class TextConversion extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            source: "",
            target: "",
            selected: converters[0]
        }
    }

    componentDidMount() {
        this.streams = {
            source: new Bacon.Bus(),
            target: new Bacon.Bus(),
            selected: new Bacon.Bus()
        }
        this.streams.source.onValue(v => this.setState({ source: v }))
        this.streams.target.onValue(v => this.setState({ target: v }))
        const selected = this.streams.selected.skipDuplicates()
        selected.onValue(v => this.setState({ selected: v }))
        const encStr = this.streams.source.combine(selected, (val, c) => (convertInfo[c].encode)(val))
        encStr.onValue(v => this.setState({ target: v }))
        const decStr = this.streams.target.combine(selected, (val, c) => (convertInfo[c].decode)(val))
        decStr.onValue(v => this.setState({ source: v }))
        Bacon.mergeAll(encStr, decStr).onValue(v => this.props.onValue && this.props.onValue(v))
        this.streams.selected.push(converters[0])
    }

    render() {
        return <Section title="Tekstimuunnokset" subtitle={convertInfo[this.state.selected].name}>
            <TextField onChange={e => this.streams.source.push(e.target.value)} fullWidth={true} multiLine={true}
                       name="source" value={this.state.source} />
            <SelectField value={this.state.selected} onChange={(e, i, v) => this.streams.selected.push(v)} floatingLabelText="Konversio">
                { converters.map(c => <MenuItem value={c} key={c} primaryText={convertInfo[c].name} />) }
            </SelectField>
            <TextField onChange={e => this.streams.target.push(e.target.value)} fullWidth={true} multiLine={true}
                       name="target" value={this.state.target} />
        </Section>

    }
}
