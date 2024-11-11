import { useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  CircularProgress,
  Alert
} from '@mui/material';
import { patentService } from '../../services/patent.service';

const PatentList = ({ userOnly = false }) => {
  const [patents, setPatents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPatents = async () => {
      try {
        const data = userOnly 
          ? await patentService.getMyPatents()
          : await patentService.getAllPatents();
        setPatents(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPatents();
  }, [userOnly]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={3}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <Grid container spacing={3}>
      {patents.map((patent) => (
        <Grid item xs={12} md={6} key={patent._id}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {patent.title}
              </Typography>
              <Typography color="textSecondary" gutterBottom>
                Filed by: {patent.owner.username}
              </Typography>
              <Typography variant="body2" paragraph>
                {patent.description}
              </Typography>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Chip 
                  label={patent.status}
                  color={
                    patent.status === 'APPROVED' ? 'success' :
                    patent.status === 'REJECTED' ? 'error' :
                    'warning'
                  }
                  size="small"
                />
                <Typography variant="caption">
                  Filed: {new Date(patent.createdAt).toLocaleDateString()}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default PatentList;