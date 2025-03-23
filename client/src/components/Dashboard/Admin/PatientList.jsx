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
import { motion } from 'framer-motion';

const tableRowVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: (i) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: i * 0.05,
      duration: 0.3,
      ease: "easeOut"
    }
  }),
  hover: {
    backgroundColor: 'rgba(0, 0, 0, 0.04)',
    transition: { duration: 0.2 }
  }
};

const tableContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.3
    }
  }
};

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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <Paper sx={{ 
        p: 3, 
        borderRadius: 3,
        background: 'linear-gradient(145deg, #ffffff, #f8f9fa)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
      }}>
        <Typography 
          variant="h5" 
          component={motion.h5}
          initial={{ x: -20 }}
          animate={{ x: 0 }}
          sx={{ 
            mb: 3,
            fontWeight: 'bold',
            color: 'primary.main'
          }}
        >
          Patient Management
        </Typography>

        <motion.div
          variants={tableContainerVariants}
          initial="hidden"
          animate="visible"
        >
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ 
                  bgcolor: 'primary.main',
                  '& th': { 
                    color: 'white',
                    fontWeight: 'bold'
                  }
                }}>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Phone</TableCell>
                  <TableCell>Location</TableCell>
                  <TableCell>Join Date</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {patients.map((patient, index) => (
                  <motion.tr
                    key={patient._id}
                    variants={tableRowVariants}
                    custom={index}
                    whileHover="hover"
                    component={TableRow}
                    sx={{
                      '&:hover': {
                        bgcolor: 'rgba(0, 0, 0, 0.04)',
                        transform: 'scale(1.01)',
                        transition: 'all 0.3s'
                      }
                    }}
                  >
                    <TableCell>{`${patient.firstName} ${patient.lastName}`}</TableCell>
                    <TableCell>{patient.email}</TableCell>
                    <TableCell>{patient.number}</TableCell>
                    <TableCell>{patient.location}</TableCell>
                    <TableCell>{dayjs(patient.createdAt).format('MMM D, YYYY')}</TableCell>
                  </motion.tr>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </motion.div>
      </Paper>
    </motion.div>
  );
};

export default PatientList;
