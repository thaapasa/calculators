const $ = require("jquery")
import React from 'react'
import * as BaconUtil from "../util/baconutil"
import { log } from '../util/log'
import * as util from '../util/util'

export class CheckValue extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            buttonId: `${this.props.id}-generate`,
            inputId: `${this.props.id}-input`,
            checkId: `${this.props.id}-check`
        }
    }

    componentDidMount() {
        this.streamToGenerate(`#${this.state.buttonId}`, this.props.generate, `#${this.state.inputId}`)
        this.streamToCheck(`#${this.state.inputId}`, this.props.check, `#${this.state.checkId}`, this.props.combine)
    }

    streamToGenerate(button, generator, target) {
        $(button).asEventStream("click").onValue(() => {
            const generated = generator()
            log(`Generated value: ${generated}`)
            $(target).val(generated).trigger("keyup")
        })
    }

    streamToCheck(inputField, calculateCheck, checkField, combiner = combineWith("")) {
        const inputStream = BaconUtil.textFieldValue(inputField)
        const checkValue = inputStream.map(calculateCheck)
        checkValue.onValue((value) => {
            console.log("Calculated check value:", value)
            $(checkField).val(value)
        })
        return checkValue
            .combine(inputStream, (chk, inp) => (chk !== undefined) && combiner(inp, chk))
            .filter(util.nonEmpty)
    }

    render() {
        return <div className="calculator item">
            <div className="name">{ this.props.name }</div>
                <div className="value">
                <button className="fa fa-refresh tool-icon" id={this.state.buttonId} title="Luo uusi" />
                <input type="text" id={this.state.inputId} className={this.props.className} maxLength={this.props.maxLength} />
                <input type="text" id={this.state.checkId} className="letter" readOnly />
            </div>
        </div>
    }
}
