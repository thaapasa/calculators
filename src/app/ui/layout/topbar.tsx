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
import React from 'react';
import { useLocation, useNavigate } from 'react-router';

import { Logo } from './logo';

interface ToolbarProps {
  onToggleDrawer: () => void;
}

const TopLogo = styled(Logo)`
  margin-right: 16px;
`;

export function TopBar({ onToggleDrawer, children }: React.PropsWithChildren<ToolbarProps>) {
  return (
    <AppBar>
      <Toolbar>
        <Flex>
          <TopLogo onClick={onToggleDrawer} />
          <Typography variant="h6" color="inherit">
            Laskurit
          </Typography>
        </Flex>
        <FullWidthOnly>
          <Link icon={Home} route="/" tooltip="Kaikki" />
          <Link icon={AccessTime} route={['/p/aika', '/p/time']} tooltip="Aikaleimat" />
          <Link
            icon={Exposure}
            route={['/p/numerot', '/p/merkit', '/p/symbols']}
            tooltip="Numerot ja merkit"
          />
          <Link
            icon={PermIdentity}
            route={['/p/tunnisteet', '/p/identifiers']}
            tooltip="Tunnisteet"
          />
          <Link icon={ColorLens} route={['/p/värit', '/p/colors']} tooltip="Värit" />
          <Link
            icon={Code}
            route={['/p/tavukoot', '/p/bytesize', '/p/bytesizes']}
            tooltip="Tavukoot"
          />
          <Link icon={LinkIcon} route={['/p/linkit', '/p/links']} tooltip="Linkit" />
          <Link
            icon={TextFormat}
            route={['/p/tekstimuunnokset', '/p/textconversions']}
            tooltip="Tekstimuunnokset"
          />
          <Link
            icon={EnhancedEncryption}
            route={['/p/kryptografia', '/p/cryptography']}
            tooltip="Kryptografia"
          />
        </FullWidthOnly>
        <Flex className="right">{children}</Flex>
      </Toolbar>
    </AppBar>
  );
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

interface LinkProps {
  route: string | string[];
  tooltip: string;
  icon: React.ComponentType<SvgIconProps>;
}

function Link({ route, icon: Icon, tooltip }: LinkProps) {
  const navigate = useNavigate();
  const onClick = () => {
    navigate(Array.isArray(route) ? route[0] : route);
  };
  const location = useLocation();
  const selected =
    typeof route === 'string'
      ? location.pathname === route
      : route.find(r => location.pathname === r) !== undefined;
  return (
    <IconButton onClick={onClick} color={selected ? 'inherit' : 'default'} title={tooltip}>
      <Icon />
    </IconButton>
  );
}
