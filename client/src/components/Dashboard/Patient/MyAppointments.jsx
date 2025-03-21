import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Box,
  Chip,
  Alert,
  CircularProgress
} from '@mui/material';
import { Star as RateIcon } from '@mui/icons-material';
import dayjs from 'dayjs';
import Reviews from './Reviews';

const MyAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [openReviewModal, setOpenReviewModal] = useState(false);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const token = localStorage.getItem('patientToken');
      const response = await fetch('http://localhost:8080/api/appointments/patient', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      });

      if (!response.ok) throw new Error('Failed to fetch appointments');
      const data = await response.json();
      setAppointments(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleReviewClick = (appointment) => {
    setSelectedAppointment(appointment);
    setOpenReviewModal(true);
  };

  const handleReviewClose = (wasSuccessful) => {
    if (wasSuccessful) {
      // Refresh appointments to show updated review status
      fetchAppointments();
      setReviewSubmitted(true);
      setTimeout(() => setReviewSubmitted(false), 3000);
    }
    setOpenReviewModal(false);
    setSelectedAppointment(null);
  };

  if (loading) return <Box display="flex" justifyContent="center" p={4}><CircularProgress /></Box>;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h4" gutterBottom align="center">
          My Appointments
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Professional</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Time</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {appointments.map((appointment) => (
                <TableRow key={appointment._id}>
                  <TableCell>
                    {`${appointment.employeeId.firstName} ${appointment.employeeId.lastName}`}
                    <Typography variant="caption" display="block" color="textSecondary">
                      {appointment.employeeId.serviceType}
                    </Typography>
                  </TableCell>
                  <TableCell>{dayjs(appointment.startDate).format('MMM D, YYYY')}</TableCell>
                  <TableCell>{appointment.timeSlot}</TableCell>
                  <TableCell>
                    <Chip
                      label={appointment.status}
                      color={
                        appointment.status === 'confirmed' ? 'success' :
                        appointment.status === 'pending' ? 'warning' : 'default'
                      }
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {appointment.status === 'confirmed' && (
                      <Button
                        startIcon={<RateIcon />}
                        variant="outlined"
                        size="small"
                        onClick={() => handleReviewClick(appointment)}
                      >
                        Leave Review
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {appointments.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography color="textSecondary">No appointments found</Typography>
          </Box>
        )}
      </Paper>

      {reviewSubmitted && (
        <Alert 
          severity="success" 
          sx={{ 
            position: 'fixed', 
            bottom: 16, 
            right: 16, 
            zIndex: 2000 
          }}
        >
          Review submitted successfully!
        </Alert>
      )}

      {selectedAppointment && (
        <Reviews
          open={openReviewModal}
          onClose={handleReviewClose}
          appointment={selectedAppointment}
        />
      )}
    </Container>
  );
};

export default MyAppointments;
