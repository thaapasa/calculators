import { Avatar } from 'components/ui/avatar';
import { cn } from 'lib/utils';
import React from 'react';

interface LogoProps {
  className?: string;
  onClick?: React.MouseEventHandler;
}

export function Logo({ className, onClick }: LogoProps) {
  return (
    <Avatar className={cn('h-8 w-8', className)} src="img/calculators.png" onClick={onClick} />
  );
}
