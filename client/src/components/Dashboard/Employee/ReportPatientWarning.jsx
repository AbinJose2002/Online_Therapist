import React, { useState, useEffect } from 'react';
import {
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
  Stack
} from '@mui/material';
import { motion } from 'framer-motion';

const ReportPatientWarning = () => {
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState('');
  const [reason, setReason] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8080/api/employee/my-patients', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('empToken')}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch patients');
      }

      const data = await response.json();
      
      // Ensure data is an array
      if (!Array.isArray(data)) {
        console.error('Received invalid data format:', data);
        throw new Error('Invalid data format received');
      }

      setPatients(data);
    } catch (error) {
      console.error('Error fetching patients:', error);
      setError(error.message || 'Failed to fetch patients');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const response = await fetch('http://localhost:8080/api/warnings/employee', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('empToken')}`
        },
        body: JSON.stringify({
          patientId: selectedPatient,
          reason,
          description
        })
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        setSelectedPatient('');
        setReason('');
        setDescription('');
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
        <Typography variant="h5" gutterBottom color="primary">
          Report Patient Warning
        </Typography>

        {loading ? (
          <Box display="flex" justifyContent="center" p={3}>
            <CircularProgress />
          </Box>
        ) : (
          <form onSubmit={handleSubmit}>
            <Stack spacing={3}>
              <FormControl fullWidth>
                <InputLabel>Select Patient</InputLabel>
                <Select
                  value={selectedPatient}
                  onChange={(e) => setSelectedPatient(e.target.value)}
                  required
                  label="Select Patient"
                >
                  {Array.isArray(patients) && patients.map((patient) => (
                    <MenuItem key={patient._id} value={patient._id}>
                      {`${patient.firstName} ${patient.lastName}`}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                label="Reason for Warning"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                required
                fullWidth
              />

              <TextField
                label="Detailed Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                multiline
                rows={4}
                fullWidth
              />

              {error && <Alert severity="error">{error}</Alert>}
              {success && (
                <Alert severity="success">
                  Warning submitted successfully
                </Alert>
              )}

              <Button
                type="submit"
                variant="contained"
                disabled={loading}
                sx={{ mt: 2 }}
              >
                {loading ? <CircularProgress size={24} /> : 'Submit Warning'}
              </Button>
            </Stack>
          </form>
        )}
      </Paper>
    </motion.div>
  );
};

export default ReportPatientWarning;
