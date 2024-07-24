import { ThemeProvider } from '@mui/material';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { theme } from 'style';

import CalculatorPage from './app/ui/calculatorpage';
import { assertDefined, fixConsole } from './app/util/util';

// Ensure that there is a console
fixConsole();

const container = document.getElementById('root');
assertDefined(container);

ReactDOM.createRoot(container).render(
  <ThemeProvider theme={theme}>
    <CalculatorPage />
  </ThemeProvider>,
);
