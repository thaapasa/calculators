import React from "react"
import LastValue from "./last-value"
import Numbers from "./numbers"
import Identifiers from "./identifiers"
import Cryptography from "./cryptography"
import TopBar from "./layout/topbar"

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
        return <div className="everything">
            <TopBar>
                <LastValue ref="lastValue" />
            </TopBar>
            <div className="main-content">
                <Numbers onValue={this.showValue} />
                <Identifiers onValue={this.showValue} />
                <Cryptography onValue={this.showValue} />
            </div>
        </div>
    }
}
