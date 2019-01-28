import { Card, CardContent, CardHeader, Divider } from '@material-ui/core';
import React from 'react';

interface HalfSectionProps {
  readonly title: string;
  readonly subtitle?: string;
  readonly avatar?: JSX.Element;
  readonly className?: string;
}

interface SectionProps extends HalfSectionProps {
  readonly className?: string;
}

export default class Section extends React.Component<SectionProps, {}> {
  public render() {
    return (
      <Card className={'section ' + (this.props.className || '')}>
        <CardHeader
          title={this.props.title}
          subheader={this.props.subtitle}
          avatar={this.props.avatar}
        />
        <Divider />
        <CardContent>{this.props.children}</CardContent>
      </Card>
    );
  }
}

export function HalfSection({
  title,
  subtitle,
  avatar,
  children,
}: HalfSectionProps & { children: React.ReactNode }) {
  return (
    <Section
      title={title}
      subtitle={subtitle}
      avatar={avatar}
      className="section-half-size"
    >
      {children}
    </Section>
  );
}
