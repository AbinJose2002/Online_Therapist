import React, { useState, useEffect } from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  CircularProgress,
  Alert,
  Box,
  Chip
} from '@mui/material';
import { motion } from 'framer-motion';

const PatientWarnings = () => {
  const [warnings, setWarnings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchWarnings();
  }, []);

  const fetchWarnings = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/admin/patient-warnings', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      });
      const data = await response.json();
      setWarnings(data);
    } catch (error) {
      setError('Failed to fetch warnings');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
      <Typography variant="h5" gutterBottom color="primary">
        Patient Reports
      </Typography>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Patient</TableCell>
              <TableCell>Employee</TableCell>
              <TableCell>Reason</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {warnings.map((warning) => (
              <TableRow key={warning._id}>
                <TableCell>{`${warning.patientId.firstName} ${warning.patientId.lastName}`}</TableCell>
                <TableCell>{`${warning.employeeId.firstName} ${warning.employeeId.lastName}`}</TableCell>
                <TableCell>{warning.reason}</TableCell>
                <TableCell>{warning.description}</TableCell>
                <TableCell>{new Date(warning.createdAt).toLocaleDateString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default PatientWarnings;
