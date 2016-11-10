const $ = require("jquery")
import React from 'react'
import * as BaconUtil from "../util/baconutil"
import { GenerateButton } from "./tool-button"
import { log } from '../util/log'
import * as util from '../util/util'

export default class CheckValue extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            buttonId: `${this.props.id}-generate`,
            inputId: `${this.props.id}-input`,
            checkId: `${this.props.id}-check`,
            valueId: `${this.props.id}-value`,
            value: "",
            checkValue: ""
        }
    }

    componentDidMount() {
        this.streamToGenerate(`#${this.state.buttonId}`, this.props.generate, `#${this.state.inputId}`)
        this.streamToCheck(`#${this.state.inputId}`, this.props.check, this.props.combine)
    }

    streamToGenerate(button, generator, target) {
        $(button).asEventStream("click").onValue(() => {
            const generated = generator()
            log(`Generated value: ${generated}`)
            $(target).val(generated).trigger("keyup")
        })
    }

    streamToCheck(inputField, calculateCheck, combiner = util.combineWith("")) {
        const inputStream = BaconUtil.textFieldValue(inputField)
        const checkValue = inputStream.map(calculateCheck)
        checkValue.onValue((value) => {
            console.log("Calculated check value:", value)
            this.setState({ checkValue: value || "" })
        })
        return checkValue
            .combine(inputStream, (chk, inp) => (chk !== undefined) && combiner(inp, chk))
            .filter(util.nonEmpty)
            .onValue((v) => {
                this.setState({ value: v || "" })
                this.props.onValue && this.props.onValue(v)
            })
    }

    render() {
        return <div className="calculator item">
            <div className="name">{ this.props.name }</div>
            <div className="value">
                <GenerateButton id={this.state.buttonId} title="Luo uusi" />
                <input type="text" id={this.state.inputId} className={this.props.className} maxLength={this.props.maxLength} />
                <input type="text" id={this.state.checkId} className="letter" readOnly value={this.state.checkValue}/>
                <input type="hidden" id={this.state.valueId} value={this.state.value} />
            </div>
        </div>
    }
}
