import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginUser } from '../../store/slices/authSlice';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress,
  IconButton,
  InputAdornment
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

const Login = () => {
  // State management
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Hooks
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Form handlers
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError(''); // Clear error when user types
  };

  const handleTogglePassword = () => {
    setShowPassword(prev => !prev);
  };

  const validateForm = () => {
    if (!formData.username.trim()) {
      setError('Username is required');
      return false;
    }
    if (!formData.password) {
      setError('Password is required');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      setLoading(true);
      setError('');

      console.log('🔐 Attempting login with username:', formData.username);
      const result = await dispatch(loginUser(formData)).unwrap();
      
      console.log('✅ Login successful:', result);
      navigate('/dashboard');
      
    } catch (err) {
      console.error('❌ Login error:', err);
      
      if (err.includes('not found')) {
        setError('Account not found. Would you like to register?');
      } else if (err.includes('password')) {
        setError('Invalid password. Please try again.');
      } else {
        setError('Login failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="xs">
      <Box
        sx={{
          mt: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        <Paper 
          elevation={3}
          sx={{ 
            p: 4, 
            width: '100%',
            borderRadius: 2,
            backgroundColor: 'background.paper'
          }}
        >
          <Typography 
            component="h1" 
            variant="h5" 
            align="center" 
            gutterBottom
            sx={{ fontWeight: 'bold' }}
          >
            Welcome Back
          </Typography>
          
          {error && (
            <Alert 
              severity="error" 
              sx={{ mb: 2 }}
              action={
                error.includes('register') && (
                  <Button 
                    color="inherit" 
                    size="small" 
                    component={Link} 
                    to="/register"
                  >
                    Register Now
                  </Button>
                )
              }
            >
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username"
              name="username"
              autoComplete="username"
              autoFocus
              value={formData.username}
              onChange={handleChange}
              error={!!error && error.includes('Username')}
              disabled={loading}
            />
            
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              id="password"
              autoComplete="current-password"
              value={formData.password}
              onChange={handleChange}
              error={!!error && error.includes('password')}
              disabled={loading}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleTogglePassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ 
                mt: 3, 
                mb: 2,
                py: 1.5,
                backgroundColor: 'primary.main',
                '&:hover': {
                  backgroundColor: 'primary.dark',
                },
              }}
              disabled={loading}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                'Sign In'
              )}
            </Button>

            <Box sx={{ 
              textAlign: 'center',
              mt: 2 
            }}>
              <Typography variant="body2" color="text.secondary">
                Don't have an account?{' '}
                <Link 
                  to="/register"
                  style={{ 
                    color: 'primary.main',
                    textDecoration: 'none',
                    fontWeight: 'medium'
                  }}
                >
                  Sign up now
                </Link>
              </Typography>
            </Box>
          </form>
        </Paper>
      </Box>
    </Container>
  );
};

export default Login;