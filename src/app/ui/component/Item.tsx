import { cn } from 'lib/utils';
import React from 'react';

interface ItemProps {
  readonly className?: string;
  readonly name?: string | React.ReactNode;
  readonly labelWidth?: string;
  readonly valueClassName?: 'top';
}

export function Item({
  className,
  name,
  labelWidth = 'w-24',
  valueClassName,
  children,
}: React.PropsWithChildren<ItemProps>) {
  return (
    <div className={cn('my-0.5 mx-3 flex items-center justify-start', className)}>
      {name ? <div className={cn('shrink-0', labelWidth)}>{name}</div> : undefined}
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
