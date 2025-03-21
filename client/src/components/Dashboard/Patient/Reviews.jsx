import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Rating,
  Typography,
  Box,
  Alert,
  CircularProgress
} from '@mui/material';

const Reviews = ({ open, onClose, appointment }) => {
  const [review, setReview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (open && appointment?.employeeId?._id) {
      fetchExistingReview();
    }
  }, [open, appointment]);

  const fetchExistingReview = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('patientToken');
      const response = await fetch(`http://localhost:8080/api/patient/reviews/${appointment.employeeId._id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      setReview(data);
    } catch (error) {
      console.error('Error fetching review:', error);
      setError('Failed to load review');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        Your Review for {appointment?.employeeId?.firstName} {appointment?.employeeId?.lastName}
      </DialogTitle>
      <DialogContent>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ my: 2 }}>{error}</Alert>
        ) : review ? (
          <Box sx={{ py: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <Rating value={review.rating} readOnly precision={0.5} />
              <Typography>({review.rating} stars)</Typography>
            </Box>
            <Typography variant="body1" sx={{ mb: 2 }}>
              {review.comment}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Posted on {new Date(review.date).toLocaleDateString()}
            </Typography>
          </Box>
        ) : (
          <Box sx={{ py: 2 }}>
            <Typography color="text.secondary">
              You haven't reviewed this professional yet.
            </Typography>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default Reviews;
