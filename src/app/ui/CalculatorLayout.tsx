import React from 'react';
import { Outlet } from 'react-router';

import { ThemeProvider } from '../util/ThemeContext';
import { LastValue } from './LastValue';
import { NavigationDrawer } from './layout/Drawer';
import { ThemeToggle } from './layout/ThemeToggle';
import { TopBar } from './layout/TopBar';

export function CalculatorLayout() {
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  return (
    <ThemeProvider>
      <div className="relative">
        <TopBar onToggleDrawer={() => setDrawerOpen(!drawerOpen)}>
          <ThemeToggle />
          <LastValue />
        </TopBar>
        {drawerOpen ? <NavigationDrawer onClose={() => setDrawerOpen(false)} /> : null}
        <div className="relative z-0 max-w-[960px] mx-auto mt-14 pt-px text-center">
          <Outlet />
        </div>
      </div>
    </ThemeProvider>
  );
}
