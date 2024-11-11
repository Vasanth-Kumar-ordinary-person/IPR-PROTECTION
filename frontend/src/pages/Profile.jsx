import { useState } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  Box,
} from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { updateProfile } from '../services/auth.service';


const Profile = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    username: user?.username || '',
    email: user?.email || '',
    walletAddress: user?.walletAddress || '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await updateProfile(formData);
      dispatch(loginSuccess({ user: response.data }));
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Error updating profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8} mx="auto">
          <Paper sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
              Profile Settings
            </Typography>

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            {success && (
              <Alert severity="success" sx={{ mb: 2 }}>
                Profile updated successfully!
              </Alert>
            )}

            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Wallet Address"
                name="walletAddress"
                value={formData.walletAddress}
                onChange={handleChange}
                margin="normal"
                disabled
              />

              <Box sx={{ mt: 3 }}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={loading}
                >
                  {loading ? 'Updating...' : 'Update Profile'}
                </Button>
              </Box>
            </form>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Profile; 