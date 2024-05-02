import { createTheme, Theme } from '@mui/material';

export const lightTheme: Theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#028090',
      dark: '#026673',
      light: '#3599a6',
      contrastText: '#FFFAFA',
    },
    secondary: {
      main: '#00A896',
      dark: '#008678',
      light: '#33b9ab',
      contrastText: '#FFFAFA',
    },
    common: {
      black: '#212121',
      white: '#f1f1f2',
    },
    background: {
      paper: '#F7F7F7',
      default: '#ffffff',
    },
  },
  typography: {
    htmlFontSize: 14,
    fontFamily: 'Roboto',
  },
});
