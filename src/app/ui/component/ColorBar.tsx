import { rgbToHex, RGBValue } from 'app/calc/colors';
import { cn } from 'lib/utils';
import React, { useEffect, useRef } from 'react';

interface ColorBarProps {
  className?: string;
  colors: RGBValue[];
}

export function ColorBar({ className, colors }: ColorBarProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    colors.forEach((color, idx) => {
      ctx.fillStyle = rgbToHex(color);
      ctx.fillRect(idx, 0, idx + 1, 10);
    });
  }, [colors]);

  return (
    <div className={cn('h-6 bg-[#f7ee7f] w-full', className)}>
      <canvas ref={canvasRef} className="w-full h-full" width={colors.length} height={10} />
    </div>
  );
}
