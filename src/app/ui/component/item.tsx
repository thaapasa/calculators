import React from 'react';

interface ItemProps {
  readonly className?: string;
  readonly style?: React.CSSProperties;
  readonly name: string | JSX.Element;
  readonly nameStyle?: React.CSSProperties;
  readonly valueStyle?: React.CSSProperties;
}

export default class Item extends React.Component<ItemProps, {}> {
  public render() {
    return (
      <div
        className={'calculator-item ' + (this.props.className || '')}
        style={this.props.style}
      >
        <div className="name" style={this.props.nameStyle}>
          {this.props.name}
        </div>
        <div className="value" style={this.props.valueStyle}>
          {this.props.children}
        </div>
      </div>
    );
  }
}
