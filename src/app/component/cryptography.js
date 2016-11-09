import React from 'react'
import * as BaconUtil from "../util/baconutil"
import SelectableOutput from "./selectable-output"
import {hex_md5} from "../calc/md5"
import {sha1} from "../calc/sha1"

export default class Cryptography extends React.Component {

    componentDidMount() {
        const inputStream = BaconUtil.textFieldValue("#plain-text-input")
        inputStream.onValue(v => [this.refs.md5, this.refs.sha1].forEach(r => r.setValue(v)))
    }

    render() {
        return <section className="panel">
            <header className="bg-teal">Kryptografia</header>
            <div className="calculator item">
                <div className="name">Teksti</div>
                <div className="value">
                    <textarea id="plain-text-input" className="large" />
                </div>
            </div>
            <SelectableOutput ref="md5" id="md5" group="crypto" label="MD5" calculate={hex_md5} onValue={this.props.onValue} default={true} />
            <SelectableOutput ref="sha1" id="sha1" group="crypto" label="SHA-1" calculate={sha1} onValue={this.props.onValue} />
        </section>
    }
}
