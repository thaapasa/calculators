import React from "react"
import {Card, CardHeader, CardText} from 'material-ui/Card';
import Divider from 'material-ui/Divider';

export default class Section extends React.Component {
    render() {
        return <Card initiallyExpanded={true}>
            <CardHeader title={this.props.title} actAsExpander={true} showExpandableButton={true} />
            <Divider />
            <CardText expandable={true}>
                { this.props.children }
            </CardText>
        </Card>
    }
}

Section.defaultProps = {
    bgClass: "bg-teal"
}
