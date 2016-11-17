import React from "react"
import FontIcon from "material-ui/FontIcon"
import {red500} from 'material-ui/styles/colors'
import IconButton from "material-ui/IconButton"

export default class ToolButton extends React.Component {
    render() {
        return <button className={`fa fa-${this.props.icon} tool-button-component`}
                       id={this.props.id} title={this.props.title}
                       onClick={this.props.onClick} />
    }
}

export function GenerateButton(props) {
    return <ToolButton icon="refresh" id={props.id} title={props.title} onClick={props.onClick} ref={props.refp}/>
}

export function ClipboardButton(props) {
    return <IconButton tooltip={props.title} title={props.title} onClick={props.onClick}>
            <FontIcon className="material-icons" color={red500}>content_copy</FontIcon>
        </IconButton>
}
