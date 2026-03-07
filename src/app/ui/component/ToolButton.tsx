import log from 'app/util/log';
import { Button } from 'components/ui/button';
import { Copy, PlusCircle } from 'lucide-react';
import React from 'react';

interface ToolbarProps {
  readonly title: string;
  readonly color: string;
  readonly icon: string;
  readonly onClick: () => any;
  readonly className?: string;
}

export function copyRefToClipboard(ref: React.RefObject<HTMLInputElement | null>) {
  try {
    if (ref.current) {
      ref.current.select();
      document.execCommand('copy');
    }
  } catch (e) {
    log(`Could not copy: ${e}`);
  }
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  add_circle: PlusCircle,
};

export function ToolButton({ title, onClick, className, icon }: ToolbarProps) {
  const IconComponent = iconMap[icon];
  return (
    <Button variant="ghost" size="icon" title={title} onClick={onClick} className={className}>
      {IconComponent ? (
        <IconComponent className="text-primary" />
      ) : (
        <span className="material-icons text-primary">{icon}</span>
      )}
    </Button>
  );
}

interface ButtonProps {
  title: string;
  onClick: () => any;
  className?: string;
  color?: 'inherit' | 'primary' | 'secondary' | 'default';
}

export function GenerateButton({ title, onClick }: ButtonProps) {
  return <ToolButton color="primary" icon="add_circle" title={title} onClick={onClick} />;
}

export function ClipboardButton({ title, onClick, className }: ButtonProps) {
  return (
    <Button variant="ghost" size="icon" title={title} onClick={onClick} className={className}>
      <Copy />
    </Button>
  );
}
