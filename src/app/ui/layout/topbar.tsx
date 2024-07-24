import {
  AccessTime,
  Code,
  ColorLens,
  EnhancedEncryption,
  Exposure,
  Home,
  Link as LinkIcon,
  PermIdentity,
  TextFormat,
} from '@mui/icons-material';
import { AppBar, IconButton, styled, SvgIconProps, Toolbar, Typography } from '@mui/material';
import { History, Location } from 'history';
import React from 'react';

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
            <Link {...this.props} icon={Home} route="/" tooltip="Kaikki" />
            <Link
              {...this.props}
              icon={AccessTime}
              route={['/p/aika', '/p/time']}
              tooltip="Aikaleimat"
            />
            <Link
              {...this.props}
              icon={Exposure}
              route={['/p/numerot', '/p/merkit', '/p/symbols']}
              tooltip="Numerot ja merkit"
            />
            <Link
              {...this.props}
              icon={PermIdentity}
              route={['/p/tunnisteet', '/p/identifiers']}
              tooltip="Tunnisteet"
            />
            <Link
              {...this.props}
              icon={ColorLens}
              route={['/p/värit', '/p/colors']}
              tooltip="Värit"
            />
            <Link
              {...this.props}
              icon={Code}
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
              icon={TextFormat}
              route={['/p/tekstimuunnokset', '/p/textconversions']}
              tooltip="Tekstimuunnokset"
            />
            <Link
              {...this.props}
              icon={EnhancedEncryption}
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

const Flex = styled('div')`
  display: inline-flex;
  flex: 1;
  justify-content: flex-start;
  &.right {
    justify-content: flex-end;
  }
`;

const FullWidthOnly = styled('div')`
  @media (max-width: 63em) {
    display: none;
  }
`;

export default withRouter(CalculatorToolbar);

class Link extends React.Component<{
  route: string | string[];
  tooltip: string;
  icon: React.ComponentType<SvgIconProps>;
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
