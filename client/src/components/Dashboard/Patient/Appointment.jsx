import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  FormControl,
  Select,
  MenuItem,
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
  Paper,
  Grid,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { default as CheckoutForm } from '../../Payment/CheckoutForm';
import Reviews from './Reviews';  // Update this line to use a default import

const timeSlots = [
  '09:00 AM', '10:00 AM', '11:00 AM',
  '12:00 PM', '02:00 PM', '03:00 PM',
  '04:00 PM', '05:00 PM'
];

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const Appointment = () => {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [timeFrame, setTimeFrame] = useState('day');
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [selectedTime, setSelectedTime] = useState('');
  const [endDate, setEndDate] = useState(null);
  const [serviceType, setServiceType] = useState('all');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [localities, setLocalities] = useState([]);
  const [serviceTypes, setServiceTypes] = useState([]);
  const [selectedLocality, setSelectedLocality] = useState('');
  const [selectedServiceType, setSelectedServiceType] = useState('');
  const [bookedSlots, setBookedSlots] = useState([]);
  const [paymentIntent, setPaymentIntent] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  useEffect(() => {
    fetchLocalities();
  }, []);

  useEffect(() => {
    if (selectedLocality) {
      fetchServiceTypes();
      setSelectedServiceType('');
      setSelectedEmployee('');
    }
  }, [selectedLocality]);

  useEffect(() => {
    if (selectedLocality && selectedServiceType) {
      fetchEmployees();
    }
  }, [selectedLocality, selectedServiceType]);

  useEffect(() => {
    if (selectedEmployee && selectedDate && timeFrame === 'week') {
      // Fetch booked slots for each day in the week
      fetchWeeklyBookedSlots();
    } else if (selectedEmployee && selectedDate) {
      fetchBookedSlots();
    }
  }, [selectedEmployee, selectedDate, timeFrame]);

  const fetchLocalities = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8080/api/employee/localities', {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Invalid response format');
      }

      const data = await response.json();
      setLocalities(data);
    } catch (error) {
      console.error('Error fetching localities:', error);
      setError('Failed to fetch localities');
    } finally {
      setLoading(false);
    }
  };

  const fetchServiceTypes = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:8080/api/employee/servicetypes?location=${encodeURIComponent(selectedLocality)}`, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setServiceTypes(data);
    } catch (error) {
      console.error('Error fetching service types:', error);
      setError('Failed to fetch service types');
    } finally {
      setLoading(false);
    }
  };

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      setError('');
      const url = `http://localhost:8080/api/employee/fetch?location=${encodeURIComponent(selectedLocality)}&serviceType=${encodeURIComponent(selectedServiceType)}`;
      
      const response = await fetch(url, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setEmployees(data);
    } catch (error) {
      console.error('Error fetching employees:', error);
      setError('Failed to fetch employees');
      setEmployees([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchBookedSlots = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/appointments/booked-slots?employeeId=${selectedEmployee}&date=${selectedDate.format('YYYY-MM-DD')}`,
        {
          headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('patientToken')}`
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch booked slots');
      }

      const data = await response.json();
      setBookedSlots(data);
    } catch (error) {
      console.error('Error fetching booked slots:', error);
    }
  };

  const fetchWeeklyBookedSlots = async () => {
    try {
      const bookedSlotsSet = new Set();
      
      // Fetch slots for each day in the week
      for (let i = 0; i < 7; i++) {
        const currentDate = selectedDate.add(i, 'day');
        const response = await fetch(
          `http://localhost:8080/api/appointments/booked-slots?employeeId=${selectedEmployee}&date=${currentDate.format('YYYY-MM-DD')}`,
          {
            headers: {
              'Accept': 'application/json',
            },
          }
        );

        if (!response.ok) {
          throw new Error('Failed to fetch booked slots');
        }

        const data = await response.json();
        data.forEach(slot => bookedSlotsSet.add(slot));
      }

      setBookedSlots(Array.from(bookedSlotsSet));
    } catch (error) {
      console.error('Error fetching weekly booked slots:', error);
    }
  };

  useEffect(() => {
    if (selectedDate && timeFrame === 'week') {
      setEndDate(selectedDate.add(6, 'day'));
    }
  }, [selectedDate, timeFrame]);

  const formatDate = (date) => {
    if (!date) return '';
    return date.format('MMMM D, YYYY');
  };

  const handleServiceTypeChange = (e) => {
    setServiceType(e.target.value);
    setSelectedEmployee(''); // Reset selected employee when filter changes
  };

  const handleTimeFrameChange = (e) => {
    const newTimeFrame = e.target.value;
    setTimeFrame(newTimeFrame);
    setSelectedTime(''); // Reset selected time when changing timeframe
    
    if (newTimeFrame === 'week') {
      setEndDate(selectedDate.add(6, 'day'));
    } else {
      setEndDate(null);
    }
  };

  const handlePaymentAndBooking = async () => {
    try {
      setLoading(true);
      setError('');
      
      const token = localStorage.getItem('patientToken');
      if (!token) {
        throw new Error('Please login to book an appointment');
      }

      const selectedEmployeeDetails = employees.find(emp => emp._id === selectedEmployee);
      if (!selectedEmployeeDetails) {
        throw new Error('Employee not found');
      }

      const response = await fetch('http://localhost:8080/api/payment/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          amount: selectedEmployeeDetails.fee
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Payment initialization failed');
      }

      const { clientSecret } = await response.json();
      setPaymentIntent(clientSecret);
      setShowPaymentModal(true);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = async (paymentIntentId) => {
    try {
      await handleBookingCreation(paymentIntentId);
      setShowPaymentModal(false);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleBookingCreation = async (paymentIntentId) => {
    try {
      const token = localStorage.getItem('patientToken');
      if (!token) {
        throw new Error('Authentication required');
      }
  
      const bookingData = {
        employeeId: selectedEmployee,
        startDate: selectedDate.toISOString(),
        endDate: timeFrame === 'week' ? endDate.toISOString() : selectedDate.toISOString(),
        timeSlot: selectedTime,
        paymentIntentId
      };
  
      console.log('Sending booking data:', bookingData);
  
      const response = await fetch('http://localhost:8080/api/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(bookingData)
      });
  
      const data = await response.json();
      console.log('Booking response:', data);
  
      if (!response.ok) {
        throw new Error(data.message || 'Failed to create appointment');
      }
  
      if (data.success) {
        setShowPaymentModal(false);
        alert('Appointment booked successfully!');
        resetForm();
      }
    } catch (error) {
      console.error('Booking error:', error);
      setError(error.message);
      throw error;
    }
  };
  

  const resetForm = () => {
    setSelectedEmployee('');
    setSelectedTime('');
    setSelectedDate(dayjs());
    setEndDate(null);
  };

  return (
    <>
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" gutterBottom align="center" sx={{ mb: 4 }}>
            Book an Appointment
          </Typography>

          <Grid container spacing={4}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <Typography variant="subtitle1" gutterBottom>Select Location</Typography>
                <Select
                  value={selectedLocality}
                  onChange={(e) => setSelectedLocality(e.target.value)}
                  displayEmpty
                >
                  <MenuItem value="" disabled>Choose a location</MenuItem>
                  {localities.map((locality) => (
                    <MenuItem key={locality} value={locality}>
                      {locality}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {selectedLocality && (
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <Typography variant="subtitle1" gutterBottom>Select Service Type</Typography>
                  <Select
                    value={selectedServiceType}
                    onChange={(e) => setSelectedServiceType(e.target.value)}
                    displayEmpty
                  >
                    <MenuItem value="" disabled>Choose a service type</MenuItem>
                    {serviceTypes.map((type) => (
                      <MenuItem key={type} value={type}>
                        {type}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            )}

            {selectedServiceType && (
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <Typography variant="subtitle1" gutterBottom>Select Professional</Typography>
                  <Select
                    value={selectedEmployee}
                    onChange={(e) => setSelectedEmployee(e.target.value)}
                    displayEmpty
                  >
                    <MenuItem value="" disabled>
                      {employees.length > 0 ? "Choose a professional" : "No professionals available"}
                    </MenuItem>
                    {employees.map((emp) => (
                      <MenuItem key={emp._id} value={emp._id}>
                        {`${emp.firstName} ${emp.lastName} - ${emp.serviceType}`}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            )}

            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>Select Time Frame</Typography>
              <RadioGroup
                row
                value={timeFrame}
                onChange={handleTimeFrameChange}
              >
                <FormControlLabel value="day" control={<Radio />} label="One Day" />
                <FormControlLabel value="week" control={<Radio />} label="One Week" />
              </RadioGroup>
            </Grid>

            <Grid item xs={12}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Select Date"
                  value={selectedDate}
                  onChange={(newValue) => setSelectedDate(newValue)}
                  slotProps={{ textField: { fullWidth: true } }}
                  minDate={dayjs()}
                />
              </LocalizationProvider>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>Select Time Slot</Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 2 }}>
                {timeSlots.map((time) => (
                  <Button
                    key={time}
                    variant={selectedTime === time ? "contained" : "outlined"}
                    onClick={() => setSelectedTime(time)}
                    disabled={bookedSlots.includes(time)}
                    sx={{
                      py: 1,
                      opacity: bookedSlots.includes(time) ? 0.5 : 1,
                      '&.Mui-disabled': {
                        bgcolor: 'error.light',
                        color: 'white',
                        '&:after': {
                          content: '"Booked"',
                          position: 'absolute',
                          fontSize: '0.7rem',
                        }
                      }
                    }}
                  >
                    {time}
                  </Button>
                ))}
              </Box>
            </Grid>

            {timeFrame === 'week' && selectedDate && (
              <Grid item xs={12}>
                <Typography variant="subtitle1" color="primary">
                  Session will be scheduled from {formatDate(selectedDate)} to {formatDate(endDate)}
                </Typography>
              </Grid>
            )}

            {error && (
              <Grid item xs={12}>
                <Typography color="error" align="center">{error}</Typography>
              </Grid>
            )}

            {loading && (
              <Grid item xs={12}>
                <Typography align="center">Loading...</Typography>
              </Grid>
            )}

            <Grid item xs={12}>
              <Button
                variant="contained"
                fullWidth
                size="large"
                onClick={handlePaymentAndBooking}
                disabled={!selectedEmployee || !selectedDate || !selectedTime || loading}
                sx={{ mt: 2 }}
              >
                {loading ? 'Processing...' : 'Book Appointment'}
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Container>

      <Dialog 
        open={showPaymentModal} 
        onClose={() => setShowPaymentModal(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Complete Payment</DialogTitle>
        <DialogContent>
          {paymentIntent && (
            <Elements 
              stripe={stripePromise} 
              options={{
                clientSecret: paymentIntent,
                appearance: { theme: 'stripe' },
                loader: 'auto',
                paymentMethodCreation: 'manual'
              }}
            >
              <CheckoutForm 
                amount={employees.find(emp => emp._id === selectedEmployee)?.fee || 0}
                onSuccess={handlePaymentSuccess}
              />
            </Elements>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Appointment;
