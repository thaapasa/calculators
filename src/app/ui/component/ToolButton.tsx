import log from 'app/util/log';
import { Button } from 'components/ui/button';
import { Copy, PlusCircle } from 'lucide-react';
import React from 'react';

interface ToolbarProps {
  readonly title: string;
  readonly icon: string;
  readonly onClick: () => void;
  readonly className?: string;
}

export function copyRefToClipboard(
  ref: React.RefObject<HTMLInputElement | HTMLTextAreaElement | null>,
) {
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
  const IconComponent = iconMap[icon] ?? PlusCircle;
  return (
    <Button variant="ghost" size="icon" title={title} onClick={onClick} className={className}>
      <IconComponent className="text-primary" />
    </Button>
  );
}

interface ButtonProps {
  title: string;
  onClick: () => void;
  className?: string;
}

export function GenerateButton({ title, onClick }: ButtonProps) {
  return <ToolButton icon="add_circle" title={title} onClick={onClick} />;
}

export function ClipboardButton({ title, onClick, className }: ButtonProps) {
  return (
    <Button variant="ghost" size="icon" title={title} onClick={onClick} className={className}>
      <Copy />
    </Button>
  );
}
