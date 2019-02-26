import { rgbToHex, RGBValue } from 'app/calc/colors';
import React from 'react';
import { Size, withSize } from 'react-sizeme';
import styled from 'styled-components';

interface ColorBarProps {
  className?: string;
  colors: RGBValue[];
}

export class ColorBar extends React.Component<ColorBarProps> {
  public render() {
    return (
      <Bar className={this.props.className}>
        <SizedInnerBar colors={this.props.colors} />
      </Bar>
    );
  }
  foo = (s: Size) => console.log(s);
}

class InnerBar extends React.Component<{
  size: Size;
  colors: RGBValue[];
}> {
  private canvas = React.createRef<HTMLCanvasElement>();
  public componentDidUpdate() {
    this.updateCanvas();
  }
  public componentDidMount() {
    this.updateCanvas();
  }
  public render() {
    return (
      <Canvas ref={this.canvas} width={this.props.colors.length} height={10} />
    );
  }
  private updateCanvas() {
    const canvas = this.canvas.current;
    if (!canvas) {
      return;
    }
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      return;
    }
    this.props.colors.forEach((color, idx) => {
      ctx.fillStyle = rgbToHex(color);
      ctx.fillRect(idx, 0, idx + 1, 10);
    });
  }
}

export const SizedInnerBar = withSize({ monitorWidth: true })(InnerBar);

const Bar = styled.div`
  height: 24px;
  background-color: #f7ee7f;
  width: 100%;
`;

const Canvas = styled.canvas`
  width: 100%;
  height: 100%;
`;
