import { cn } from 'lib/utils';
import * as React from 'react';

interface SheetProps {
  open: boolean;
  onClose: () => void;
  side?: 'left' | 'right';
  children: React.ReactNode;
  className?: string;
}

function Sheet({ open, onClose, side = 'left', children, className }: SheetProps) {
  React.useEffect(() => {
    if (!open) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-40 bg-black/50" onClick={onClose} />
      {/* Panel */}
      <div
        className={cn(
          'fixed inset-y-0 z-50 flex flex-col bg-surface shadow-lg transition-transform',
          side === 'left' ? 'left-0' : 'right-0',
          'w-72',
          className,
        )}
      >
        {children}
      </div>
    </>
  );
}

export { Sheet };
