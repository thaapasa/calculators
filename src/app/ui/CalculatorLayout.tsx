import { styled } from '@mui/material';
import React from 'react';
import { Outlet } from 'react-router';

import { LastValue } from './LastValue';
import { NavigationDrawer } from './layout/Drawer';
import { TopBar } from './layout/TopBar';

export function CalculatorLayout() {
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  return (
    <Everything>
      <TopBar onToggleDrawer={() => setDrawerOpen(!drawerOpen)}>
        <LastValue />
      </TopBar>
      {drawerOpen ? <NavigationDrawer onClose={() => setDrawerOpen(false)} /> : null}
      <MainContent>
        <Outlet />
      </MainContent>
    </Everything>
  );
}

const MainContent = styled('div')`
  z-index: 0;
  position: relative;
  max-width: 60em;
  margin: 56px auto auto;
  padding-top: 1px;
  text-align: center;
`;

const Everything = styled('div')`
  position: relative;
`;
