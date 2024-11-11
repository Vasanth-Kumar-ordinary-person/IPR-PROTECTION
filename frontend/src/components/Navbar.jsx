import { AppBar, Toolbar, Typography, Button, Box, Avatar } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/slices/authSlice';

const Navbar = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography
          variant="h6"
          component={Link}
          to="/"
          sx={{ 
            flexGrow: 1, 
            textDecoration: 'none', 
            color: 'inherit' 
          }}
        >
          Patent System
        </Typography>

        {user ? (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{ bgcolor: 'secondary.main' }}>
              {user.username.charAt(0).toUpperCase()}
            </Avatar>
            <Typography variant="subtitle1">
              {user.username}
            </Typography>
            <Button 
              color="inherit" 
              onClick={handleLogout}
            >
              Logout
            </Button>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button 
              color="inherit" 
              component={Link} 
              to="/login"
            >
              Login
            </Button>
            <Button 
              color="inherit" 
              component={Link} 
              to="/register"
              variant="outlined"
            >
              Register
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;