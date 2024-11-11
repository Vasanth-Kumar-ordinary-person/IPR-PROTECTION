import { 
  Box, 
  Button, 
  Container, 
  Typography, 
  Grid, 
  Paper,
  useTheme,
  alpha,
} from '@mui/material';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ShieldIcon from '@mui/icons-material/Shield';
import SpeedIcon from '@mui/icons-material/Speed';
import StorageIcon from '@mui/icons-material/Storage';

const Home = () => {
  const { user } = useSelector((state) => state.auth);
  const theme = useTheme();

  const features = [
    {
      icon: <ShieldIcon sx={{ fontSize: 40, color: '#1976d2' }} />,
      title: 'Secure Storage',
      description: 'Your patents are protected with advanced encryption and blockchain technology.'
    },
    {
      icon: <SpeedIcon sx={{ fontSize: 40, color: '#1976d2' }} />,
      title: 'Fast Processing',
      description: 'Quick patent filing and verification process with real-time updates.'
    },
    {
      icon: <StorageIcon sx={{ fontSize: 40, color: '#1976d2' }} />,
      title: 'Decentralized',
      description: 'Utilizing blockchain technology for transparent and immutable records.'
    }
  ];

  return (
    <Box 
      sx={{ 
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #e8ecf1 100%)',
        pt: 8
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            pt: 8,
            pb: 6
          }}
        >
          <Typography
            component="h1"
            variant="h1"
            sx={{
              fontSize: '4rem',
              fontWeight: 600,
              color: '#1976d2',
              mb: 3,
              textAlign: 'center'
            }}
          >
            Blockchain Patent System
          </Typography>

          <Typography
            variant="h5"
            sx={{ 
              color: '#666',
              maxWidth: 800,
              textAlign: 'center',
              mb: 6,
              mx: 'auto',
              px: 2
            }}
          >
            Secure your innovations with cutting-edge blockchain technology. 
            Our platform provides transparent, immutable, and efficient patent management.
          </Typography>

          {!user && (
            <Box sx={{ 
              display: 'flex',
              gap: 2,
              mb: 8
            }}>
              <Button
                component={Link}
                to="/register"
                variant="contained"
                size="large"
                sx={{
                  px: 4,
                  py: 1.5,
                  fontSize: '1rem',
                  bgcolor: '#1976d2',
                  '&:hover': {
                    bgcolor: '#1565c0'
                  }
                }}
              >
                GET STARTED
              </Button>
              <Button
                component={Link}
                to="/login"
                variant="outlined"
                size="large"
                sx={{
                  px: 4,
                  py: 1.5,
                  fontSize: '1rem',
                  color: '#1976d2',
                  borderColor: '#1976d2',
                  '&:hover': {
                    borderColor: '#1565c0',
                    bgcolor: 'transparent'
                  }
                }}
              >
                SIGN IN
              </Button>
            </Box>
          )}

          <Grid container spacing={4} justifyContent="center">
            {features.map((feature, index) => (
              <Grid item xs={12} sm={4} key={index}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 4,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    bgcolor: 'white',
                    borderRadius: 2
                  }}
                >
                  <Box sx={{ mb: 2 }}>
                    {feature.icon}
                  </Box>
                  <Typography 
                    variant="h6" 
                    component="h2"
                    sx={{ 
                      mb: 2,
                      fontWeight: 600,
                      color: '#333'
                    }}
                  >
                    {feature.title}
                  </Typography>
                  <Typography 
                    variant="body1"
                    sx={{ 
                      color: '#666',
                      lineHeight: 1.6
                    }}
                  >
                    {feature.description}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
    </Box>
  );
};

export default Home;