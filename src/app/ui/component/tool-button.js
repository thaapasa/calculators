import React from 'react'

export default class ToolButton extends React.Component {
    render() {
        return <button className={`fa fa-${this.props.icon} tool-button-component`}
                       id={this.props.id} title={this.props.title}
                       onClick={this.props.onClick} />
    }
}

export function GenerateButton(props) {
    return <ToolButton icon="refresh" id={props.id} title={props.title} onClick={props.onClick}/>
}

export function ClipboardButton(props) {
    return <ToolButton icon="clipboard" id={props.id} title={props.title} onClick={props.onClick}/>
}
