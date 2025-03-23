import React, { useState, useEffect } from 'react';
import {
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  Stack,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  People as PeopleIcon,
  LocalHospital as DoctorIcon,
  EventNote as AppointmentIcon,
  StarRate as RatingIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { alpha } from '@mui/material/styles';

const cardVariants = {
  initial: { scale: 0.9, y: 20, opacity: 0 },
  animate: (i) => ({
    scale: 1,
    y: 0,
    opacity: 1,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
      type: "spring",
      stiffness: 100
    }
  }),
  hover: {
    scale: 1.05,
    boxShadow: "0px 8px 30px rgba(0,0,0,0.12)",
    transition: { duration: 0.3 }
  }
};

const headerVariants = {
  initial: { opacity: 0, y: -50 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.8,
      ease: "easeOut"
    }
  }
};

const WelcomeDashboard = () => {
  const [stats, setStats] = useState({
    totalEmployees: 0,
    totalPatients: 0,
    totalAppointments: 0,
    averageRating: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/admin/dashboard-stats', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch dashboard stats');
        }

        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error('Error fetching stats:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <motion.div
        variants={headerVariants}
        initial="initial"
        animate="animate"
      >
        <Paper sx={{ 
          p: 4, 
          mb: 4, 
          background: `linear-gradient(135deg, ${alpha('#1976d2', 0.95)} 0%, ${alpha('#42a5f5', 0.95)} 100%)`,
          color: 'white',
          borderRadius: 3,
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(circle at top right, rgba(255,255,255,0.2) 0%, transparent 70%)',
            animation: 'pulse 4s ease-in-out infinite'
          }
        }}>
          <Typography variant="h3" gutterBottom fontWeight="bold">
            Welcome to Admin Dashboard
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.9 }}>
            Manage your healthcare professionals, patients, and appointments all in one place.
          </Typography>
        </Paper>
      </motion.div>

      <Grid container spacing={3}>
        {[
          {
            icon: <DoctorIcon sx={{ fontSize: 45 }} />,
            title: "Healthcare Professionals",
            value: stats.totalEmployees,
            color: "primary"
          },
          {
            icon: <PeopleIcon sx={{ fontSize: 45 }} />,
            title: "Total Patients",
            value: stats.totalPatients,
            color: "secondary"
          },
          {
            icon: <AppointmentIcon sx={{ fontSize: 45 }} />,
            title: "Total Appointments",
            value: stats.totalAppointments,
            color: "success"
          },
          {
            icon: <RatingIcon sx={{ fontSize: 45 }} />,
            title: "Average Rating",
            value: stats.averageRating.toFixed(1),
            color: "warning"
          }
        ].map((item, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <motion.div
              variants={cardVariants}
              initial="initial"
              animate="animate"
              whileHover="hover"
              custom={index}
            >
              <Card sx={{
                height: '100%',
                background: 'white',
                borderRadius: 2,
                boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.1)'
              }}>
                <CardContent>
                  <Stack spacing={2}>
                    <Box sx={{ 
                      p: 2, 
                      borderRadius: 2,
                      bgcolor: theme => alpha(theme.palette[item.color].main, 0.1),
                      color: theme => theme.palette[item.color].main,
                      display: 'inline-flex'
                    }}>
                      {item.icon}
                    </Box>
                    <Typography color="textSecondary" variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                      {item.title}
                    </Typography>
                    <Typography variant="h3" sx={{ fontWeight: 'bold' }}>
                      {item.value}
                    </Typography>
                  </Stack>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default WelcomeDashboard;
