import React from 'react'
import Section from './component/section'
import TextField from 'material-ui/TextField'
import Bacon from 'baconjs'
import SelectField from 'material-ui/SelectField'
import MenuItem from 'material-ui/MenuItem'
import * as base64 from '../calc/base64'
import rot13 from '../calc/rot13'
import * as strings from '../util/strings'
import { jsonStringToXml, xmlToJsonString } from '../calc/xml-json'
import { identity } from '../util/util'
import { svgToReactNative } from '../calc/svg-react-native'
import * as store from './store'

interface ConverterInfo {
    readonly encode: (x: string) => Promise<string> | string
    readonly decode: (x: string) => Promise<string> | string
    readonly name: string
}

const convertInfo: { [key: string]: ConverterInfo } = {
    js2xml: { encode: jsonStringToXml, decode: xmlToJsonString, name: 'JSON to XML'  },
    svg2RN: { encode: svgToReactNative, decode: identity, name: 'SVG to React Native'  },
    urlEncode: { encode: async x => encodeURIComponent(x), decode: x => decodeURIComponent(x), name: 'URL encode' },
    base64: { encode: base64.encode, decode: base64.decode, name: 'Base64' },
    hexStr: { encode: strings.toHexString, decode: strings.fromHexString, name: 'Heksamerkkijono' },
    rot13: { encode: rot13, decode: rot13, name: 'ROT-13' },
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

const CONVERTER_STORE_KEY = 'selectedTextConverter'

function getConverterFromStore(): string {
    return store.getValue<string>(CONVERTER_STORE_KEY) || converters[0]
}

function setConverterToStore(converterName: string): void {
    store.putValue(CONVERTER_STORE_KEY, converterName)
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

        const initialConverter = getConverterFromStore()
        this.sourceStr.onValue(v => this.setState({ source: v }))
        this.targetStr.onValue(v => this.setState({ target: v }))
        const selected = this.selectedStr.toProperty(initialConverter).skipDuplicates()
        selected.onValue(v => {
            this.setState({ selected: v })
            setConverterToStore(v)
        })
        const encStr = this.sourceStr.combine(selected, (val, c) => (convertInfo[c].encode)(val))
        encStr.onValue(async v => this.setState({ target: await v }))
        const decStr = this.targetStr.combine(selected, (val, c) => (convertInfo[c].decode)(val))
        decStr.onValue(async v => this.setState({ source: await v }))
        Bacon.mergeAll(encStr.changes(), decStr.changes()).onValue(async v => this.props.onValue && this.props.onValue(await v))
        this.selectedStr.push(initialConverter)
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
