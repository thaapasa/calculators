import { cn } from 'lib/utils';
import React from 'react';

export function FlexRow({
  className,
  ...props
}: React.PropsWithChildren<React.HTMLAttributes<HTMLDivElement>>) {
  return <div className={cn('flex flex-row w-full box-border', className)} {...props} />;
}

export function FlexColumn({
  className,
  ...props
}: React.PropsWithChildren<React.HTMLAttributes<HTMLDivElement>>) {
  return <div className={cn('flex flex-col h-full box-border', className)} {...props} />;
}

export function Flex({
  className,
  ...props
}: React.PropsWithChildren<React.HTMLAttributes<HTMLDivElement>>) {
  return <div className={cn('flex-1', className)} {...props} />;
}

export function LeftPad({
  className,
  ...props
}: React.PropsWithChildren<React.HTMLAttributes<HTMLDivElement>>) {
  return <div className={cn('pl-4', className)} {...props} />;
}
