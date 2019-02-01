import React from 'react';
import styled from 'styled-components';

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
      <CalculatorItem className={this.props.className} style={this.props.style}>
        <div className="name" style={this.props.nameStyle}>
          {this.props.name}
        </div>
        <div className="value" style={this.props.valueStyle}>
          {this.props.children}
        </div>
      </CalculatorItem>
    );
  }
}

const CalculatorItem = styled.div`
  margin: 0.2em 0.75em;
  display: inline-flex;
  align-items: center;
  justify-content: flex-start;

  & > .name {
    width: 8em;
  }

  & > .value {
    flex-grow: 1;
    white-space: nowrap;
    display: inline-flex;
    width: auto;
    flex-wrap: nowrap;
  }

  &.multiline > .value {
    white-space: normal;
    display: inherit;
    width: auto;
    flex-wrap: inherit;
  }
`;
