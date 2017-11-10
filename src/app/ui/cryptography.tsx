import * as React from "react"
import * as Bacon from "baconjs"
import SelectableOutput from "./component/selectable-output"
import Section from "./component/section"
import {hex_md5} from "../calc/md5"
import {sha1} from "../calc/sha1"
import Item from "./component/item"
import TextField from "material-ui/TextField"

export default class Cryptography extends React.Component<any, any> {

    constructor(props) {
        super(props)
        this.inputChanged = this.inputChanged.bind(this)
        this.cryptoList = [
            { name: "MD5", calculate: hex_md5, code: "md5" },
            { name: "SHA-1", calculate: sha1, code: "sha1" }
        ]
        this.cryptos = {}
        this.cryptoList.forEach(c => this.cryptos[c.code] = c)
        this.default = this.cryptoList[0].code

        this.state = { input: "", selected: this.default }
    }

    componentDidMount() {
        this.inputStream = new Bacon.Bus()
        this.cryptoSelectStream = new Bacon.Bus()
        this.inputStream.onValue(v => this.cryptoList.forEach(c => this.refs[c.code].setValue(v)))
        this.cryptoList.forEach(l => {
            l.valueStream = new Bacon.Bus()
            const prop = l.valueStream.toProperty("")
            prop.combine(
                this.cryptoSelectStream.toProperty(this.default).map(c => c == l.code),
                (val, match) => [val, match])
                    .onValue(x => x[1] && this.props.onValue(x[0]))
        })
    }

    inputChanged(event) {
        const inp = event.target.value
        this.setState({ input: inp })
        this.inputStream.push(inp)
    }

    selectCrypto(code) {
        this.setState({ selected: code })
        this.cryptoSelectStream.push(code)
    }

    render() {
        return <Section title="Kryptografia" subtitle={this.cryptos[this.state.selected].name}>
            <Item name="Syöte">
                <TextField onChange={this.inputChanged} fullWidth={true} multiLine={true} name="input" />
            </Item>
            {
                this.cryptoList.map(c =>
                    <SelectableOutput ref={c.code} type={c.code} label={c.name} calculate={c.calculate}
                                      onValue={v => c.valueStream.push(v)} key={c.code} onSelect={(e) => this.selectCrypto(c.code)} />
                )
            }
        </Section>
    }
}
