import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import DateTime from './datetime';

const TimePage = () => <DateTime onValue={() => {}} />;

const router = createBrowserRouter([{ path: '/p/aika', element: <TimePage /> }]);

export function AppRouterProvider() {
  return <RouterProvider router={router} />;
}
