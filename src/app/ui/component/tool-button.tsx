import { Icon, IconButton } from '@material-ui/core';
import log from 'app/util/log';
import React from 'react';

interface ToolbarProps {
  readonly title: string;
  readonly color: string;
  readonly icon: string;
  readonly onClick: () => any;
  readonly className?: string;
}

export function copyRefToClipboard(ref: React.RefObject<HTMLInputElement>) {
  try {
    if (ref.current) {
      ref.current.select();
      document.execCommand('copy');
    }
  } catch (e) {
    log(`Could not copy: ${e}`);
  }
}

export default class ToolButton extends React.Component<ToolbarProps, {}> {
  public render() {
    return (
      <IconButton
        title={this.props.title}
        onClick={this.props.onClick}
        className={this.props.className}
      >
        <Icon className="material-icons" color="primary">
          {this.props.icon}
        </Icon>
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
      color="primary"
      icon="add_circle"
      title={title}
      onClick={onClick}
    />
  );
}

export function ClipboardButton({ title, onClick, className }: ButtonProps) {
  return (
    <ToolButton
      color="primary"
      icon="content_copy"
      className={className}
      title={title}
      onClick={onClick}
    />
  );
}
