import React from 'react'
import Section from './component/section'
import TextField from 'material-ui/TextField'
import Bacon from 'baconjs'
import SelectField from 'material-ui/SelectField'
import MenuItem from 'material-ui/MenuItem'
import * as base64 from '../calc/base64'
import rot13 from '../calc/rot13'
import * as strings from '../util/strings'
import * as xml2js from 'xml2js'
import { parseBooleans, parseNumbers } from 'xml2js/lib/processors'

interface ConverterInfo {
    readonly encode: (x: string) => Promise<string> | string
    readonly decode: (x: string) => Promise<string> | string
    readonly name: string
}

function xmlToJson(x: string): Promise<string> {
    return new Promise<string>(resolve => xml2js.parseString(x, {
        ignoreAttrs: false,
        trim: true,
        valueProcessors: [parseNumbers, parseBooleans],
        explicitArray: false,
    }, (err, res) => {
        if (err) { resolve('Invalid XML') } else { resolve(JSON.stringify(res, null, 2)) }
    }))
}

const xmlBuilder = new xml2js.Builder()

function jsonToXml(x: string): string {
    try {
        return xmlBuilder.buildObject(JSON.parse(x)).toString()
    } catch (e) {
        return 'Invalid JSON'
    }
}

const convertInfo: { [key: string]: ConverterInfo } = {
    base64: { encode: base64.encode, decode: base64.decode, name: 'Base64' },
    rot13: { encode: rot13, decode: rot13, name: 'ROT-13' },
    hexStr: { encode: strings.toHexString, decode: strings.fromHexString, name: 'Heksamerkkijono' },
    urlEncode: { encode: async x => encodeURIComponent(x), decode: x => decodeURIComponent(x), name: 'URL encode' },
    js2xml: { encode: jsonToXml, decode: xmlToJson, name: 'JSON to XML'  },
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
        encStr.onValue(async v => this.setState({ target: await v }))
        const decStr = this.targetStr.combine(selected, (val, c) => (convertInfo[c].decode)(val))
        decStr.onValue(async v => this.setState({ source: await v }))
        Bacon.mergeAll(encStr.changes(), decStr.changes()).onValue(async v => this.props.onValue && this.props.onValue(await v))
        this.selectedStr.push(converters[0])
    }

    public render() {
        return <Section title="Tekstimuunnokset" subtitle={convertInfo[this.state.selected].name}>
            <div className="flex-row center">
                <TextField className="flex" onChange={(e, v) => this.sourceStr.push(v)} fullWidth={true} multiLine={true}
                    name="source" value={this.state.source} />
                <div className="left-pad">{this.state.source.length}</div>
            </div>
            <SelectField value={this.state.selected} onChange={(e, i, v) => this.selectedStr.push(v)} floatingLabelText="Konversio">
                {converters.map(c => <MenuItem value={c} key={c} primaryText={convertInfo[c].name} />)}
            </SelectField>
            <div className="flex-row center">
                <TextField className="flex" onChange={(e, v) => this.targetStr.push(v)} fullWidth={true} multiLine={true}
                    name="target" value={this.state.target} />
                <div className="left-pad">{this.state.target.length}</div>
            </div>
        </Section>

    }
}
