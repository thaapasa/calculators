import React from "react"

export default class Item extends React.Component {
    render() {
        return <div className={"calculator-item " + (this.props.className || "")} style={this.props.style}>
            <div className="name" style={this.props.nameStyle}>{ this.props.name }</div>
            <div className="value" style={this.props.valueStyle}>{ this.props.children }</div>
        </div>
    }
}
