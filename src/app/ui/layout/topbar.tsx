import * as React from 'react'
import { Toolbar, ToolbarGroup, ToolbarTitle } from 'material-ui/Toolbar'
import Avatar from 'material-ui/Avatar'

const styles: { [key: string]: React.CSSProperties } = {
    avatar: { marginLeft: '0.7em' },
    titleText: { marginLeft: '0.7em' },
}

export default class CalculatorToolbar extends React.Component<{}, {}> {
    public render() {
        return (
            <Toolbar className="topbar">
                <ToolbarGroup firstChild={true}>
                    <Avatar src="img/calculators.png" style={styles.avatar} />
                    <ToolbarTitle text="Laskurit" style={styles.titleText} />
                </ToolbarGroup>
                <ToolbarGroup>
                    {this.props.children}
                </ToolbarGroup>
            </Toolbar>
        )
    }
}
