import React, { useState, useRef, useEffect } from 'react';
import { 
  Box, 
  Container, 
  Paper, 
  TextField, 
  Button, 
  Typography, 
  Avatar, 
  Grid,
  Card, 
  CardContent, 
  CardMedia, 
  Chip,
  CircularProgress,
  Divider,
  IconButton,
  useTheme
} from '@mui/material';
import { 
  Send as SendIcon, 
  SmartToy as BotIcon,
  Person as PersonIcon,
  ArrowForward,
  HealthAndSafety,
  Psychology,
  LocalHospital
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';

const Chatbot = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm your AI Health Assistant. How can I help you today?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [suggestedEmployees, setSuggestedEmployees] = useState([]);
  const [showingSuggestions, setShowingSuggestions] = useState(false);
  const [conversationHistory, setConversationHistory] = useState([
    { role: "system", content: "You are a helpful healthcare assistant that provides information about health concerns and recommends appropriate healthcare professionals." }
  ]);
  const messagesEndRef = useRef(null);
  const theme = useTheme();
  const navigate = useNavigate();

  const getImageUrl = (imagePath) => {
    if (!imagePath) return 'https://via.placeholder.com/140x140?text=Healthcare+Professional';
    
    try {
      const cleanPath = imagePath.replace(/^\/+/, '');
      if (cleanPath.startsWith('http')) return cleanPath;
      return `http://localhost:8080/${cleanPath}`;
    } catch (error) {
      console.error('Error processing image path:', error);
      return 'https://via.placeholder.com/140x140?text=Healthcare+Professional';
    }
  };

  const keywordMap = {
    'Therapist': [
      'anxiety', 'depression', 'stress', 'mental health', 'therapy', 'counseling', 
      'emotions', 'trauma', 'grief', 'mood', 'psychologist', 'psychiatrist', 'therapist',
      'panic attack', 'ocd', 'insomnia', 'adhd', 'phobia', 'bipolar', 'schizophrenia',
      'eating disorder', 'anorexia', 'bulimia', 'psychological', 'emotional', 'mental',
      'cognitive', 'behavioral', 'ptsd', 'post-traumatic', 'addiction', 'substance abuse',
      'alcoholism', 'suicide', 'self-harm', 'suicidal', 'thoughts', 'feeling sad',
      'feeling anxious', 'panic', 'worry', 'worrying', 'can\'t sleep', 'nightmares',
      'social anxiety', 'agoraphobia', 'claustrophobia', 'fear', 'therapy session',
      'relationship problems', 'family therapy', 'couples counseling', 'marriage counseling',
      'childhood trauma', 'burnout', 'overwhelming', 'hopeless', 'helpless', 'lonely',
      'isolation', 'paranoia', 'delusions', 'hallucinations', 'mood swings',
      'anger management', 'emotional regulation', 'low self-esteem', 'identity crisis',
      'life transition', 'grief counseling', 'bereavement', 'loss', 'autism', 'autism spectrum',
      'asperger', 'personality disorder', 'borderline', 'narcissistic', 'antisocial'
    ],
    'Home Nurse': [
      'injury', 'wound', 'dressing', 'injection', 'blood pressure', 'diabetes', 'glucose',
      'medicine', 'medication', 'nurse', 'nursing', 'physiotherapy', 'physical therapy',
      'mobility', 'elder care', 'elderly', 'senior', 'geriatric', 'post-surgery', 'post-operative',
      'surgery recovery', 'home care', 'caregiving', 'medical assistance', 'IV', 'catheter',
      'bandage', 'changing bandages', 'bed sores', 'pressure ulcers', 'feeding tube',
      'bath assistance', 'bathing help', 'hygiene', 'personal care', 'wheelchair', 'walker',
      'crutches', 'medical equipment', 'vital signs', 'blood test', 'injection', 'shot',
      'insulin', 'dialysis', 'kidney', 'heart monitor', 'cardiac care', 'respiratory',
      'breathing', 'oxygen', 'nebulizer', 'inhaler', 'asthma', 'copd', 'pulmonary',
      'stroke recovery', 'rehabilitation', 'physical rehabilitation', 'occupational therapy',
      'speech therapy', 'wound care', 'changing dressings', 'suture removal', 'stitches',
      'staples', 'drain care', 'tube feeding', 'medication management', 'pill organizer',
      'forgot to take medicine', 'medicine reminder', 'falls', 'fall prevention', 'balance problems',
      'difficulty walking', 'immobile', 'bedridden', 'paralysis', 'paralyzed', 'amputation',
      'prosthetic', 'artificial limb', 'hospice', 'palliative care', 'terminal illness',
      'chronic pain', 'pain management', 'patient assistance', 'caregiver', 'home health aide',
      'dementia care', 'alzheimer', 'memory care', 'cancer care', 'oncology', 'chemotherapy'
    ]
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const analyzeProblem = (text) => {
    const lowercaseText = text.toLowerCase();
    const scores = {};
    let maxScore = 0;
    let detectedType = null;
    
    for (const [type, keywords] of Object.entries(keywordMap)) {
      scores[type] = 0;
      
      for (const keyword of keywords) {
        const regex = new RegExp(`\\b${keyword}\\b`, 'i');
        if (regex.test(lowercaseText)) {
          scores[type] += 2;
        } else if (lowercaseText.includes(keyword.toLowerCase())) {
          scores[type] += 1;
        }
      }
      
      if (type === 'Therapist' && 
          (lowercaseText.includes('feel') || lowercaseText.includes('feeling') || 
           lowercaseText.includes('mind') || lowercaseText.includes('thoughts'))) {
        scores[type] += 1;
      }
      
      if (type === 'Home Nurse' && 
          (lowercaseText.includes('hurt') || lowercaseText.includes('pain') || 
           lowercaseText.includes('physical') || lowercaseText.includes('help with'))) {
        scores[type] += 1;
      }
      
      if (scores[type] > maxScore) {
        maxScore = scores[type];
        detectedType = type;
      }
    }
    
    return maxScore >= 2 ? detectedType : null;
  };

  const fetchEmployeesByType = async (serviceType) => {
    try {
      setLoading(true);
      const url = serviceType ? 
        `http://localhost:8080/api/employee/fetch?serviceType=${encodeURIComponent(serviceType)}` :
        'http://localhost:8080/api/employee/fetch';
        
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error('Failed to fetch professionals');
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching employees:', error);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const handleBookAppointment = (employeeId) => {
    if (!localStorage.getItem('patientToken')) {
      sessionStorage.setItem('redirectAfterLogin', `/patient-dashboard/book-appointment/${employeeId}`);
      
      setMessages(prev => [...prev, {
        id: prev.length + 1,
        text: "You need to login first before booking an appointment. I'll redirect you to the login page.",
        sender: 'bot',
        timestamp: new Date()
      }]);
      
      setTimeout(() => {
        navigate('/patient-login');
      }, 2000);
      
      return;
    }
    
    navigate(`/patient-dashboard/book-appointment/${employeeId}`);
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;
    
    const userMessage = {
      id: messages.length + 1,
      text: input,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);
    
    const updatedHistory = [
      ...conversationHistory,
      { role: "user", content: input }
    ];
    setConversationHistory(updatedHistory);
    
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);
      
      const response = await axios.post(
        'http://localhost:8080/api/ai/chat', 
        { messages: updatedHistory },
        {
          headers: { 'Content-Type': 'application/json' },
          signal: controller.signal
        }
      );
      
      clearTimeout(timeoutId);
      
      const aiMessage = response.data.message;
      
      setConversationHistory([
        ...updatedHistory,
        { role: "assistant", content: aiMessage }
      ]);
      
      const detectedType = analyzeProblem(input);
      
      const botResponse = {
        id: messages.length + 2,
        text: aiMessage,
        sender: 'bot',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botResponse]);
      
      if (detectedType) {
        const employees = await fetchEmployeesByType(detectedType);
        
        if (employees.length > 0) {
          setSuggestedEmployees(employees.slice(0, 3));
          setShowingSuggestions(true);
          
          const recommendationMessage = {
            id: messages.length + 3,
            text: `Based on your health concerns, I've found some ${detectedType} professionals who might be able to help you.`,
            sender: 'bot',
            timestamp: new Date(),
            detectedType: detectedType
          };
          
          setMessages(prev => [...prev, recommendationMessage]);
        }
      }
    } catch (error) {
      console.error('AI service error:', error);
      
      let errorMessage = 'Sorry, I had trouble processing your request.';
      
      if (error.name === 'AbortError' || error.code === 'ECONNABORTED') {
        errorMessage = 'The AI service is taking too long to respond. Let me try to help directly.';
      } else if (error.response?.status === 429) {
        errorMessage = 'Our AI service is experiencing high demand. Let me try to help you another way.';
      }
      
      setMessages(prev => [...prev, {
        id: messages.length + 2,
        text: errorMessage,
        sender: 'bot',
        timestamp: new Date()
      }]);
      
      setTimeout(async () => {
        const detectedType = analyzeProblem(input);
        
        if (detectedType) {
          const employees = await fetchEmployeesByType(detectedType);
          
          if (employees.length > 0) {
            setSuggestedEmployees(employees.slice(0, 3));
            setShowingSuggestions(true);
            
            const recommendationMessage = {
              id: messages.length + 3,
              text: `Based on your health concerns, I've found some ${detectedType} professionals who might be able to help you.`,
              sender: 'bot',
              timestamp: new Date(),
              detectedType: detectedType
            };
            
            setMessages(prev => [...prev, recommendationMessage]);
          }
        } else {
          setMessages(prev => [...prev, {
            id: messages.length + 3,
            text: "I'm not sure what specific health professional would be best for your needs. Could you provide more details about your symptoms or what kind of help you're looking for?",
            sender: 'bot',
            timestamp: new Date()
          }]);
          setShowingSuggestions(false);
        }
      }, 1000);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const viewAllProfessionals = (serviceType) => {
    if (serviceType) {
      navigate(`/employees?serviceType=${encodeURIComponent(serviceType)}`);
    } else {
      navigate('/employees');
    }
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper 
        elevation={3} 
        sx={{ 
          height: '80vh', 
          display: 'flex', 
          flexDirection: 'column',
          borderRadius: 3,
          overflow: 'hidden',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
        }}
      >
        <Box 
          sx={{ 
            p: 2, 
            bgcolor: theme.palette.primary.main, 
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
          }}
        >
          <BotIcon fontSize="large" />
          <Typography variant="h6">Health Advisor AI</Typography>
        </Box>
        
        <Box 
          sx={{ 
            flexGrow: 1, 
            p: 2, 
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            bgcolor: '#f5f8fb'
          }}
        >
          {messages.map((message) => (
            <Box
              key={message.id}
              sx={{
                display: 'flex',
                justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start',
                mb: 2,
              }}
            >
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                style={{ maxWidth: '70%' }}
              >
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                  {message.sender === 'bot' && (
                    <Avatar
                      sx={{
                        bgcolor: theme.palette.primary.main,
                        width: 32,
                        height: 32,
                      }}
                    >
                      <BotIcon fontSize="small" />
                    </Avatar>
                  )}
                  
                  <Paper
                    sx={{
                      p: 2,
                      bgcolor: message.sender === 'user' ? theme.palette.primary.main : 'white',
                      color: message.sender === 'user' ? 'white' : 'text.primary',
                      borderRadius: 2,
                      maxWidth: '100%',
                    }}
                  >
                    <Typography variant="body1">{message.text}</Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        display: 'block',
                        textAlign: message.sender === 'user' ? 'right' : 'left',
                        mt: 1,
                        opacity: 0.7,
                      }}
                    >
                      {formatTime(message.timestamp)}
                    </Typography>
                  </Paper>
                  
                  {message.sender === 'user' && (
                    <Avatar
                      sx={{
                        bgcolor: theme.palette.secondary.main,
                        width: 32,
                        height: 32,
                      }}
                    >
                      <PersonIcon fontSize="small" />
                    </Avatar>
                  )}
                </Box>
              </motion.div>
            </Box>
          ))}
          
          {loading && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, ml: 5 }}>
              <Avatar
                sx={{
                  bgcolor: theme.palette.primary.main,
                  width: 32,
                  height: 32,
                }}
              >
                <BotIcon fontSize="small" />
              </Avatar>
              <CircularProgress size={24} />
            </Box>
          )}
          
          {showingSuggestions && suggestedEmployees.length > 0 && (
            <Box sx={{ mt: 2, ml: 5 }}>
              <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2 }}>
                Recommended Healthcare Professionals:
              </Typography>
              
              <Grid container spacing={2}>
                {suggestedEmployees.map((employee) => (
                  <Grid item xs={12} sm={6} md={4} key={employee._id}>
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      <Card 
                        sx={{ 
                          height: '100%',
                          transition: 'transform 0.3s, box-shadow 0.3s',
                          '&:hover': {
                            transform: 'translateY(-5px)',
                            boxShadow: 5
                          }
                        }}
                      >
                        <CardMedia
                          component="img"
                          height="140"
                          image={getImageUrl(employee.image)}
                          alt={employee.firstName}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://via.placeholder.com/140x140?text=Profile';
                          }}
                        />
                        <CardContent>
                          <Typography variant="h6">{`${employee.firstName} ${employee.lastName}`}</Typography>
                          <Chip 
                            size="small" 
                            label={employee.serviceType} 
                            color="primary" 
                            sx={{ mt: 1, mb: 1 }}
                          />
                          <Typography variant="body2" color="text.secondary">
                            {`${employee.experience} years experience • ${employee.location}`}
                          </Typography>
                          <Button 
                            variant="outlined" 
                            size="small" 
                            sx={{ mt: 2 }}
                            onClick={() => handleBookAppointment(employee._id)}
                          >
                            Book Appointment
                          </Button>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </Grid>
                ))}
              </Grid>
              
              <Button
                variant="text"
                color="primary"
                onClick={() => viewAllProfessionals(messages.find(m => m.detectedType)?.detectedType)}
                endIcon={<ArrowForward />}
                sx={{ mt: 2 }}
              >
                View All Professionals
              </Button>
            </Box>
          )}
          
          <div ref={messagesEndRef} />
        </Box>
        
        <Box sx={{ p: 2, bgcolor: '#fff', borderTop: '1px solid #e0e0e0' }}>
          <Grid container spacing={1} alignItems="center">
            <Grid item xs>
              <TextField
                fullWidth
                placeholder="Type your health concern here..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                variant="outlined"
                disabled={loading}
                sx={{ '& fieldset': { borderRadius: 3 } }}
              />
            </Grid>
            <Grid item>
              <IconButton
                color="primary"
                onClick={handleSendMessage}
                disabled={!input.trim() || loading}
                sx={{
                  backgroundColor: theme.palette.primary.main,
                  color: 'white',
                  '&:hover': { backgroundColor: theme.palette.primary.dark },
                  '&.Mui-disabled': { backgroundColor: '#e0e0e0', color: '#a0a0a0' },
                  width: 45,
                  height: 45
                }}
              >
                <SendIcon />
              </IconButton>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
};

export default Chatbot;
