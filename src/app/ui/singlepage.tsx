import React from 'react'
import Numbers from './numbers'
import Colors from './colors'
import TextConversion from './text-conversion'
import Identifiers from './identifiers'
import DateTime from './datetime'
import Cryptography from './cryptography'
import Links from './links'
import ByteSizes from './bytesize'

interface PageProps {
    onValue: (value: string) => void
}

export default class CalculatorSinglePageLayout extends React.Component<PageProps> {

    public render() {
        return (
            <>
                <div className="section-row">
                    <Numbers onValue={this.props.onValue} />
                    <DateTime onValue={this.props.onValue} />
                </div>
                <div className="section-row">
                    <Identifiers onValue={this.props.onValue} />
                    <Colors onValue={this.props.onValue} />
                </div>
                <div className="section-row">
                    <ByteSizes onValue={this.props.onValue} />
                    <Links />
                </div>
                <TextConversion onValue={this.props.onValue} />
                <Cryptography onValue={this.props.onValue} />
            </>
        )
    }
}
