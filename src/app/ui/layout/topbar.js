import React from "react"
import {Toolbar, ToolbarGroup} from "material-ui/Toolbar"
import Avatar from "material-ui/Avatar"
import Chip from "material-ui/Chip"

const styles = {
    chip: { marginLeft: "0.7em" }
}

export default class ToolbarExamplesSimple extends React.Component {

    constructor(props) {
        super(props)
    }

    render() {
        return (
            <Toolbar className="topbar">
                <ToolbarGroup firstChild={true}>
                    <Chip style={styles.chip}>
                        <Avatar src="img/calculators.png" />
                        Laskurit
                    </Chip>
                </ToolbarGroup>
                <ToolbarGroup>
                    { this.props.children }
                </ToolbarGroup>
            </Toolbar>
        )
    }
}
