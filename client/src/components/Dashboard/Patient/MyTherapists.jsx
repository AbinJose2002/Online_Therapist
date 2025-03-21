import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Rating,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  Box,
  CircularProgress
} from '@mui/material';
import { Star } from '@mui/icons-material';
import dayjs from 'dayjs';

const MyTherapists = () => {
  const [therapists, setTherapists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openReview, setOpenReview] = useState(false);
  const [selectedTherapist, setSelectedTherapist] = useState(null);
  const [reviewData, setReviewData] = useState({ rating: 0, comment: '' });

  useEffect(() => {
    fetchTherapists();
  }, []);

  const fetchTherapists = async () => {
    try {
      const token = localStorage.getItem('patientToken');
      const response = await fetch('http://localhost:8080/api/patient/my-therapists', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      });

      if (!response.ok) throw new Error('Failed to fetch therapists');
      const data = await response.json();
      setTherapists(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleReviewSubmit = async () => {
    try {
      const token = localStorage.getItem('patientToken');
      const response = await fetch('http://localhost:8080/api/patient/reviews', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          employeeId: selectedTherapist._id,
          ...reviewData
        }),
      });

      if (!response.ok) throw new Error('Failed to submit review');
      
      // Update local state
      await fetchTherapists();
      setOpenReview(false);
      setReviewData({ rating: 0, comment: '' });
    } catch (error) {
      setError(error.message);
    }
  };

  if (loading) return <Box display="flex" justifyContent="center" p={4}><CircularProgress /></Box>;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom align="center">My Healthcare Professionals</Typography>
      
      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      <Grid container spacing={3}>
        {therapists.map((therapist) => (
          <Grid item xs={12} md={6} key={therapist._id}>
            <Card>
              <CardContent>
                <Typography variant="h6">{`${therapist.firstName} ${therapist.lastName}`}</Typography>
                <Typography color="textSecondary">{therapist.serviceType}</Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Last Visit: {dayjs(therapist.lastVisit).format('MMMM D, YYYY')}
                </Typography>
                {therapist.hasReview && (
                  <Box sx={{ mt: 2 }}>
                    <Rating value={therapist.review.rating} readOnly />
                    <Typography variant="body2">{therapist.review.comment}</Typography>
                  </Box>
                )}
              </CardContent>
              <CardActions>
                {!therapist.hasReview && (
                  <Button 
                    size="small" 
                    onClick={() => {
                      setSelectedTherapist(therapist);
                      setOpenReview(true);
                    }}
                  >
                    Leave Review
                  </Button>
                )}
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={openReview} onClose={() => setOpenReview(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Review {selectedTherapist?.firstName} {selectedTherapist?.lastName}</DialogTitle>
        <DialogContent>
          <Box sx={{ my: 2 }}>
            <Rating
              value={reviewData.rating}
              onChange={(_, value) => setReviewData(prev => ({ ...prev, rating: value }))}
              size="large"
            />
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Your Review"
              value={reviewData.comment}
              onChange={(e) => setReviewData(prev => ({ ...prev, comment: e.target.value }))}
              sx={{ mt: 2 }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenReview(false)}>Cancel</Button>
          <Button 
            onClick={handleReviewSubmit}
            disabled={!reviewData.rating || !reviewData.comment.trim()}
          >
            Submit Review
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default MyTherapists;
