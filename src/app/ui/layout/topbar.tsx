import React from 'react'
import { Toolbar, ToolbarGroup, ToolbarTitle } from 'material-ui/Toolbar'
import Avatar from 'material-ui/Avatar'

const styles: { [key: string]: React.CSSProperties } = {
    avatar: { marginLeft: '0.7em' },
    titleText: { marginLeft: '0.7em' },
}

interface ToolbarProps {
    onToggleDrawer: () => void
}

export default class CalculatorToolbar extends React.Component<ToolbarProps> {
    public render() {
        return (
            <Toolbar className="topbar">
                <ToolbarGroup firstChild={true}>
                    <Avatar src="img/calculators.png" style={styles.avatar} onClick={this.props.onToggleDrawer} />
                    <ToolbarTitle text="Laskurit" style={styles.titleText} />
                </ToolbarGroup>
                <ToolbarGroup>
                    {this.props.children}
                </ToolbarGroup>
            </Toolbar>
        )
    }
}
