import { createMuiTheme } from '@material-ui/core/styles';

export const theme = createMuiTheme({
  palette: {
    primary: {
      main: 'rgb(232, 232, 232)',
    },
    secondary: {
      main: 'rgb(244, 67, 54)',
    },
  },
  typography: {
    useNextVariants: true,
  },
});
