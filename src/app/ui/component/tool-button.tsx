import * as React from "react"
import FontIcon from "material-ui/FontIcon"
import {red500,lightBlue600} from "material-ui/styles/colors"
import IconButton from "material-ui/IconButton"

export default class ToolButton extends React.Component {
    render() {
        return <IconButton tooltip={this.props.title} title={this.props.title} onClick={this.props.onClick}>
                <FontIcon className="material-icons" color={this.props.color}>{ this.props.icon }</FontIcon>
            </IconButton>
    }
}

export function GenerateButton(props) {
    return <ToolButton color={lightBlue600} icon="add_circle" tooltip={props.title} title={props.title} onClick={props.onClick} />
}

export function ClipboardButton(props) {
    return <ToolButton color={red500} icon="content_copy" tooltip={props.title} title={props.title} onClick={props.onClick} />
}
