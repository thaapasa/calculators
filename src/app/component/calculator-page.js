const $ = require("jquery")
import * as Bacon from "baconjs"
import * as BaconUtil from "../util/baconutil"
import { hex_md5 } from "../calc/md5"
import { sha1 } from "../calc/sha1"
import * as companyId from "../calc/companyid"
import * as bankReference from "../calc/bankreference"
import * as hetu from "../calc/hetu"
import * as util from "../util/util"
import { CheckValue } from "./check-value"
import React from 'react'
import ReactDOM from 'react-dom'

function eventToValue(event) {
    return $(event.target).val()
}

function eventToChecked(event) {
    return $(event.target).prop("checked")
}

function valueEquals(expected) {
    return (value) => value == expected
}

function showValue(value) {
    $("#last-value").val(value)
}

function nonEmpty(value) {
    return value && value.length && value.length > 0
}

function combineWith(separator) {
    return function(s1, s2) {
        return s1 + separator + s2
    }
}

function ucIfChecked(element) {
    return getCheckboxStream(element).map((checked) => checked ? toUpperCase : identity)
}

function toUpperCase(value) { return typeof value === "string" ? value.toUpperCase() : undefined }
function identity(value) { return value }

function takeArrayElement(index) {
    return (ar) => ar[index]
}

function getCheckboxStream(element, initialValue) {
    return element.asEventStream("change").map(eventToChecked).toProperty(initialValue)
}

function getRadioStream(name, initialValue) {
    return $("input[name=" + name + "]").asEventStream("change").map(eventToValue).toProperty(initialValue)
}

function bindCopyToClipboard(button, fieldToCopy) {
    button.asEventStream("click").onValue(() => {
        const value = fieldToCopy.val()
        console.log(`Copying to clipboard: ${value}`)

        try {
            fieldToCopy.select()
            document.execCommand("copy")
        } catch (e) {
            console.log("Could not copy!")
        }
    })
}

function streamCalculation(inputField, calculation, calcMapper, valueField, valueFilter) {
    const inputStream = inputField.asEventStream("keyup").map(eventToValue)
    let calculated = inputStream.map(calculation)
    if (calcMapper) {
        calculated = calculated.combine(calcMapper, (val, m) => m(val))
    }
    calculated.onValue((value) => valueField.val(value))

    return valueFilter ?
        Bacon.combineAsArray(calculated, valueFilter)
            .filter(takeArrayElement(1))
            .map(takeArrayElement(0)) :
        calculated
}

export class CalculatorPage extends React.Component {

    constructor(props) {
        super(props)

        console.log("Initializing calculators")
        const cryptoSelect = getRadioStream("crypto", "md5")

        this.showValue = this.showValue.bind(this)

        this.state = {
            lastValue: ""
        };

/*
        const calculatedValues = [
            streamCalculation($("#plain-text-input"), hex_md5, ucIfChecked($("#md5-uc")), $("#md5-text"), cryptoSelect.map(valueEquals("md5"))),
            streamCalculation($("#plain-text-input"), sha1, ucIfChecked($("#sha1-uc")), $("#sha1-text"), cryptoSelect.map(valueEquals("sha1")))
        ]
        bindCopyToClipboard($("#copy-to-clipboard"), $("#last-value"))

        // Show latest calculated value
        Bacon.mergeAll(calculatedValues).onValue(showValue)
         */
    }

    showValue(value) {
        this.setState({ lastValue: value })
    }

    render() {
        return <div className="site-content">
            <h1>Laskureita</h1>
            <section className="panel">
                <header className="bg-subtle">Viimeisin arvo</header>
                <div className="calculator item">
                    <div className="name">Arvo</div>
                    <button className="fa fa-clipboard tool-icon" id="copy-to-clipboard" title="Kopioi leikepöydälle" />
                    <div className="value"><input type="text" id="last-value" className="wide" readOnly value={ this.state.lastValue }/></div>
                </div>
            </section>
            <section className="panel">
                <header className="bg-teal">Tunnisteet</header>
                <CheckValue name="Henkilötunnus" id="hetu"
                            check={hetu.check} generate={hetu.generate} combine={util.combine}
                            onValue={showValue} maxLength="10" className="narrow" />
                <CheckValue name="Viitenumero" id="bank-reference"
                            check={bankReference.check} generate={bankReference.generate} combine={util.combine}
                            onValue={showValue} maxLength="24" className="medium" />
                <CheckValue name="Y-tunnus" id="companyId"
                            check={companyId.check} generate={companyId.generate} combine={util.combineWith("-")}
                            onValue={showValue} maxLength="7" className="narrow" />
            </section>
            <section className="panel">
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
                        <input type="text" id="md5-text" className="wide" readOnly />
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
                        <input type="text" id="sha1-text" className="wide" readOnly />
                    </div>
                </div>
            </section>
        </div>
    }
}
