import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  TextField,
  Button,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Grid,
  CircularProgress,
  Chip,
  Paper,
  Snackbar,
  Alert,
  Avatar,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Send as SendIcon, Psychology, LocalHospital, ErrorOutline } from '@mui/icons-material';
import axios from 'axios';
import { motion } from 'framer-motion';

const AIHelper = () => {
  const [input, setInput] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [apiError, setApiError] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  // Function to handle image errors and clean URLs
  const getImageUrl = (imagePath) => {
    if (!imagePath) return 'https://via.placeholder.com/150?text=Profile';
    
    try {
      // If it's already a full URL, return it
      if (imagePath.startsWith('http')) {
        return imagePath;
      }
      
      // Clean up the path for different formats
      if (imagePath.includes('uploads/images') || imagePath.includes('images/')) {
        // Path already has uploads or images directory
        return `http://localhost:8080/${imagePath.replace(/^\/+/, '')}`;
      } else {
        // Generic clean path conversion
        return `http://localhost:8080/uploads/${imagePath.replace(/^\/+/, '')}`;
      }
    } catch (error) {
      console.error('Error processing image path:', error);
      return 'https://via.placeholder.com/150?text=Profile';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    setAnalyzing(true);
    setError('');
    setApiError(false);
    
    try {
      console.log('Sending request to smart bot backend:', input);
      
      // First try to use Python backend
      const response = await axios.post('http://localhost:5000/analyze', {
        message: input
      }, { timeout: 10000 });
      
      console.log('AI analysis response:', response.data);
      setResult(response.data);
      
      // Log professionals received
      if (response.data.professionals) {
        console.log(`Received ${response.data.professionals.length} professionals:`, 
          response.data.professionals.map(p => `${p.name} (${p.serviceType})`));
      }
    } catch (err) {
      console.error('Error analyzing message with smart bot:', err);
      
      // Fall back to the node.js backend AI controller
      try {
        console.log('Falling back to Node.js AI backend');
        const fallbackResponse = await axios.post('http://localhost:8080/api/ai/chat', {
          messages: [
            { role: "system", content: "You are a helpful healthcare assistant that provides information about health concerns and recommends appropriate healthcare professionals." },
            { role: "user", content: input }
          ]
        }, { timeout: 10000 });
        
        // For fallback, we need to manually fetch employees based on detected service type
        let matchedService = "Therapist"; // Default to Therapist if we can't detect
        
        // Try to extract service type from response
        const responseText = fallbackResponse.data.message.toLowerCase();
        if (responseText.includes("therapist") || responseText.includes("mental health") || 
            responseText.includes("psychologist") || responseText.includes("counselor") ||
            responseText.includes("emotional") || responseText.includes("psychological")) {
          matchedService = "Therapist";
        } else if (responseText.includes("nurse") || responseText.includes("home care") || 
                  responseText.includes("medical assistance") || responseText.includes("physical care")) {
          matchedService = "Home Nurse";
        }
        
        console.log(`Detected service type from response: ${matchedService}`);
        
        try {
          // Get all employees without filtering
          const employeesResponse = await axios.get('http://localhost:8080/api/employee/fetch');
          
          console.log(`Fetched ${employeesResponse.data.length} total employees`);
          
          // Filter by service type client-side for more flexibility
          let filteredEmployees = employeesResponse.data.filter(emp => 
            emp.serviceType && emp.serviceType.toLowerCase() === matchedService.toLowerCase()
          );
          
          // If no exact matches, use more flexible filtering
          if (filteredEmployees.length === 0) {
            filteredEmployees = employeesResponse.data.filter(emp => 
              emp.serviceType && (
                emp.serviceType.toLowerCase().includes(matchedService.toLowerCase()) || 
                matchedService.toLowerCase().includes(emp.serviceType.toLowerCase())
              )
            );
          }
          
          // If still no matches, just use the first 3 employees
          if (filteredEmployees.length === 0) {
            filteredEmployees = employeesResponse.data.slice(0, 3);
          }
          
          console.log(`Filtered to ${filteredEmployees.length} matching employees`);
          
          // Use the first 3 matching employees
          const professionals = filteredEmployees.slice(0, 3);
          
          setResult({
            matched_service: matchedService,
            professionals: professionals,
            message: fallbackResponse.data.message
          });
        } catch (empError) {
          console.error('Error fetching employees:', empError);
          setApiError(true);
          setError('Unable to fetch healthcare professionals.');
        }
      } catch (fallbackErr) {
        console.error('Fallback error:', fallbackErr);
        setApiError(true);
        setError('We encountered difficulties processing your request. Please try again with a more specific health concern.');
      }
    } finally {
      setAnalyzing(false);
    }
  };

  // Simplified service type detection for fallback
  const detectServiceType = (text) => {
    const lowercaseText = text.toLowerCase();
    
    // Mental health keywords
    const therapistKeywords = [
      'anxiety', 'depression', 'stress', 'mental', 'therapy', 'emotion', 
      'trauma', 'grief', 'mood', 'psychologist', 'psychiatrist', 'panic',
      'ocd', 'adhd', 'bipolar', 'phobia', 'counseling', 'feelings',
      'rehabilitation', 'physical therapy', 'joint pain', 'muscle pain'
    ];
    
    // Home care keywords
    const nurseKeywords = [
      'nurse', 'injury', 'wound', 'dressing', 'injection', 'blood pressure',
      'medicine', 'medication', 'elder', 'senior', 'post-surgery', 'home care',
      'caregiving', 'medical', 'bandage', 'hygiene', 'wheelchair', 'walker'
    ];
    
    let therapistScore = 0;
    let nurseScore = 0;
    
    therapistKeywords.forEach(keyword => {
      if (lowercaseText.includes(keyword)) therapistScore++;
    });
    
    nurseKeywords.forEach(keyword => {
      if (lowercaseText.includes(keyword)) nurseScore++;
    });
    
    if (therapistScore > nurseScore) return 'Therapist';
    if (nurseScore > therapistScore) return 'Home Nurse';
    if (therapistScore > 0) return 'Therapist';  // Default to Therapist if equal but > 0
    
    return null;  // No clear match
  };

  const handleBookAppointment = (employeeId) => {
    if (!localStorage.getItem('patientToken')) {
      sessionStorage.setItem('redirectAfterLogin', `/patient-dashboard/book-appointment/${employeeId}`);
      navigate('/patient-login');
      return;
    }
    navigate(`/patient-dashboard/book-appointment/${employeeId}`);
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box component={motion.div}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Paper elevation={3} sx={{ p: 4, borderRadius: 2, mb: 4, background: 'linear-gradient(145deg, #ffffff, #f5f8ff)' }}>
          <Typography variant="h4" gutterBottom align="center" fontWeight="bold" sx={{ mb: 3, color: 'primary.main' }}>
            AI Health Advisor
          </Typography>
          
          <Typography variant="body1" align="center" sx={{ mb: 4 }}>
            Describe your health concern, and our AI will help you find the right healthcare professional.
          </Typography>
          
          <form onSubmit={handleSubmit}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="What health issue are you experiencing? (e.g., 'I've been feeling anxious lately')"
                value={input}
                onChange={handleInputChange}
                disabled={analyzing}
                sx={{ borderRadius: 2 }}
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={!input.trim() || analyzing}
                sx={{ px: 3, borderRadius: 2, minWidth: '56px' }}
              >
                {analyzing ? <CircularProgress size={24} color="inherit" /> : <SendIcon />}
              </Button>
            </Box>
          </form>
        </Paper>

        {apiError && (
          <Alert 
            severity="warning" 
            variant="filled"
            sx={{ mb: 3, borderRadius: 2 }}
            action={
              <Button color="inherit" size="small" onClick={() => setApiError(false)}>
                Dismiss
              </Button>
            }
          >
            {error}
          </Alert>
        )}

        {analyzing && (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress />
          </Box>
        )}

        {result && (
          <Box sx={{ mt: 4, animation: 'fadeIn 0.5s ease-in-out' }} component={motion.div}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Paper elevation={3} sx={{ p: 4, borderRadius: 2, mb: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, gap: 2 }}>
                <Avatar sx={{ bgcolor: 'primary.main' }}>
                  {result.matched_service === 'Home Nurse' ? <LocalHospital /> : <Psychology />}
                </Avatar>
                <Typography variant="h5" fontWeight="bold" color="primary.main">
                  {result.matched_service} Recommended
                </Typography>
              </Box>
              
              <Typography variant="body1" paragraph sx={{ mb: 4 }}>
                {result.message}
              </Typography>
            </Paper>
            
            {result.professionals && result.professionals.length > 0 ? (
              <Grid container spacing={3}>
                {result.professionals.map((professional, index) => (
                  <Grid item xs={12} md={6} key={professional._id}>
                    <Card 
                      component={motion.div}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.1 * index }}
                      whileHover={{ y: -5, boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }}
                      sx={{ 
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        borderRadius: 2,
                        overflow: 'hidden',
                        boxShadow: 3
                      }}
                    >
                      <CardMedia
                        component="img"
                        height="160"
                        image={getImageUrl(professional.imageUrl || professional.image)}
                        alt={professional.name}
                        sx={{ objectFit: 'cover' }}
                        onError={(e) => {
                          console.error('Image load error:', e.target.src);
                          e.target.onerror = null;
                          e.target.src = 'https://via.placeholder.com/160x160?text=Profile';
                        }}
                      />
                      <CardContent sx={{ flexGrow: 1 }}>
                        <Typography variant="h6">{professional.name}</Typography>
                        
                        <Chip 
                          label={professional.serviceType} 
                          color="primary" 
                          size="small" 
                          sx={{ mt: 1, mb: 2 }}
                        />
                        
                        <Typography variant="body2" color="text.secondary" paragraph>
                          <strong>Experience:</strong> {professional.experience} years
                        </Typography>
                        
                        <Typography variant="body2" color="text.secondary" paragraph>
                          <strong>Location:</strong> {professional.location}
                        </Typography>
                        
                        <Typography variant="body2" color="text.secondary" paragraph>
                          <strong>Fee:</strong> ₹{professional.fee}/session
                        </Typography>
                        
                        <Button 
                          variant="contained" 
                          fullWidth
                          onClick={() => handleBookAppointment(professional._id)}
                          sx={{ mt: 2 }}
                        >
                          Book Appointment
                        </Button>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Paper 
                elevation={2} 
                sx={{ 
                  p: 4, 
                  borderRadius: 2, 
                  textAlign: 'center',
                  bgcolor: 'rgba(255,229,100,0.1)',
                  borderLeft: '4px solid #ffe564'
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, mb: 2 }}>
                  <ErrorOutline color="warning" fontSize="large" />
                  <Typography variant="h6" color="text.primary">
                    No matching professionals found
                  </Typography>
                </Box>
                <Typography variant="body1">
                  We couldn't find matching healthcare professionals for your query.
                  Please try describing your health concern differently or explore all our professionals.
                </Typography>
                <Button 
                  variant="outlined" 
                  color="primary"
                  onClick={() => navigate('/employees')}
                  sx={{ mt: 3 }}
                >
                  View All Professionals
                </Button>
              </Paper>
            )}
            
            {result.professionals && result.professionals.length > 0 && (
              <Box sx={{ mt: 3, textAlign: 'center' }}>
                <Button 
                  variant="outlined" 
                  onClick={() => navigate(`/employees?serviceType=${encodeURIComponent(result.matched_service)}`)}
                  sx={{ mt: 2 }}
                >
                  View All {result.matched_service}s
                </Button>
              </Box>
            )}
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default AIHelper;
