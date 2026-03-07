import { cn } from 'lib/utils';
import * as React from 'react';

function Avatar({
  className,
  src,
  alt,
  ...props
}: React.ComponentProps<'div'> & { src?: string; alt?: string }) {
  return (
    <div
      className={cn('relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full', className)}
      {...props}
    >
      {src ? (
        <img src={src} alt={alt ?? ''} className="aspect-square h-full w-full object-cover" />
      ) : (
        props.children
      )}
    </div>
  );
}

export { Avatar };
