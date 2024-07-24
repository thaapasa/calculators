import {
  Card,
  CardContent,
  CardHeader,
  CardMedia,
  Divider,
  StyledComponentProps,
  withStyles,
} from '@material-ui/core';
import React from 'react';

interface HalfSectionProps {
  title: string;
  subtitle?: string;
  avatar?: JSX.Element;
  className?: string;
  image?: string;
  action?: React.ReactNode;
}

interface SectionProps extends HalfSectionProps {
  className?: string;
}

class SectionImpl extends React.Component<SectionProps & StyledComponentProps> {
  public render() {
    return (
      <Card className={'section ' + (this.props.className || '')}>
        {this.props.image ? (
          <CardMedia
            image={this.props.image}
            title={this.props.title}
            className={this.props.classes!.media}
          />
        ) : null}
        <CardHeader
          title={this.props.title}
          subheader={this.props.subtitle}
          avatar={this.props.avatar}
          action={this.props.action}
        />
        <Divider />
        <CardContent>{this.props.children}</CardContent>
      </Card>
    );
  }
}

const Section = withStyles({
  media: {
    height: 88,
  },
})(SectionImpl);
export default Section;

export function HalfSection(p: HalfSectionProps & { children: React.ReactNode }) {
  return (
    <Section className="section-half-size" {...p}>
      {p.children}
    </Section>
  );
}
