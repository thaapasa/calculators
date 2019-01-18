import Avatar from 'material-ui/Avatar';
import { Toolbar, ToolbarGroup, ToolbarTitle } from 'material-ui/Toolbar';
import React from 'react';
import styled from 'styled-components';

const styles: { [key: string]: React.CSSProperties } = {
  avatar: { marginLeft: '0.7em' },
  titleText: { marginLeft: '0.7em' },
};

interface ToolbarProps {
  onToggleDrawer: () => void;
}

export default class CalculatorToolbar extends React.Component<ToolbarProps> {
  public render() {
    return (
      <Topbar noGutter={false}>
        <ToolbarGroup firstChild={true}>
          <Avatar
            src="img/calculators.png"
            style={styles.avatar}
            onClick={this.props.onToggleDrawer}
          />
          <ToolbarTitle text="Laskurit" style={styles.titleText} />
        </ToolbarGroup>
        <ToolbarGroup>{this.props.children}</ToolbarGroup>
      </Topbar>
    );
  }
}

const Topbar = styled(Toolbar)`
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  z-index: 1;
`;
