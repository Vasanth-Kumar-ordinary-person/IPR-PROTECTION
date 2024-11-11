import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Box, Typography, Container, Paper } from '@mui/material';

function PatentDetails() {
  const { id } = useParams();
  const [patent, setPatent] = useState(null);

  useEffect(() => {
    // TODO: Replace with your actual API call
    const fetchPatent = async () => {
      try {
        const response = await fetch(`/api/patents/${id}`);
        const data = await response.json();
        setPatent(data);
      } catch (error) {
        console.error('Error fetching patent:', error);
      }
    };

    fetchPatent();
  }, [id]);

  if (!patent) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
        <Typography variant="h4" gutterBottom>
          {patent.title}
        </Typography>
        <Box sx={{ mt: 2 }}>
          <Typography variant="body1" paragraph>
            {patent.description}
          </Typography>
          <Typography variant="subtitle1">
            Filing Date: {new Date(patent.filingDate).toLocaleDateString()}
          </Typography>
          <Typography variant="subtitle1">
            Status: {patent.status}
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
}

export default PatentDetails;