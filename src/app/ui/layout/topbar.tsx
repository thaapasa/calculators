import { AppBar, IconButton, Typography } from '@material-ui/core';
import { SvgIconProps } from '@material-ui/core/SvgIcon';
import Toolbar from '@material-ui/core/Toolbar';
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import CodeIcon from '@material-ui/icons/Code';
import ColorLensIcon from '@material-ui/icons/ColorLens';
import EnhancedEncryptionIcon from '@material-ui/icons/EnhancedEncryption';
import ExposurePlus1Icon from '@material-ui/icons/ExposurePlus1';
import HomeIcon from '@material-ui/icons/Home';
import LinkIcon from '@material-ui/icons/Link';
import PermIdentityIcon from '@material-ui/icons/PermIdentity';
import TextFormatIcon from '@material-ui/icons/TextFormat';
import { History, Location } from 'history';
import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import styled from 'styled-components';

import { Logo } from './logo';

interface ToolbarProps {
  onToggleDrawer: () => void;
}

const TopLogo = styled(Logo)`
  margin-right: 16px;
`;

class CalculatorToolbar extends React.Component<RouteComponentProps & ToolbarProps> {
  public render() {
    return (
      <AppBar>
        <Toolbar>
          <Flex>
            <TopLogo onClick={this.props.onToggleDrawer} />
            <Typography variant="h6" color="inherit">
              Laskurit
            </Typography>
          </Flex>
          <FullWidthOnly>
            <Link {...this.props} icon={HomeIcon} route="/" tooltip="Kaikki" />
            <Link
              {...this.props}
              icon={AccessTimeIcon}
              route={['/p/aika', '/p/time']}
              tooltip="Aikaleimat"
            />
            <Link
              {...this.props}
              icon={ExposurePlus1Icon}
              route={['/p/numerot', '/p/merkit', '/p/symbols']}
              tooltip="Numerot ja merkit"
            />
            <Link
              {...this.props}
              icon={PermIdentityIcon}
              route={['/p/tunnisteet', '/p/identifiers']}
              tooltip="Tunnisteet"
            />
            <Link
              {...this.props}
              icon={ColorLensIcon}
              route={['/p/värit', '/p/colors']}
              tooltip="Värit"
            />
            <Link
              {...this.props}
              icon={CodeIcon}
              route={['/p/tavukoot', '/p/bytesize', '/p/bytesizes']}
              tooltip="Tavukoot"
            />
            <Link
              {...this.props}
              icon={LinkIcon}
              route={['/p/linkit', '/p/links']}
              tooltip="Linkit"
            />
            <Link
              {...this.props}
              icon={TextFormatIcon}
              route={['/p/tekstimuunnokset', '/p/textconversions']}
              tooltip="Tekstimuunnokset"
            />
            <Link
              {...this.props}
              icon={EnhancedEncryptionIcon}
              route={['/p/kryptografia', '/p/cryptography']}
              tooltip="Kryptografia"
            />
          </FullWidthOnly>
          <Flex className="right">{this.props.children}</Flex>
        </Toolbar>
      </AppBar>
    );
  }
}

const Flex = styled.div`
  display: inline-flex;
  flex: 1;
  justify-content: flex-start;
  &.right {
    justify-content: flex-end;
  }
`;

const FullWidthOnly = styled.div`
  @media (max-width: 63em) {
    display: none;
  }
`;

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
      <IconButton onClick={this.onClick} color={this.selected ? 'inherit' : 'default'}>
        <this.props.icon />
      </IconButton>
    );
  }
  get route(): string {
    return typeof this.props.route === 'string' ? this.props.route : this.props.route[0] || '';
  }
  get selected(): boolean {
    return typeof this.props.route === 'string'
      ? this.props.location.pathname === this.props.route
      : this.props.route.find(r => this.props.location.pathname === r) !== undefined;
  }
  onClick = () => {
    this.props.history.push(this.route);
  };
}
