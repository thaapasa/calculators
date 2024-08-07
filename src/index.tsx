import { ThemeProvider } from '@mui/material';
import { AppRouterProvider } from 'app/ui/routes';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { theme } from 'style';

import { assertDefined, fixConsole } from './app/util/util';

// Ensure that there is a console
fixConsole();

const container = document.getElementById('root');
assertDefined(container);

ReactDOM.createRoot(container).render(
  <ThemeProvider theme={theme}>
    <AppRouterProvider />
  </ThemeProvider>,
);
