import React, { useState, useEffect } from 'react';
import {
  Grid,
  Paper,
  Typography,
  CircularProgress,
  Alert,
  Box,
} from '@mui/material';
import { Chart } from 'chart.js/auto';
import { Line, Bar } from 'react-chartjs-2';

const Analytics = () => {
  const [analytics, setAnalytics] = useState({
    monthlyAppointments: [],
    serviceDistribution: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      
      if (!token) {
        throw new Error('Authentication required');
      }

      console.log('Fetching analytics data...');
      const response = await fetch('http://localhost:8080/api/admin/analytics', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch analytics');
      }

      const result = await response.json();
      console.log('Received analytics:', result);

      if (!result.success) {
        throw new Error(result.message || 'Failed to load analytics');
      }

      const { monthlyAppointments, serviceDistribution } = result.data;

      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      
      setAnalytics({
        monthlyAppointments: {
          labels: monthlyAppointments.map(item => `${monthNames[item._id.month - 1]} ${item._id.year}`),
          datasets: [{
            label: 'Monthly Appointments',
            data: monthlyAppointments.map(item => item.count),
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1
          }]
        },
        serviceDistribution: {
          labels: serviceDistribution.map(item => item._id),
          datasets: [{
            label: 'Service Distribution',
            data: serviceDistribution.map(item => item.count),
            backgroundColor: [
              'rgba(54, 162, 235, 0.5)',
              'rgba(255, 99, 132, 0.5)',
            ]
          }]
        }
      });
    } catch (error) {
      console.error('Analytics error:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h5" gutterBottom>Analytics Dashboard</Typography>
      </Grid>

      <Grid item xs={12} md={6}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>Monthly Appointments</Typography>
          <Box sx={{ height: 300 }}>
            <Line 
              data={analytics.monthlyAppointments}
              options={{
                responsive: true,
                maintainAspectRatio: false,
              }}
            />
          </Box>
        </Paper>
      </Grid>

      <Grid item xs={12} md={6}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>Service Distribution</Typography>
          <Box sx={{ height: 300 }}>
            <Bar 
              data={analytics.serviceDistribution}
              options={{
                responsive: true,
                maintainAspectRatio: false,
              }}
            />
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default Analytics;
