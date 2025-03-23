import React, { useState, useEffect } from 'react';
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Box, Button, Typography } from '@mui/material';

// Change to a named function declaration
function CheckoutForm({ amount, onSuccess }) {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!stripe || !elements) {
      return;
    }

    setProcessing(true);
    setError(null);

    try {
      // First submit the payment element details
      const result = await stripe.confirmPayment({
        elements,
        redirect: 'if_required',
        confirmParams: {
          return_url: `${window.location.origin}/payment-complete`,
          payment_method_data: {
            billing_details: {}
          }
        }
      });

      if (result.error) {
        throw result.error;
      }

      // Check the payment intent status
      const { paymentIntent } = result;
      
      if (paymentIntent.status === 'succeeded') {
        onSuccess(paymentIntent.id);
      } else if (paymentIntent.status === 'requires_payment_method') {
        throw new Error('Your payment was not successful, please try again.');
      } else {
        throw new Error('Something went wrong.');
      }
    } catch (err) {
      console.error('Payment error:', err);
      setError(err.message || 'An error occurred during payment');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <Box sx={{ p: 2 }}>
      <form onSubmit={handleSubmit}>
        <Typography variant="h6" gutterBottom>
          Amount to pay: ₹{amount}
        </Typography>
        
        <PaymentElement />
        
        {error && (
          <Typography color="error" sx={{ mt: 2 }}>
            {error}
          </Typography>
        )}
        
        <Button
          type="submit"
          variant="contained"
          fullWidth
          disabled={!stripe || processing}
          sx={{ mt: 3 }}
        >
          {processing ? 'Processing...' : 'Pay Now'}
        </Button>
      </form>
    </Box>
  );
}

// Add explicit default export
export default CheckoutForm;
