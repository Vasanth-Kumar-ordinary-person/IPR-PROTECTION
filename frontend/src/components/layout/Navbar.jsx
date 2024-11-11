import { useSelector, useDispatch } from 'react-redux';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Box,
  Menu,
  MenuItem,
  Avatar,
} from '@mui/material';
import { AccountCircle } from '@mui/icons-material';
import { useState } from 'react';
import { logout } from '../../store/slices/authSlice';

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    dispatch(logout());
    handleClose();
    navigate('/login');
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component={RouterLink} to="/" sx={{ 
          flexGrow: 1, 
          textDecoration: 'none', 
          color: 'inherit' 
        }}>
          IP Protection
        </Typography>

        {isAuthenticated ? (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Button color="inherit" component={RouterLink} to="/dashboard">
              Dashboard
            </Button>
            <Button color="inherit" component={RouterLink} to="/patents">
              Patents
            </Button>
            <IconButton
              size="large"
              onClick={handleMenu}
              color="inherit"
            >
              {user?.avatar ? (
                <Avatar src={user.avatar} sx={{ width: 32, height: 32 }} />
              ) : (
                <AccountCircle />
              )}
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
          </Box>
        ) : (
          <Button color="inherit" component={RouterLink} to="/login">
            Login
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar; 