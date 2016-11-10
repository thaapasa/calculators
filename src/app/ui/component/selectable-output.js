const $ = require("jquery")
import React from 'react'
import * as Bacon from "baconjs"
import * as BaconUtil from "../../util/baconutil"
import * as util from '../../util/util'

export default class SelectableOutput extends React.Component {

    constructor(props) {
        super(props)
        this.setValue = this.setValue.bind(this)
        this.state = { value: "" };
    }

    componentDidMount() {
        const cryptoSelect = BaconUtil.getRadioStream(this.props.group, this.props.name)
        const inputStream = new Bacon.Bus()
        this.setState({ inputStream: inputStream })
        this.streamCalculation(inputStream, this.props.calculate, this.ucIfChecked($(`#uc-${this.props.id}`)), cryptoSelect.map((v) => v == this.props.id))
    }

    setValue(val) {
        this.state.inputStream.push(val)
    }

    streamCalculation(inputStream, calculation, calcMapper, valueFilter) {
        let calculated = inputStream.map(calculation)
        if (calcMapper) {
            calculated = calculated.combine(calcMapper, (val, m) => m(val))
        }
        calculated.onValue((value) => this.setState( { value: value } ))

        const valueStream = (valueFilter ?
            Bacon.combineAsArray(calculated, valueFilter)
                .filter((t) => t[1])
                .map((t) => t[0]) :
            calculated)
        valueStream.onValue(this.props.onValue)
    }

    ucIfChecked(element) {
        return BaconUtil.getCheckboxStream(element).map((checked) => checked ? util.toUpperCase : util.identity)
    }

    render() {
        const radioButton = this.props.default ?
            <input type="radio" name={this.props.group} value={this.props.id} id={`crypto-select-${this.props.id}`} defaultChecked /> :
            <input type="radio" name={this.props.group} value={this.props.id} id={`crypto-select-${this.props.id}`} />
        return <div className="calculator item">
            <div className="name">
                {radioButton}<label htmlFor={`crypto-select-${this.props.id}`}>{ this.props.label }</label>
                <div className="tools">
                    <input type="checkbox" id={`uc-${this.props.id}`} />
                    <label htmlFor={`uc-${this.props.id}`} title="Isot kirjaimet"><i className="fa fa-font" /></label>
                </div>
            </div>
            <div className="value">
                <input type="text" id={`${this.props.id}-text`} className="wide" value={this.state.value} readOnly />
            </div>
        </div>
    }
}
