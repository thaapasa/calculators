import React from 'react'
import { Card, CardHeader, CardText } from 'material-ui/Card'
import Divider from 'material-ui/Divider'

interface HalfSectionProps {
    readonly title: string
    readonly subtitle?: string
    readonly avatar?: JSX.Element
    readonly className?: string
}

interface SectionProps extends HalfSectionProps {
    readonly className?: string
}

export default class Section extends React.Component<SectionProps, {}> {
    public render() {
        return <Card initiallyExpanded={true} className={'section ' + (this.props.className || '')}>
            <CardHeader title={this.props.title} actAsExpander={true} showExpandableButton={true}
                subtitle={this.props.subtitle} avatar={this.props.avatar} />
            <Divider />
            <CardText expandable={true}>
                {this.props.children}
            </CardText>
        </Card>
    }
}

export function HalfSection({ title, subtitle, avatar, children }: HalfSectionProps & { children: React.ReactNode }) {
    return <Section title={title} subtitle={subtitle} avatar={avatar} className="section-half-size">
        {children}
    </Section>
}
