import React from "react"
import LastValue from "./last-value"
import Numbers from "./numbers"
import Colors from "./colors"
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
                <div class="section-row">
                    <Numbers onValue={this.showValue} />
                    <Colors onValue={this.showValue} />
                </div>
                <Identifiers onValue={this.showValue} />
                <Cryptography onValue={this.showValue} />
            </div>
        </div>
    }
}
