import { rgbToHex, RGBValue } from 'app/calc/colors';
import React from 'react';
import styled from 'styled-components';

interface ColorBarProps {
  className?: string;
  colors: RGBValue[];
}

export class ColorBar extends React.Component<ColorBarProps> {
  private canvas = React.createRef<HTMLCanvasElement>();

  public componentDidUpdate() {
    this.updateCanvas();
  }

  public componentDidMount() {
    this.updateCanvas();
  }

  public render() {
    return (
      <Bar className={this.props.className}>
        <Canvas
          ref={this.canvas}
          width={this.props.colors.length}
          height={10}
        />
      </Bar>
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

const Bar = styled.div`
  height: 24px;
  background-color: #f7ee7f;
  width: 100%;
`;

const Canvas = styled.canvas`
  width: 100%;
  height: 100%;
`;
