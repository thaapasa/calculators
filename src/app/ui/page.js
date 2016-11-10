import React from "react"
import LastValue from "./last-value"
import Identifiers from "./identifiers"
import Cryptography from "./cryptography"

export default class CalculatorPage extends React.Component {

    constructor(props) {
        super(props)
        console.log("Initializing calculators")

        this.showValue = this.showValue.bind(this)
    }

    showValue(value) {
        this.refs.lastValue.setValue(value)
    }

    render() {
        return <div className="site-content">
            <h1>Laskureita</h1>
            <LastValue ref="lastValue" />
            <Identifiers onValue={this.showValue} />
            <Cryptography onValue={this.showValue} />
        </div>
    }
}
