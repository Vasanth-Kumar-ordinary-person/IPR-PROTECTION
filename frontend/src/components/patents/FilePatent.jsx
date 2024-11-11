import { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Alert,
  CircularProgress
} from '@mui/material';
import { patentService } from '../../services/patent.service';

const FilePatentForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    file: null
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    setFormData(prev => ({
      ...prev,
      file: e.target.files[0]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('file', formData.file);

      const response = await patentService.filePatent(formDataToSend);
      setFormData({ title: '', description: '', file: null });
      if (onSuccess) onSuccess(response);
    } catch (err) {
      setError(err.message || 'Error filing patent');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        File New Patent
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Patent Title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          margin="normal"
        />

        <TextField
          fullWidth
          label="Description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
          multiline
          rows={4}
          margin="normal"
        />

        <Box sx={{ my: 2 }}>
          <input
            accept="*/*"
            style={{ display: 'none' }}
            id="patent-file"
            type="file"
            onChange={handleFileChange}
            required
          />
          <label htmlFor="patent-file">
            <Button variant="outlined" component="span">
              Upload File
            </Button>
          </label>
          {formData.file && (
            <Typography variant="body2" sx={{ mt: 1 }}>
              Selected file: {formData.file.name}
            </Typography>
          )}
        </Box>

        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={loading}
          fullWidth
        >
          {loading ? <CircularProgress size={24} /> : 'File Patent'}
        </Button>
      </form>
    </Paper>
  );
};

FilePatentForm.propTypes = {
  onSuccess: PropTypes.func
};

export default FilePatentForm;