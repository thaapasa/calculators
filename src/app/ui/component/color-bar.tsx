import { RGBValue } from 'app/calc/colors';
import React from 'react';
import { Size, withSize } from 'react-sizeme';
import styled from 'styled-components';

interface ColorBarProps {
  className?: string;
  getColor(pos: number): RGBValue;
}

export class ColorBar extends React.Component<ColorBarProps> {
  public render() {
    return (
      <Bar className={this.props.className}>
        <SizedInnerBar getColor={this.props.getColor} />
      </Bar>
    );
  }
  foo = (s: Size) => console.log(s);
}

class InnerBar extends React.Component<{
  size: Size;
  getColor(pos: number): RGBValue;
}> {
  public render() {
    return <div>{this.props.size.width}</div>;
  }
}

export const SizedInnerBar = withSize({ monitorWidth: true })(InnerBar);

const Bar = styled.div`
  height: 32px;
  background-color: #f7ee7f;
  width: 100%;
`;
