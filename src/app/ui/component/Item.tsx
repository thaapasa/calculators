import { cn } from 'lib/utils';
import React from 'react';

interface ItemProps {
  readonly className?: string;
  readonly style?: React.CSSProperties;
  readonly name?: string | React.ReactNode;
  readonly valueClassName?: 'top';
}

export function Item({
  className,
  style,
  name,
  valueClassName,
  children,
}: React.PropsWithChildren<ItemProps>) {
  return (
    <div className={cn('my-0.5 mx-3 flex items-center justify-start', className)} style={style}>
      {name ? <div className="w-32">{name}</div> : undefined}
      <div
        className={cn(
          'grow whitespace-nowrap inline-flex w-auto flex-nowrap items-center',
          valueClassName === 'top' && 'items-start',
        )}
      >
        {children}
      </div>
    </div>
  );
}
