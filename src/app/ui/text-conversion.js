import React from "react"
import Section from "./component/section"
import TextField from "material-ui/TextField"
import * as Bacon from "baconjs"
import SelectField from "material-ui/SelectField"
import MenuItem from "material-ui/MenuItem"
import * as base64 from "../calc/base64"

const converters = ["base64"]
const convertInfo = {
    base64: { encode: base64.encode, decode: base64.decode, name: "Base64" }
}

export default class TextConversion extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            source: "",
            target: "",
            selected: converters[0]
        }
        this.streams = {
            source: new Bacon.Bus(),
            target: new Bacon.Bus(),
            selected: new Bacon.Bus()
        }
        this.streams.source.onValue(v => this.setState({ source: v }))
        this.streams.target.onValue(v => this.setState({ target: v }))
        const encStr = this.streams.source.combine(this.streams.selected, (val, c) => (convertInfo[c].encode)(val))
        encStr.onValue(v => this.setState({ target: v }))
        const decStr = this.streams.target.combine(this.streams.selected, (val, c) => (convertInfo[c].decode)(val))
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
