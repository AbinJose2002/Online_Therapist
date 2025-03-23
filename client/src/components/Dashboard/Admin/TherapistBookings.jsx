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
  Alert
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';

const TherapistBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/appointments/therapist-bookings', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      });
      const data = await response.json();
      setBookings(data);
    } catch (error) {
      setError('Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  };

  const tableRowVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.3,
        ease: "easeOut"
      }
    }),
    exit: { opacity: 0, x: -20 }
  };

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Paper 
        elevation={3}
        sx={{ 
          p: 3,
          borderRadius: 2,
          background: 'linear-gradient(to bottom, #ffffff, #f8f9fa)',
          overflow: 'hidden'
        }}
      >
        <Typography 
          component={motion.h5}
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          variant="h5" 
          sx={{ 
            mb: 4,
            fontWeight: 'bold',
            color: 'primary.main'
          }}
        >
          Therapist Bookings Overview
        </Typography>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ 
                bgcolor: theme => theme.palette.primary.main,
                '& th': { 
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '1rem'
                }
              }}>
                {['Therapist Name', 'Service Type', 'Total Bookings', 'Pending', 'Confirmed'].map((header, index) => (
                  <TableCell 
                    key={index}
                    sx={{ 
                      color: 'white',
                      fontWeight: 'bold',
                      fontSize: '1rem'
                    }}
                  >
                    {header}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              <AnimatePresence>
                {bookings.map((booking, index) => (
                  <motion.tr
                    key={booking.therapistId}
                    custom={index}
                    variants={tableRowVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    component={TableRow}
                    sx={{
                      '&:hover': {
                        bgcolor: 'rgba(0, 0, 0, 0.04)',
                        transition: 'background-color 0.3s'
                      }
                    }}
                  >
                    <TableCell>{`${booking.firstName} ${booking.lastName}`}</TableCell>
                    <TableCell>{booking.serviceType}</TableCell>
                    <TableCell>{booking.totalBookings}</TableCell>
                    <TableCell>{booking.pendingBookings}</TableCell>
                    <TableCell>{booking.confirmedBookings}</TableCell>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </motion.div>
  );
};

export default TherapistBookings;
