import React from 'react'

export class TextCheck extends React.Component {

    render() {
        return <div className="calculator item">
            <div className="name">{ this.props.name }</div>
                <div className="value">
                <button className="fa fa-refresh tool-icon" id="bank-reference-generate" title="Luo uusi" />
                <input type="text" id="bank-reference-input" className="medium" />
                <input type="text" id="bank-reference-check" className="letter" readOnly />
            </div>
        </div>
    }
}
