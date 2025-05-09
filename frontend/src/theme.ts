import { createTheme, styled } from '@mui/material/styles';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';

const ROOT_WIDTH = 1012;

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#8B6B4E',
    },
    secondary: {
      main: '#D2B48C',
    },
    text: {
      primary: '#EFEBE9',
      secondary: '#D7CCC8',
    },
  },
  components: {
    MuiContainer: {
      styleOverrides: {
        root: () => ({
          '&.MuiContainer-maxWidthMd': {
            maxWidth: ROOT_WIDTH,
          },
        }),
      },
    },
  },
});

export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#545a64',
    },
    secondary: {
      main: '#bb8653',
    },
    background: {
      default: '#fdf9f6',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#2E3A47',
      secondary: '#5C6B7A',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: ({ theme }) => ({
          '&.MuiButton-text:hover': {
            backgroundColor: theme.palette.action.selected,
          },
          '&.MuiButton-outlinedSizeMedium:hover': {
            backgroundColor: theme.palette.action.selected,
          },
        }),
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: ({ theme }) => ({
          '&.MuiIconButton-sizeLarge:hover': {
            backgroundColor: theme.palette.action.selected,
          },
        }),
      },
    },
    MuiContainer: {
      styleOverrides: {
        root: () => ({
          '&.MuiContainer-maxWidthMd': {
            maxWidth: ROOT_WIDTH,
          },
        }),
      },
    },
  },
});

export const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.action.focus,
    fontSize: 14,
    fontWeight: 'bold',
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));
