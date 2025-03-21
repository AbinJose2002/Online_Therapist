import { useState } from 'react';
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Box, Button, Alert, CircularProgress } from '@mui/material';

const CheckoutForm = ({ amount, onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);

    if (!stripe || !elements) {
      return;
    }

    setProcessing(true);

    try {
      const { error: submitError } = await elements.submit();
      if (submitError) {
        throw submitError;
      }

      const { paymentIntent, error } = await stripe.confirmPayment({
        elements,
        redirect: 'if_required'
      });

      if (error) {
        throw error;
      }

      if (paymentIntent.status === 'succeeded') {
        console.log('Payment successful:', paymentIntent.id);
        await onSuccess(paymentIntent.id);
      }

    } catch (err) {
      console.error('Payment error:', err);
      setError(err.message || 'Payment failed');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <Box sx={{ p: 2 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <PaymentElement />
        <Button
          type="submit"
          variant="contained"
          fullWidth
          disabled={!stripe || processing}
          sx={{ mt: 2 }}
        >
          {processing ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            `Pay ₹${amount}`
          )}
        </Button>
      </form>
    </Box>
  );
};

export default CheckoutForm;
