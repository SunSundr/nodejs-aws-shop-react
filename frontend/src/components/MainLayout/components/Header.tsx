import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import AccountCircle from '@mui/icons-material/AccountCircle';
import Check from '@mui/icons-material/Check';
import ColorLensIcon from '@mui/icons-material/ColorLens';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import ProductionQuantityLimitsIcon from '@mui/icons-material/ProductionQuantityLimits';
import RuleIcon from '@mui/icons-material/Rule';
import AppBar from '@mui/material/AppBar';
import IconButton from '@mui/material/IconButton';
import Link from '@mui/material/Link';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import Toolbar from '@mui/material/Toolbar';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import Cart from '~/components/MainLayout/components/Cart';
import { STORE_NAME } from '~/constants/common';

type HeaderProps = {
  themeSwitch: (v: 'dark' | 'light') => void;
  isDarkMode: boolean;
};

export default function Header({ themeSwitch, isDarkMode }: HeaderProps) {
  const [anchorAuthEl, setAuthAnchorEl] = useState<null | HTMLElement>(null);
  const [anchorThemeEl2, setThemeAnchorEl] = useState<null | HTMLElement>(null);
  const auth = true;

  const handleAuthMenuClose = () => setAuthAnchorEl(null);
  const handleThemeMenuClose = () => setThemeAnchorEl(null);

  return (
    <AppBar position="relative">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          <Link
            component={RouterLink}
            sx={{ color: 'inherit', textShadow: '1px 1px rgb(29, 29, 29)' }}
            underline="none"
            to="/"
          >
            {STORE_NAME}
          </Link>
        </Typography>

        <div>
          <Tooltip title="Theme">
            <IconButton
              aria-label="account of current user"
              aria-controls="menu-theme"
              aria-haspopup="true"
              onClick={(event) => setThemeAnchorEl(event.currentTarget)}
              color="inherit"
              size="large"
            >
              <ColorLensIcon />
            </IconButton>
          </Tooltip>
          <Menu
            id="menu-theme"
            anchorEl={anchorThemeEl2}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={!!anchorThemeEl2}
            onClose={handleThemeMenuClose}
          >
            <MenuList sx={{ width: 160, padding: 0 }} onMouseLeave={handleThemeMenuClose}>
              <MenuItem onClick={() => themeSwitch('light')}>
                <ListItemIcon>
                  <LightModeOutlinedIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Light</ListItemText>
                {!isDarkMode && (
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    <Check fontSize="small" />
                  </Typography>
                )}
              </MenuItem>
              <MenuItem onClick={() => themeSwitch('dark')}>
                <ListItemIcon>
                  <DarkModeIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Dark</ListItemText>
                {isDarkMode && (
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    <Check fontSize="small" />
                  </Typography>
                )}
              </MenuItem>
            </MenuList>
          </Menu>
        </div>

        {auth && (
          <div>
            <Tooltip title="Admin Menu">
              <IconButton
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={(event) => setAuthAnchorEl(event.currentTarget)}
                color="inherit"
                size="large"
              >
                <AccountCircle />
              </IconButton>
            </Tooltip>
            <Menu
              id="menu-appbar"
              anchorEl={anchorAuthEl}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={!!anchorAuthEl}
              onClose={handleAuthMenuClose}
            >
              <MenuList sx={{ padding: 0 }} onMouseLeave={handleAuthMenuClose}>
                <MenuItem component={RouterLink} to="/admin/orders" onClick={handleAuthMenuClose}>
                  <ListItemIcon>
                    <RuleIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>Manage orders</ListItemText>
                </MenuItem>
                <MenuItem component={RouterLink} to="/admin/products" onClick={handleAuthMenuClose}>
                  <ListItemIcon>
                    <ProductionQuantityLimitsIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>Manage products</ListItemText>
                </MenuItem>
              </MenuList>
            </Menu>
          </div>
        )}
        <Cart />
      </Toolbar>
    </AppBar>
  );
}
