import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Rating,
  Box,
  Card,
  CardContent,
  Grid,
  Divider,
  CircularProgress,
  Alert,
} from '@mui/material';
import { Comment as CommentIcon, Person as PersonIcon } from '@mui/icons-material';
import dayjs from 'dayjs';

export default function Review() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const token = localStorage.getItem('empToken');
      if (!token) {
        throw new Error('Authentication required');
      }

      console.log('Fetching reviews...'); // Debug log
      const response = await fetch('http://localhost:8080/api/employee/reviews', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch reviews');
      }

      const data = await response.json();
      console.log('Reviews fetched:', data); // Debug log
      setReviews(data);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const calculateAverageRating = () => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return (sum / reviews.length).toFixed(1);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" py={4}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography variant="h4" gutterBottom>
            My Reviews
          </Typography>
          {reviews.length > 0 && (
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
              <Rating value={Number(calculateAverageRating())} precision={0.1} readOnly />
              <Typography variant="h6">
                {calculateAverageRating()} / 5.0 ({reviews.length} reviews)
              </Typography>
            </Box>
          )}
        </Box>

        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

        <Grid container spacing={3}>
          {reviews.map((review) => (
            <Grid item xs={12} md={6} key={review._id}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <PersonIcon sx={{ mr: 1 }} />
                    <Typography variant="subtitle1">
                      {review.patientId.firstName} {review.patientId.lastName}
                    </Typography>
                  </Box>
                  <Rating value={review.rating} readOnly />
                  <Typography color="text.secondary" sx={{ mt: 1 }}>
                    {dayjs(review.date).format('MMMM D, YYYY')}
                  </Typography>
                  <Divider sx={{ my: 2 }} />
                  <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                    <CommentIcon sx={{ mr: 1, mt: 0.5 }} />
                    <Typography variant="body1">{review.comment}</Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {reviews.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography color="text.secondary">
              No reviews yet
            </Typography>
          </Box>
        )}
      </Paper>
    </Container>
  );
}
