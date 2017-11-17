import * as React from 'react'
import LastValue from './last-value'
import Numbers from './numbers'
import Colors from './colors'
import TextConversion from './text-conversion'
import Identifiers from './identifiers'
import DateTime from './datetime'
import Cryptography from './cryptography'
import Links from './links'
import TopBar from './layout/topbar'

export default class CalculatorPage extends React.Component<{}, {}> {

    private lastValue: LastValue | null

    constructor(props: {}) {
        super(props)
        console.log('Initializing calculators')
    }

    private showValue = (value: string) => {
        if (this.lastValue) {
            this.lastValue.setValue(value)
        }
    }

    public render() {
        return <div className="everything">
            <TopBar>
                <LastValue ref={r => this.lastValue = r} />
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
