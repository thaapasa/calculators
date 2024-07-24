import {
  Card,
  CardContent,
  CardHeader,
  CardMedia,
  Divider,
  styled,
  StyledComponentProps,
} from '@mui/material';
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

function SectionImpl({
  image,
  title,
  classes,
  subtitle,
  className,
  action,
  avatar,
  children,
}: React.PropsWithChildren<SectionProps & StyledComponentProps>) {
  return (
    <Card className={'section ' + (className || '')}>
      {image ? <CardMedia image={image} title={title} className={classes!.media} /> : null}
      <CardHeader title={title} subheader={subtitle} avatar={avatar} action={action} />
      <Divider />
      <CardContent>{children}</CardContent>
    </Card>
  );
}

const Section = styled(SectionImpl, {
  media: {
    height: 88,
  },
})``;
export default Section;

export function HalfSection(p: HalfSectionProps & { children: React.ReactNode }) {
  return (
    <Section className="section-half-size" {...p}>
      {p.children}
    </Section>
  );
}
