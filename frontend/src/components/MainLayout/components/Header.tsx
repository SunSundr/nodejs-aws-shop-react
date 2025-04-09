import { useState } from 'react';
import { useAuth } from 'react-oidc-context';
import { Link as RouterLink } from 'react-router-dom';
import AccountCircle from '@mui/icons-material/AccountCircle';
import Check from '@mui/icons-material/Check';
import ColorLensIcon from '@mui/icons-material/ColorLens';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead';
import ProductionQuantityLimitsIcon from '@mui/icons-material/ProductionQuantityLimits';
import RuleIcon from '@mui/icons-material/Rule';
import AppBar from '@mui/material/AppBar';
import Divider from '@mui/material/Divider';
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
import { LOGOUT_URL } from '~/constants/apiPaths';
import { STORE_NAME } from '~/constants/common';
import { useAuthTask8 } from '~/models/authTask8';
import emojiLogin from '~/utils/emoji';

type HeaderProps = {
  themeSwitch: (v: 'dark' | 'light') => void;
  isDarkMode: boolean;
};

const emoji = emojiLogin[Math.floor(Math.random() * emojiLogin.length)];

export default function Header({ themeSwitch, isDarkMode }: HeaderProps) {
  const [anchorAuthEl, setAuthAnchorEl] = useState<null | HTMLElement>(null);
  const [anchorThemeEl2, setThemeAnchorEl] = useState<null | HTMLElement>(null);
  const auth = useAuth();
  const isLogin = auth.isAuthenticated;
  const isAdmin = isLogin && (auth.user?.profile['custom:admin'] as boolean);

  const userNameTask8 = localStorage.getItem('sunsundr_store_username');

  const truncateString = (str: string, limit = 50) => {
    return str.length > limit ? str.slice(0, limit) + '...' : str;
  };

  const menuPartTask8 = () => {
    const isLoginTask8 = useAuthTask8();
    return isLoginTask8 ? (
      <MenuItem
        onClick={() => {
          localStorage.removeItem('authorization_token');
          localStorage.removeItem('sunsundr_store_username');
          handleAuthMenuClose();
          setTimeout(() => {
            window.location.href = window.location.origin;
          }, 100);
        }}
      >
        <ListItemIcon>
          <LogoutIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText>Logout (Task 8)</ListItemText>
      </MenuItem>
    ) : (
      <MenuItem component={RouterLink} to="/signin" onClick={() => handleAuthMenuClose()}>
        <ListItemIcon>
          <LoginIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText>Login (Task 8)</ListItemText>
      </MenuItem>
    );
  };

  const signOutRedirect = () => {
    setTimeout(() => {
      // auth.removeUser();
      localStorage.setItem('removeUser', 'true');
      window.location.href = LOGOUT_URL;
    }, 0);
  };

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

        <Typography sx={{ flexGrow: 1 }}>
          {userNameTask8 && truncateString(`${emoji}\u00A0Hello,\u00A0${userNameTask8}!`)}
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

        <Tooltip title="Subscribe">
          <IconButton
            aria-label="subscribe"
            color="inherit"
            size="large"
            component={RouterLink}
            to="/subscribe"
          >
            <MarkEmailReadIcon />
          </IconButton>
        </Tooltip>

        <div>
          <Tooltip
            title={isLogin ? `${isAdmin ? 'Admin' : 'User'}: ${auth.user?.profile.email}` : 'User'}
          >
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
            {isLogin ? (
              <MenuList
                sx={{ padding: 0 }}
                onMouseLeave={() => (isAdmin ? handleAuthMenuClose() : null)}
              >
                {isAdmin && (
                  <MenuItem component={RouterLink} to="/admin/orders" onClick={handleAuthMenuClose}>
                    <ListItemIcon>
                      <RuleIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Manage orders</ListItemText>
                  </MenuItem>
                )}
                {isAdmin && (
                  <MenuItem
                    component={RouterLink}
                    to="/admin/products"
                    onClick={handleAuthMenuClose}
                  >
                    <ListItemIcon>
                      <ProductionQuantityLimitsIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Manage products</ListItemText>
                  </MenuItem>
                )}
                {isAdmin && <Divider />}
                <MenuItem onClick={() => signOutRedirect()}>
                  <ListItemIcon>
                    <LogoutIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>Sign Out</ListItemText>
                </MenuItem>
                {menuPartTask8()}
              </MenuList>
            ) : (
              <MenuList sx={{ padding: 0 }}>
                <MenuItem onClick={() => auth.signinRedirect()}>
                  <ListItemIcon>
                    <LoginIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>Sign in</ListItemText>
                </MenuItem>
                {/* temporary solution (task 8) */}
                {menuPartTask8()}
              </MenuList>
            )}
          </Menu>
        </div>
        <Cart />
      </Toolbar>
    </AppBar>
  );
}
