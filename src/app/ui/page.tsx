import * as React from "react"
import LastValue from "./last-value"
import Numbers from "./numbers"
import Colors from "./colors"
import TextConversion from "./text-conversion"
import Identifiers from "./identifiers"
import DateTime from "./datetime"
import Cryptography from "./cryptography"
import Links from "./links"
import TopBar from "./layout/topbar"

export default class CalculatorPage extends React.Component<{}, any> {

    constructor(props: {}) {
        super(props)
        console.log("Initializing calculators")

        this.showValue = this.showValue.bind(this)
    }

    showValue(value: any) {
        (this.refs.lastValue as any).setValue(value)
    }

    render() {
        return <div className="everything">
            <TopBar>
                <LastValue ref="lastValue" />
            </TopBar>
            <div className="main-content">
                <div className="section-row">
                    <Numbers onValue={this.showValue} />
                    <DateTime onValue={this.showValue} />
                </div>
                <div className="section-row">
                    <Identifiers onValue={this.showValue} />
                    <Colors onValue={this.showValue} />
                </div>
                <Links />
                <TextConversion onValue={this.showValue} />
                <Cryptography onValue={this.showValue} />
            </div>
        </div>
    }
}
