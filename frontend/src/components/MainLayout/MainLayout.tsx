import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import Link from '@mui/material/Link';
import { ThemeProvider } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import Header from '~/components/MainLayout/components/Header';
import { PREFERS_USER_THEME_KEY, STORE_NAME } from '~/constants/common';
import { darkTheme, lightTheme } from '~/theme';

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center" sx={{ userSelect: 'none' }}>
      {'Copyright © '}
      <Link
        color="inherit"
        href="https://github.com/rolling-scopes-school/nodejs-aws-shop-react"
        underline="hover"
      >
        Rolling Scopes School
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const preferTheme = localStorage.getItem(PREFERS_USER_THEME_KEY);

  const isDarkTheme =
    preferTheme === 'dark' || window.matchMedia('(prefers-color-scheme: dark)').matches;

  if (!preferTheme) localStorage.setItem(PREFERS_USER_THEME_KEY, isDarkTheme ? 'dark' : 'light');

  const [isDarkMode, setIsDarkMode] = useState(isDarkTheme);
  return (
    <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
      <CssBaseline enableColorScheme />
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <title>{STORE_NAME.replace(/[^a-zA-Z]+/g, ' ')}</title>
        <Header
          isDarkMode={isDarkMode}
          themeSwitch={(theme: string) => {
            localStorage.setItem(PREFERS_USER_THEME_KEY, theme);
            setIsDarkMode(theme === 'dark');
          }}
        />
        <main>
          <Container maxWidth="md">
            {/* maxWidth={false} sx={{ maxWidth: 1000 }} */}
            {children}
          </Container>
        </main>

        <Box
          component={'footer'}
          sx={{
            bgcolor: (theme) => theme.palette.background.default,
            py: 4,
            mt: 'auto',
          }}
        >
          <Typography
            variant="subtitle1"
            align="center"
            color="textSecondary"
            component="p"
            sx={{ userSelect: 'none' }}
          >
            Thank you for your purchase!
          </Typography>
          <Copyright />
        </Box>
      </div>
    </ThemeProvider>
  );
};

export default MainLayout;
