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
} from '@mui/material';
import dayjs from 'dayjs';

const PatientList = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      
      if (!token) {
        throw new Error('Authentication required');
      }

      console.log('Fetching patients...');
      const response = await fetch('http://localhost:8080/api/patient/all', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch patients');
      }

      const data = await response.json();
      console.log('Fetched patients:', data);
      setPatients(data);
    } catch (error) {
      console.error('Error:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <Box display="flex" justifyContent="center" p={3}>
      <CircularProgress />
    </Box>
  );

  if (error) return <Alert severity="error" sx={{ m: 2 }}>{error}</Alert>;

  return (
    <TableContainer component={Paper}>
      <Typography variant="h5" sx={{ p: 2 }}>Patient List</Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Phone</TableCell>
            <TableCell>Location</TableCell>
            <TableCell>Join Date</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {patients.map((patient) => (
            <TableRow key={patient._id}>
              <TableCell>{`${patient.firstName} ${patient.lastName}`}</TableCell>
              <TableCell>{patient.email}</TableCell>
              <TableCell>{patient.number}</TableCell>
              <TableCell>{patient.location}</TableCell>
              <TableCell>{dayjs(patient.createdAt).format('MMM D, YYYY')}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {patients.length === 0 && (
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <Typography color="text.secondary">No patients found</Typography>
        </Box>
      )}
    </TableContainer>
  );
};

export default PatientList;
