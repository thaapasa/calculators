import { Icon, IconButton, PropTypes } from '@material-ui/core';
import { FileCopyOutlined } from '@material-ui/icons';
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
  title: string;
  onClick: () => any;
  className?: string;
  color?: PropTypes.Color;
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

export function ClipboardButton(p: ButtonProps) {
  return (
    <IconButton {...p}>
      <FileCopyOutlined />
    </IconButton>
  );
}
