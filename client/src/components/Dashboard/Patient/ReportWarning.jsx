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

const ReportWarning = () => {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [reason, setReason] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/patient/my-therapists', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('patientToken')}`
        }
      });
      const data = await response.json();
      setEmployees(data);
    } catch (error) {
      setError('Failed to fetch employees');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const response = await fetch('http://localhost:8080/api/warnings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('patientToken')}`
        },
        body: JSON.stringify({
          employeeId: selectedEmployee,
          reason,
          description
        })
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        setSelectedEmployee('');
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
          Report a Warning
        </Typography>

        <form onSubmit={handleSubmit}>
          <Stack spacing={3}>
            <FormControl fullWidth>
              <InputLabel>Select Professional</InputLabel>
              <Select
                value={selectedEmployee}
                onChange={(e) => setSelectedEmployee(e.target.value)}
                required
                label="Select Professional"
              >
                {employees.map((emp) => (
                  <MenuItem key={emp._id} value={emp._id}>
                    {`${emp.firstName} ${emp.lastName}`}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              label="Reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required
              fullWidth
            />

            <TextField
              label="Description"
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
      </Paper>
    </motion.div>
  );
};

export default ReportWarning;
