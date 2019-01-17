import FontIcon from 'material-ui/FontIcon';
import IconButton from 'material-ui/IconButton';
import { lightBlue600, red500 } from 'material-ui/styles/colors';
import React from 'react';

interface ToolbarProps {
  readonly title: string;
  readonly color: string;
  readonly icon: string;
  readonly onClick: () => any;
}

export default class ToolButton extends React.Component<ToolbarProps, {}> {
  public render() {
    return (
      <IconButton
        tooltip={this.props.title}
        title={this.props.title}
        onClick={this.props.onClick}
      >
        <FontIcon className="material-icons" color={this.props.color}>
          {this.props.icon}
        </FontIcon>
      </IconButton>
    );
  }
}

interface ButtonProps {
  readonly title: string;
  readonly onClick: () => any;
}

export function GenerateButton({ title, onClick }: ButtonProps) {
  return (
    <ToolButton
      color={lightBlue600}
      icon="add_circle"
      title={title}
      onClick={onClick}
    />
  );
}

export function ClipboardButton({ title, onClick }: ButtonProps) {
  return (
    <ToolButton
      color={red500}
      icon="content_copy"
      title={title}
      onClick={onClick}
    />
  );
}
