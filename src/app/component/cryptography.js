const $ = require("jquery")
import React from 'react'
import * as Bacon from "baconjs"
import * as BaconUtil from "../util/baconutil"
import * as util from "../util/util"
import {hex_md5} from "../calc/md5"
import {sha1} from "../calc/sha1"

export default class Cryptography extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            md5Value: "",
            sha1Value: ""
        }
    }

    componentDidMount() {
        const cryptoSelect = BaconUtil.getRadioStream("crypto", "md5")
        const inputStream = $("#plain-text-input").asEventStream("keyup").map(BaconUtil.eventToValue)

        Bacon.mergeAll(
            this.streamCalculation(inputStream, hex_md5, this.ucIfChecked($("#md5-uc")), "md5Value", cryptoSelect.map((v) => v == "md5")),
            this.streamCalculation(inputStream, sha1, this.ucIfChecked($("#sha1-uc")), "sha1Value", cryptoSelect.map((v) => v == "sha1")))
            .onValue(this.props.onValue)
    }

    streamCalculation(inputStream, calculation, calcMapper, valueName, valueFilter) {
        let calculated = inputStream.map(calculation)
        if (calcMapper) {
            calculated = calculated.combine(calcMapper, (val, m) => m(val))
        }
        calculated.onValue((value) => this.setState( { [valueName]: value } ))

        return valueFilter ?
            Bacon.combineAsArray(calculated, valueFilter)
                .filter((t) => t[1])
                .map((t) => t[0]) :
            calculated
    }

    ucIfChecked(element) {
        return BaconUtil.getCheckboxStream(element).map((checked) => checked ? util.toUpperCase : util.identity)
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
            <div className="calculator item">
                <div className="name">
                    <input type="radio" name="crypto" value="md5" defaultChecked id="crypto-select-md5" /><label htmlFor="crypto-select-md5">MD5</label>
                    <div className="tools">
                        <input type="checkbox" id="md5-uc" />
                        <label htmlFor="md5-uc" title="Isot kirjaimet"><i className="fa fa-font" /></label>
                    </div>
                </div>
                <div className="value">
                    <input type="text" id="md5-text" className="wide" value={this.state.md5Value} readOnly />
                </div>
            </div>
            <div className="calculator item">
                <div className="name">
                    <input type="radio" name="crypto" value="sha1" id="crypto-select-sha1" /><label htmlFor="crypto-select-sha1">SHA-1</label>
                    <div className="tools">
                        <input type="checkbox" id="sha1-uc" />
                        <label htmlFor="sha1-uc" title="Isot kirjaimet"><i className="fa fa-font" /></label>
                    </div>
                </div>
                <div className="value">
                    <input type="text" id="sha1-text" className="wide" value={this.state.sha1Value} readOnly />
                </div>
            </div>
        </section>

    }
}
