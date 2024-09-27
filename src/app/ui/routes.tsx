import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import { ByteSizesPage } from './ByteSizesPage';
import { CalculatorLayout } from './CalculatorLayout';
import { ColorsPage } from './ColorsPage';
import { CryptographyPage } from './CryptographyPage';
import { IdentifiersPage } from './IdentifiersPage';
import { LinksPage } from './LinksPage';
import { NumbersPage } from './NumbersPage';
import { SinglePageLayout } from './SinglePageLayout';
import { TextConversionPage } from './TextConversionPage';
import { TimePage } from './TimePage';

const router = createBrowserRouter([
  {
    element: <CalculatorLayout />,
    children: [
      { path: '/p/aika', element: <TimePage /> },
      { path: '/p/time', element: <TimePage /> },
      { path: '/p/merkit', element: <NumbersPage /> },
      { path: '/p/numerot', element: <NumbersPage /> },
      { path: '/p/symbols', element: <NumbersPage /> },
      { path: '/p/tunnisteet', element: <IdentifiersPage /> },
      { path: '/p/identifiers', element: <IdentifiersPage /> },
      { path: '/p/värit', element: <ColorsPage /> },
      { path: '/p/colors', element: <ColorsPage /> },
      { path: '/p/tavukoot', element: <ByteSizesPage /> },
      { path: '/p/bytesize', element: <ByteSizesPage /> },
      { path: '/p/bytesizes', element: <ByteSizesPage /> },
      { path: '/p/linkit', element: <LinksPage /> },
      { path: '/p/links', element: <LinksPage /> },
      { path: '/p/tekstimuunnokset', element: <TextConversionPage /> },
      { path: '/p/textconversions', element: <TextConversionPage /> },
      { path: '/p/kryptografia', element: <CryptographyPage /> },
      { path: '/p/cryptography', element: <CryptographyPage /> },
      { index: true, element: <SinglePageLayout /> },
    ],
  },
]);

export function AppRouterProvider() {
  return <RouterProvider router={router} />;
}
