import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  TextField,
  Box,
} from '@mui/material';
import { Visibility, Search } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { getAllPatents } from '../store/slices/patentSlice';

const Patents = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [search, setSearch] = useState('');
  const [patents, setPatents] = useState([]);

  useEffect(() => {
    dispatch(getAllPatents());
  }, [dispatch]);

  // Add console.log to debug
  const handleFileNewPatent = () => {
    console.log('Navigating to /patents/new');
    navigate('/patents/new');
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
              <Typography variant="h4">Patents</Typography>
              {/* Update the button to have an onClick handler */}
              <Button
                variant="contained"
                color="primary"
                onClick={handleFileNewPatent}
                sx={{ textTransform: 'none' }}
              >
                File New Patent
              </Button>
            </Box>

            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search patents..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              InputProps={{
                startAdornment: <Search color="action" sx={{ mr: 1 }} />,
              }}
              sx={{ mb: 3 }}
            />

            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Title</TableCell>
                    <TableCell>Filing Date</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {patents.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} align="center">
                        No patents found
                      </TableCell>
                    </TableRow>
                  ) : (
                    patents.map((patent) => (
                      <TableRow key={patent._id}>
                        <TableCell>{patent.title}</TableCell>
                        <TableCell>
                          {new Date(patent.filingDate).toLocaleDateString()}
                        </TableCell>
                        <TableCell>{patent.status}</TableCell>
                        <TableCell>
                          <IconButton
                            onClick={() => navigate(`/patents/${patent._id}`)}
                          >
                            <Visibility />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Patents;