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
  Alert,
  Snackbar,
  CircularProgress,
  Chip,
  Fade,
  useTheme,
  Box,  // Add Box to imports if not already present
} from '@mui/material';
import { AccessTime, CheckCircle, Person, Email, Phone } from '@mui/icons-material';
import dayjs from 'dayjs';

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const theme = useTheme();

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('empToken');
      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await fetch('http://localhost:8080/api/appointments/employee', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch appointments');
      }

      const data = await response.json();
      setAppointments(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (appointmentId) => {
    try {
      setLoading(true);
      setError('');
      const token = localStorage.getItem('empToken');
      
      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await fetch(`http://localhost:8080/api/appointments/accept/${appointmentId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to accept appointment');
      }

      // Update appointment status locally
      setAppointments(appointments.map(apt => 
        apt._id === appointmentId 
          ? { ...apt, status: 'confirmed' }
          : apt
      ));
      
      setSuccessMessage('Appointment accepted successfully');
    } catch (error) {
      console.error('Accept error:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => dayjs(date).format('MMMM D, YYYY');

  const getStatusColor = (status) => {
    switch(status) {
      case 'confirmed': return theme.palette.success.main;
      case 'pending': return theme.palette.warning.main;
      case 'cancelled': return theme.palette.error.main;
      default: return theme.palette.grey[500];
    }
  };

  if (loading) return (
    <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
      <CircularProgress size={60} />
    </Container>
  );

  return (
    <Fade in={true} timeout={1000}>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Paper 
          elevation={3} 
          sx={{ 
            p: 4,
            borderRadius: 2,
            background: 'linear-gradient(145deg, #ffffff 0%, #f5f5f5 100%)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
          }}
        >
          <Typography 
            variant="h4" 
            gutterBottom 
            align="center"
            sx={{
              mb: 2,
              fontWeight: 'bold',
              background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Today's Appointments
          </Typography>

          <Typography 
            variant="h6" 
            align="center" 
            sx={{ mb: 4, color: 'text.secondary' }}
          >
            {dayjs().format('MMMM D, YYYY')}
          </Typography>

          {error && (
            <Alert 
              severity="error" 
              sx={{ mb: 3, borderRadius: 2 }}
              variant="filled"
            >
              {error}
            </Alert>
          )}

          <TableContainer sx={{ borderRadius: 2, overflow: 'hidden' }}>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: 'primary.main' }}>
                  <TableCell sx={{ color: 'white' }}><Person /> Patient</TableCell>
                  <TableCell sx={{ color: 'white' }}><AccessTime /> Date & Time</TableCell>
                  <TableCell sx={{ color: 'white' }}>Status</TableCell>
                  <TableCell sx={{ color: 'white' }}>Contact</TableCell>
                  <TableCell sx={{ color: 'white' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {appointments.map((appointment) => (
                  <TableRow 
                    key={appointment._id}
                    sx={{ 
                      '&:hover': { 
                        bgcolor: 'action.hover',
                        transition: 'background-color 0.3s'
                      }
                    }}
                  >
                    <TableCell>
                      <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                        {`${appointment.patientId.firstName} ${appointment.patientId.lastName}`}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="textSecondary">
                        {formatDate(appointment.startDate)}
                      </Typography>
                      <Chip 
                        size="small" 
                        label={appointment.timeSlot}
                        sx={{ mt: 1 }}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={appointment.status}
                        sx={{
                          bgcolor: getStatusColor(appointment.status),
                          color: 'white',
                          textTransform: 'capitalize'
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Email fontSize="small" color="primary" />
                          {appointment.patientId.email}
                        </Typography>
                        <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Phone fontSize="small" color="primary" />
                          {appointment.patientId.number}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      {appointment.status === 'pending' && (
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => handleAccept(appointment._id)}
                          startIcon={<CheckCircle />}
                          sx={{
                            borderRadius: 2,
                            textTransform: 'none',
                            boxShadow: 2,
                            '&:hover': {
                              transform: 'translateY(-2px)',
                              transition: 'transform 0.3s'
                            }
                          }}
                        >
                          Accept
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          
          {appointments.length === 0 && (
            <Box sx={{ 
              py: 8, 
              textAlign: 'center',
              color: 'text.secondary'
            }}>
              <Typography variant="h6">No appointments for today</Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                Check back later for new appointments
              </Typography>
            </Box>
          )}
        </Paper>

        <Snackbar
          open={!!successMessage}
          autoHideDuration={3000}
          onClose={() => setSuccessMessage('')}
          sx={{ borderRadius: 2 }}
        >
          <Alert 
            severity="success" 
            variant="filled"
            sx={{ width: '100%' }}
          >
            {successMessage}
          </Alert>
        </Snackbar>
      </Container>
    </Fade>
  );
};

export default Appointments;
