import { cn } from 'lib/utils';
import * as React from 'react';

const Slider = React.forwardRef<
  HTMLInputElement,
  React.ComponentProps<'input'> & {
    onValueChange?: (value: number) => void;
  }
>(({ className, onValueChange, onChange, ...props }, ref) => {
  const handleChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange?.(e);
      onValueChange?.(Number(e.target.value));
    },
    [onChange, onValueChange],
  );

  return (
    <input
      type="range"
      className={cn(
        'w-full h-2 cursor-pointer appearance-none rounded-lg bg-background accent-primary',
        className,
      )}
      ref={ref}
      onChange={handleChange}
      {...props}
    />
  );
});
Slider.displayName = 'Slider';

export { Slider };
