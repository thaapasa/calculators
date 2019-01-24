import { IconButton } from '@material-ui/core';
import { Typography } from '@material-ui/core/styles/createTypography';
import log from 'app/util/log';
import React from 'react';

interface ToolbarProps {
  readonly title: string;
  readonly color: string;
  readonly icon: string;
  readonly onClick: () => any;
  readonly className?: string;
}

export default class ToolButton extends React.Component<ToolbarProps, {}> {
  public render() {
    return (
      <IconButton
        title={this.props.title}
        onClick={this.props.onClick}
        className={this.props.className}
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
  readonly className?: string;
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

export function ClipboardButton({ title, onClick, className }: ButtonProps) {
  return (
    <ToolButton
      color={red500}
      icon="content_copy"
      className={className}
      title={title}
      onClick={onClick}
    />
  );
}

export function copyRefToClipboard(ref: React.RefObject<Typography>) {
  try {
    if (ref.current) {
      ref.current.select();
      document.execCommand('copy');
    }
  } catch (e) {
    log(`Could not copy: ${e}`);
  }
}
