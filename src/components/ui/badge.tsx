import { cn } from 'lib/utils';
import * as React from 'react';

function Badge({
  className,
  onDelete,
  children,
  ...props
}: React.ComponentProps<'span'> & { onDelete?: () => void }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full border border-border px-2.5 py-0.5 text-xs font-semibold transition-colors hover:bg-background',
        className,
      )}
      {...props}
    >
      {children}
      {onDelete && (
        <button
          type="button"
          onClick={onDelete}
          className="ml-1 rounded-full outline-none hover:bg-border focus:ring-1 focus:ring-primary"
          aria-label="Remove"
        >
          ✕
        </button>
      )}
    </span>
  );
}

export { Badge };
