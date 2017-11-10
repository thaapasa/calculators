import * as React from "react"
import {Card, CardHeader, CardText} from "material-ui/Card"
import Divider from "material-ui/Divider"

export default class Section extends React.Component<{ className: string, title: string, subtitle: string, avatar: string }, {}> {
    render() {
        return <Card initiallyExpanded={true} className={"section " + (this.props.className || "")}>
            <CardHeader title={this.props.title} actAsExpander={true} showExpandableButton={true}
                        subtitle={this.props.subtitle} avatar={this.props.avatar}/>
            <Divider />
            <CardText expandable={true}>
                { this.props.children }
            </CardText>
        </Card>
    }
}

export function HalfSection({ title, subtitle, avatar, children }: { title: string, subtitle: string, avatar: string, children: any }) {
    return <Section title={title} subtitle={subtitle} avatar={avatar} className="section-half-size">
            { children }
        </Section>
}
