import { Avatar } from 'components/ui/avatar';
import React from 'react';

interface LogoProps {
  className?: string;
  onClick?: React.MouseEventHandler;
}

export function Logo({ className, onClick }: LogoProps) {
  return <Avatar className={className} src="img/calculators.png" onClick={onClick} />;
}
