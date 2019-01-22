import { History, Location } from 'history';
import { IconButton, SvgIconProps } from 'material-ui';
import Avatar from 'material-ui/Avatar';
import {
  ActionCode,
  ActionHome,
  ActionPermIdentity,
  ContentLink,
  ContentTextFormat,
  DeviceAccessTime,
  ImageColorLens,
  ImageExposurePlus1,
  NotificationEnhancedEncryption,
} from 'material-ui/svg-icons';
import { Toolbar, ToolbarGroup, ToolbarTitle } from 'material-ui/Toolbar';
import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import { theme } from 'style';
import styled from 'styled-components';

const styles: { [key: string]: React.CSSProperties } = {
  avatar: { marginLeft: '0.7em' },
  titleText: { marginLeft: '0.7em' },
};

interface ToolbarProps {
  onToggleDrawer: () => void;
}

class CalculatorToolbar extends React.Component<
  RouteComponentProps<{}> & ToolbarProps
> {
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
        <ToolbarGroup className="fullsize">
          <Link {...this.props} icon={ActionHome} route="/" tooltip="Kaikki" />
          <Link
            {...this.props}
            icon={DeviceAccessTime}
            route={['/p/aika', '/p/time']}
            tooltip="Aikaleimat"
          />
          <Link
            {...this.props}
            icon={ImageExposurePlus1}
            route={['/p/numerot', '/p/merkit', '/p/symbols']}
            tooltip="Numerot ja merkit"
          />
          <Link
            {...this.props}
            icon={ActionPermIdentity}
            route={['/p/tunnisteet', '/p/identifiers']}
            tooltip="Tunnisteet"
          />
          <Link
            {...this.props}
            icon={ImageColorLens}
            route={['/p/värit', '/p/colors']}
            tooltip="Värit"
          />
          <Link
            {...this.props}
            icon={ActionCode}
            route={['/p/tavukoot', '/p/bytesize', '/p/bytesizes']}
            tooltip="Tavukoot"
          />
          <Link
            {...this.props}
            icon={ContentLink}
            route={['/p/linkit', '/p/links']}
            tooltip="Linkit"
          />
          <Link
            {...this.props}
            icon={ContentTextFormat}
            route={['/p/tekstimuunnokset', '/p/textconversions']}
            tooltip="Tekstimuunnokset"
          />
          <Link
            {...this.props}
            icon={NotificationEnhancedEncryption}
            route={['/p/kryptografia', '/p/cryptography']}
            tooltip="Kryptografia"
          />
        </ToolbarGroup>
        <ToolbarGroup>{this.props.children}</ToolbarGroup>
      </Topbar>
    );
  }
}

export default withRouter(CalculatorToolbar);

class Link extends React.Component<{
  route: string | string[];
  tooltip: string;
  icon: React.ReactType<SvgIconProps>;
  location: Location;
  history: History;
}> {
  render() {
    return (
      <IconButton onClick={this.onClick} tooltip={this.props.tooltip}>
        <this.props.icon
          color={this.selected ? theme.palette!.accent1Color : undefined}
        />
      </IconButton>
    );
  }
  get route(): string {
    return typeof this.props.route === 'string'
      ? this.props.route
      : this.props.route[0] || '';
  }
  get selected(): boolean {
    return typeof this.props.route === 'string'
      ? this.props.location.pathname === this.props.route
      : this.props.route.find(r => this.props.location.pathname === r) !==
          undefined;
  }
  onClick = () => {
    this.props.history.push(this.route);
  };
}

const Topbar = styled(Toolbar)`
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  z-index: 1;
`;
