import {
  createTheme as createMuiTheme,
  responsiveFontSizes,
  ThemeOptions,
} from '@mui/material/styles';

const createTheme = () => {
  const themeOptions: ThemeOptions = {
    palette: {
      mode: 'light',
      primary: {
        main: '#1976d2',
      },
      secondary: {
        main: '#dc004e',
      },
    },
    typography: {
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    },
  };

  let theme = createMuiTheme(themeOptions, {
    direction: 'ltr',
  });

  theme = responsiveFontSizes(theme);

  return theme;
};

export default createTheme;
