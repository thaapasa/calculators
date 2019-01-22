import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import React from 'react';
import ReactDOM from 'react-dom';
import { theme } from 'style';
import CalculatorPage from './app/ui/calculatorpage';
import { fixConsole } from './app/util/util';

// Ensure that there is a console
fixConsole();

ReactDOM.render(
  <MuiThemeProvider muiTheme={theme}>
    <CalculatorPage />
  </MuiThemeProvider>,
  document.getElementById('root')
);
