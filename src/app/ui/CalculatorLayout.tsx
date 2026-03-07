import React from 'react';
import { Outlet } from 'react-router';

import { LastValue } from './LastValue';
import { NavigationDrawer } from './layout/Drawer';
import { TopBar } from './layout/TopBar';

export function CalculatorLayout() {
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  return (
    <div className="relative">
      <TopBar onToggleDrawer={() => setDrawerOpen(!drawerOpen)}>
        <LastValue />
      </TopBar>
      {drawerOpen ? <NavigationDrawer onClose={() => setDrawerOpen(false)} /> : null}
      <div className="relative z-0 max-w-[960px] mx-auto mt-14 pt-px text-center">
        <Outlet />
      </div>
    </div>
  );
}
