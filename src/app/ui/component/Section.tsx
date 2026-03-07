import { Card, CardContent, CardDescription, CardHeader, CardTitle } from 'components/ui/card';
import { Separator } from 'components/ui/separator';
import { cn } from 'lib/utils';
import React from 'react';

interface HalfSectionProps {
  title: string;
  subtitle?: string;
  avatar?: React.ReactNode;
  className?: string;
  image?: string;
  action?: React.ReactNode;
}

interface SectionProps extends HalfSectionProps {
  className?: string;
}

function Section({
  image,
  title,
  subtitle,
  className,
  action,
  avatar,
  children,
}: React.PropsWithChildren<SectionProps>) {
  return (
    <Card className={cn('pb-1 my-6 text-left', className)}>
      {image ? <img src={image} alt={title} className="h-22 w-full object-cover" /> : null}
      <CardHeader>
        <div className="flex items-center gap-3">
          {avatar}
          <div className="flex-1">
            <CardTitle>{title}</CardTitle>
            <CardDescription>{subtitle || ' '}</CardDescription>
          </div>
          {action}
        </div>
      </CardHeader>
      <Separator />
      <CardContent>{children}</CardContent>
    </Card>
  );
}

export default Section;

export function HalfSection({
  className,
  children,
  ...props
}: HalfSectionProps & { children: React.ReactNode }) {
  return (
    <Section className={className} {...props}>
      {children}
    </Section>
  );
}
