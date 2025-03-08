import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import Link from '@mui/material/Link';
import { ThemeProvider } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import Header from '~/components/MainLayout/components/Header';
import { STORE_NAME } from '~/constants/common';
import { darkTheme, lightTheme } from '~/theme';

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
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
  const getCurrentTheme = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const [isDarkMode, setIsDarkMode] = useState(getCurrentTheme);
  return (
    <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
      <CssBaseline enableColorScheme />
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <title>{STORE_NAME.replace(/[^a-zA-Z]+/g, ' ')}</title>
        <Header isDarkMode={isDarkMode} themeSwitch={(t: string) => setIsDarkMode(t === 'dark')} />
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
          <Typography variant="subtitle1" align="center" color="textSecondary" component="p">
            Thank you for your purchase!
          </Typography>
          <Copyright />
        </Box>
      </div>
    </ThemeProvider>
  );
};

export default MainLayout;
