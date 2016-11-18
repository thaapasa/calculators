import React from "react"
import {Toolbar, ToolbarGroup, ToolbarTitle} from "material-ui/Toolbar"
import Avatar from "material-ui/Avatar"

const styles = {
    avatar: { marginLeft: "0.7em" },
    titleText: { marginLeft: "0.7em" }
}

export default class ToolbarExamplesSimple extends React.Component {

    constructor(props) {
        super(props)
    }

    render() {
        return (
            <Toolbar className="topbar">
                <ToolbarGroup firstChild={true}>
                    <Avatar src="img/calculators.png" style={styles.avatar} />
                    <ToolbarTitle text="Laskurit" style={styles.titleText} />
                </ToolbarGroup>
                <ToolbarGroup>
                    { this.props.children }
                </ToolbarGroup>
            </Toolbar>
        )
    }
}
