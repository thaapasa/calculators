import React from "react"

export default class Item extends React.Component {
    render() {
        return <div className={"calculator item " + (this.props.className || "")}>
            <div className="name">{ this.props.name }</div>
            <div className="value">{ this.props.children }</div>
        </div>
    }
}