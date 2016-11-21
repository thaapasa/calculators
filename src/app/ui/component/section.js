import React from "react"
import {Card, CardHeader, CardText} from 'material-ui/Card';
import Divider from 'material-ui/Divider';

export default class Section extends React.Component {
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

export function HalfSection(props) {
    return <Section title={props.title} subtitle={props.subtitle} avatar={props.avatar} className="section-half-size">
            { props.children }
        </Section>
}
