import React from "react"

export default class Section extends React.Component {
    render() {
        return <section className="panel">
            <header className={this.props.bgClass}>{ this.props.title }</header>
            { this.props.children }
        </section>
    }
}

Section.defaultProps = {
    bgClass: "bg-teal"
}
