import * as React from 'react'
import Section from './component/section'
import TextField from 'material-ui/TextField'
import * as Bacon from 'baconjs'
import SelectField from 'material-ui/SelectField'
import MenuItem from 'material-ui/MenuItem'
import * as base64 from '../calc/base64'
import rot13 from '../calc/rot13'
import * as strings from '../util/strings'

interface ConverterInfo {
    readonly encode: (x: string) => string
    readonly decode: (x: string) => string
    readonly name: string
}

const convertInfo: { [key: string]: ConverterInfo } = {
    base64: { encode: base64.encode, decode: base64.decode, name: 'Base64' },
    rot13: { encode: rot13, decode: rot13, name: 'ROT-13' },
    hexStr: { encode: strings.toHexString, decode: strings.fromHexString, name: 'Heksamerkkijono' },
    urlEncode: { encode: x => encodeURIComponent(x), decode: x => decodeURIComponent(x), name: 'URL encode' },
}
const converters = Object.keys(convertInfo)

interface TextConversionProps {
    readonly onValue: (x: string) => any
}

interface TextConversionState {
    source: string
    target: string
    selected: any
}

export default class TextConversion extends React.Component<TextConversionProps, TextConversionState> {

    public state: TextConversionState = {
        source: '',
        target: '',
        selected: converters[0],
    }

    private sourceStr: Bacon.Bus<any, string>
    private targetStr: Bacon.Bus<any, string>
    private selectedStr: Bacon.Bus<any, string>

    public componentDidMount() {
        this.sourceStr = new Bacon.Bus<any, string>()
        this.targetStr = new Bacon.Bus<any, string>()
        this.selectedStr = new Bacon.Bus<any, string>()

        this.sourceStr.onValue(v => this.setState({ source: v }))
        this.targetStr.onValue(v => this.setState({ target: v }))
        const selected = this.selectedStr.toProperty(converters[0]).skipDuplicates()
        selected.onValue(v => this.setState({ selected: v }))
        const encStr = this.sourceStr.combine(selected, (val, c) => (convertInfo[c].encode)(val))
        encStr.onValue(v => this.setState({ target: v }))
        const decStr = this.targetStr.combine(selected, (val, c) => (convertInfo[c].decode)(val))
        decStr.onValue(v => this.setState({ source: v }))
        Bacon.mergeAll(encStr.changes(), decStr.changes()).onValue(v => this.props.onValue && this.props.onValue(v))
        this.selectedStr.push(converters[0])
    }

    public render() {
        return <Section title="Tekstimuunnokset" subtitle={convertInfo[this.state.selected].name}>
            <TextField onChange={(e, v) => this.sourceStr.push(v)} fullWidth={true} multiLine={true}
                name="source" value={this.state.source} />
            <SelectField value={this.state.selected} onChange={(e, i, v) => this.selectedStr.push(v)} floatingLabelText="Konversio">
                {converters.map(c => <MenuItem value={c} key={c} primaryText={convertInfo[c].name} />)}
            </SelectField>
            <TextField onChange={(e, v) => this.targetStr.push(v)} fullWidth={true} multiLine={true}
                name="target" value={this.state.target} />
        </Section>

    }
}
