import React from "react"
import * as Bacon from "baconjs"
import SelectableOutput from "./component/selectable-output"
import Section from "./component/section"
import {hex_md5} from "../calc/md5"
import {sha1} from "../calc/sha1"

export default class Cryptography extends React.Component {

    constructor(props) {
        super(props)
        this.inputChanged = this.inputChanged.bind(this)
        this.state = { input: "" }
    }

    componentDidMount() {
        this.inputStream = new Bacon.Bus()
        this.inputStream.onValue(v => [this.refs.md5, this.refs.sha1].forEach(r => r.setValue(v)))
    }

    inputChanged(event) {
        const inp = event.target.value
        this.setState({ input: inp })
        this.inputStream.push(inp)
    }

    render() {
        return <Section title="Kryptografia">
            <div className="calculator item">
                <div className="name">Teksti</div>
                <div className="value">
                    <textarea id="plain-text-input" className="large" value={this.state.input} onChange={this.inputChanged} />
                </div>
            </div>
            <SelectableOutput ref="md5" id="md5" group="crypto" label="MD5" calculate={hex_md5} onValue={this.props.onValue} default="md5" />
            <SelectableOutput ref="sha1" id="sha1" group="crypto" label="SHA-1" calculate={sha1} onValue={this.props.onValue} default="md5" />
        </Section>
    }
}
