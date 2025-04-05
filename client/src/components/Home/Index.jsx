import React, { useState, useEffect } from 'react';
import medical from '../../assets/medical.jpg'
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Avatar,
  Rating,
  Chip,
  useTheme,
  alpha,
} from '@mui/material';
import {
  Psychology,
  MedicalServices,
  LocalHospital,
  AccessTime,
  Star,
  ArrowForward,
  Forum, 
  Article, 
  HealthAndSafety, 
  Medication, 
  People,
  ExpandMore,
  ExpandLess,
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const Index = () => {
  const [featuredEmployees, setFeaturedEmployees] = useState([]);
  const [reviews, setReviews] = useState([]);
  const theme = useTheme();
  const [expandedFaq, setExpandedFaq] = useState(null);

  useEffect(() => {
    fetchFeaturedEmployees();
  }, []);

  const fetchFeaturedEmployees = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/employee/fetch');
      const data = await response.json();
      setFeaturedEmployees(data.slice(0, 4));
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  const services = [
    {
      icon: <Psychology sx={{ fontSize: 40 }}/>,
      title: 'Mental Health Therapy',
      description: 'Professional counseling and therapy services for mental well-being'
    },
    {
      icon: <MedicalServices sx={{ fontSize: 40 }}/>,
      title: 'Home Nursing Care',
      description: 'Experienced nurses providing care in the comfort of your home'
    },
    {
      icon: <LocalHospital sx={{ fontSize: 40 }}/>,
      title: 'Medical Consultation',
      description: 'Expert medical advice and consultation services'
    },
    {
      icon: <AccessTime sx={{ fontSize: 40 }}/>,
      title: '24/7 Support',
      description: 'Round-the-clock healthcare support and assistance'
    }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Patient",
      image: "https://randomuser.me/api/portraits/women/1.jpg",
      content: "Outstanding care and professional service. The therapist was extremely helpful.",
      rating: 5
    },
    {
      name: "Mike Wilson",
      role: "Patient",
      image: "https://randomuser.me/api/portraits/men/2.jpg",
      content: "Found the perfect home nurse through this platform. Highly recommended!",
      rating: 5
    },
    {
      name: "Emma Davis",
      role: "Patient",
      image: "https://randomuser.me/api/portraits/women/3.jpg",
      content: "Great experience with the mental health services. Very supportive staff.",
      rating: 4
    }
  ];

  const faqs = [
    {
      question: "How do I book an appointment?",
      answer: "Simply browse our healthcare professionals, select one that matches your needs, and click the 'Book Now' button. You'll be guided through the booking process step by step."
    },
    {
      question: "What types of healthcare services do you offer?",
      answer: "We offer a range of services including mental health therapy and home nursing care. Our professionals are qualified and experienced in their respective fields."
    },
    {
      question: "How are your healthcare professionals verified?",
      answer: "All our healthcare professionals undergo a rigorous verification process including background checks, license verification, and reference checks to ensure quality care."
    },
    {
      question: "What are your payment terms?",
      answer: "We accept various payment methods. The fees vary by professional and are clearly listed on their profiles. Payment is secure and processed at the time of booking."
    },
    {
      question: "Can I cancel or reschedule my appointment?",
      answer: "Yes, you can cancel or reschedule appointments up to 24 hours before the scheduled time without any penalty through your dashboard."
    }
  ];

  return (
    <Box sx={{ overflow: 'hidden' }}>
      {/* Hero Section */}
      <Box
        sx={{
          background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
          color: 'white',
          py: { xs: 8, md: 15 },
          borderRadius: '0 0 50px 50px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                <Typography variant="h2" fontWeight="bold" gutterBottom>
                  Your Health, Our Priority
                </Typography>
                <Typography variant="h5" sx={{ mb: 4, opacity: 0.9 }}>
                  Connect with top healthcare professionals from the comfort of your home
                </Typography>
                <Button
                href='/employees'
                  variant="contained"
                  size="large"
                  sx={{
                    backgroundColor: 'white',
                    color: theme.palette.primary.main,
                    '&:hover': {
                      backgroundColor: alpha(theme.palette.common.white, 0.9),
                    },
                  }}
                  endIcon={<ArrowForward />}
                >
                  Book Appointment
                </Button>
              </motion.div>
            </Grid>
            <Grid item xs={12} md={6}>
              <motion.img
                src={medical} // Add your hero image
                alt="Healthcare"
                style={{ 
                  width: '100%',
                  maxWidth: 500,
                  height: 'auto',
                  borderRadius: '20px'
                }}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Services Section */}
      <Container sx={{ py: 8 }}>
        <Typography variant="h3" textAlign="center" gutterBottom>
          Our Services
        </Typography>
        <Grid container spacing={4} sx={{ mt: 4 }}>
          {services.map((service, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    p: 3,
                    textAlign: 'center',
                    borderRadius: '20px',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      transition: 'transform 0.3s ease-in-out',
                    },
                  }}
                >
                  <Box sx={{ color: theme.palette.primary.main, mb: 2 }}>
                    {service.icon}
                  </Box>
                  <Typography variant="h6" gutterBottom>
                    {service.title}
                  </Typography>
                  <Typography color="text.secondary">
                    {service.description}
                  </Typography>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* AI Chatbot Section */}
      <Box 
        sx={{ 
          py: 8, 
          bgcolor: 'background.default',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(circle at top right, rgba(25,118,210,0.05) 0%, transparent 70%)',
            zIndex: 0
          }
        }}
      >
        <Container>
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6} sx={{ position: 'relative', zIndex: 1 }}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <Typography 
                  variant="h3" 
                  sx={{ 
                    mb: 2,
                    fontWeight: 'bold',
                    background: 'linear-gradient(45deg, #2196F3 30%, #00E5FF 90%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  Meet Our AI Health Assistant
                </Typography>
                <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
                  Get instant answers to your health questions, 24/7 support, and 
                  personalized guidance with our AI-powered healthcare chatbot.
                </Typography>
                <Box sx={{ mb: 4 }}>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    • Get quick answers to common health questions
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    • Available 24/7 for immediate assistance
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    • Privacy-focused and personalized responses
                  </Typography>
                </Box>
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => window.location.href = '/chatbot'}
                  endIcon={<ArrowForward />}
                  sx={{
                    borderRadius: '30px',
                    py: 1.5,
                    px: 4,
                    textTransform: 'none',
                    fontWeight: 'bold',
                    fontSize: '1.1rem',
                    boxShadow: theme => `0 8px 16px ${alpha(theme.palette.primary.main, 0.3)}`,
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: theme => `0 12px 20px ${alpha(theme.palette.primary.main, 0.5)}`,
                      transition: 'transform 0.3s, box-shadow 0.3s'
                    }
                  }}
                >
                  Chat Now
                </Button>
              </motion.div>
            </Grid>
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Box
                  component="img"
                  src="https://via.placeholder.com/600x400?text=AI+Health+Assistant"
                  alt="AI Health Assistant"
                  sx={{
                    width: '100%',
                    maxWidth: 500,
                    height: 'auto',
                    borderRadius: '20px',
                    boxShadow: '0 16px 32px rgba(0,0,0,0.15)',
                    transform: 'perspective(800px) rotateY(-5deg)',
                  }}
                />
              </motion.div>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Featured Professionals */}
      <Box sx={{ bgcolor: 'grey.50', py: 8, borderRadius: '50px 50px 0 0' }}>
        <Container>
          <Typography variant="h3" textAlign="center" gutterBottom>
            Meet Our Professionals
          </Typography>
          <Grid container spacing={4} sx={{ mt: 4 }}>
            {featuredEmployees.map((employee, index) => (
              <Grid item xs={12} sm={6} md={3} key={employee._id}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card
                    sx={{
                      height: '100%',
                      borderRadius: '20px',
                      overflow: 'hidden',
                      boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                    }}
                  >
                    <CardMedia
                      component="img"
                      height="200"
                      image={`http://localhost:8080/api/employee/${employee.image}`}
                      alt={employee.firstName}
                    />
                    <CardContent>
                      <Typography variant="h6">
                        {`${employee.firstName} ${employee.lastName}`}
                      </Typography>
                      <Chip
                        label={employee.serviceType}
                        color="primary"
                        size="small"
                        sx={{ mt: 1 }}
                      />
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        {employee.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Statistics Section */}
      <Box 
        sx={{
          bgcolor: theme.palette.primary.main,
          color: 'white',
          py: 8,
          textAlign: 'center'
        }}
      >
        <Container>
          <Grid container spacing={4}>
            {[
              { number: '1000+', label: 'Happy Patients' },
              { number: '50+', label: 'Expert Professionals' },
              { number: '24/7', label: 'Available Support' },
              { number: '4.9', label: 'Average Rating' },
            ].map((stat, index) => (
              <Grid item xs={6} md={3} key={index}>
                <Typography variant="h3" fontWeight="bold">
                  {stat.number}
                </Typography>
                <Typography variant="subtitle1">
                  {stat.label}
                </Typography>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box sx={{ py: 8 }}>
        <Container>
          <Card
            sx={{
              p: 4,
              borderRadius: '20px',
              background: `linear-gradient(45deg, ${theme.palette.secondary.main}, ${theme.palette.primary.main})`,
              color: 'white',
            }}
          >
            <Grid container alignItems="center" spacing={4}>
              <Grid item xs={12} md={8}>
                <Typography variant="h4" gutterBottom>
                  Ready to Get Started?
                </Typography>
                <Typography variant="subtitle1">
                  Book your appointment now and take the first step towards better health.
                </Typography>
              </Grid>
              <Grid item xs={12} md={4} sx={{ textAlign: 'center' }}>
                <Button
                  variant="contained"
                  size="large"
                  sx={{
                    bgcolor: 'white',
                    color: theme.palette.primary.main,
                    '&:hover': {
                      bgcolor: alpha(theme.palette.common.white, 0.9),
                    },
                  }}
                >
                  Book Now
                </Button>
              </Grid>
            </Grid>
          </Card>
        </Container>
      </Box>

      {/* Testimonials Section */}
      <Box sx={{ py: 8, bgcolor: 'grey.50' }}>
        <Container>
          <Typography variant="h3" textAlign="center" gutterBottom>
            Patient Testimonials
          </Typography>
          <Grid container spacing={4} sx={{ mt: 4 }}>
            {testimonials.map((testimonial, index) => (
              <Grid item xs={12} md={4} key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card sx={{ 
                    height: '100%', 
                    p: 3, 
                    borderRadius: 4,
                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                  }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Avatar 
                        src={testimonial.image} 
                        sx={{ width: 60, height: 60, mr: 2 }}
                      />
                      <Box>
                        <Typography variant="h6">{testimonial.name}</Typography>
                        <Typography color="text.secondary">{testimonial.role}</Typography>
                      </Box>
                    </Box>
                    <Typography sx={{ mb: 2, fontStyle: 'italic' }}>
                      "{testimonial.content}"
                    </Typography>
                    <Rating value={testimonial.rating} readOnly />
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Healthcare Tips Section */}
      <Box sx={{ py: 8 }}>
        <Container>
          <Typography variant="h3" textAlign="center" gutterBottom>
            Healthcare Tips & Resources
          </Typography>
          <Grid container spacing={4} sx={{ mt: 4 }}>
            {[
              {
                icon: <HealthAndSafety sx={{ fontSize: 40 }} />,
                title: "Mental Wellness Guide",
                content: "Expert tips for maintaining mental health and emotional well-being."
              },
              {
                icon: <Medication sx={{ fontSize: 40 }} />,
                title: "Home Care Tips",
                content: "Essential guidelines for providing effective home care to loved ones."
              },
              {
                icon: <People sx={{ fontSize: 40 }} />,
                title: "Family Health",
                content: "Comprehensive advice for managing family healthcare needs."
              }
            ].map((tip, index) => (
              <Grid item xs={12} md={4} key={index}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card sx={{
                    height: '100%',
                    p: 3,
                    borderRadius: 4,
                    textAlign: 'center',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      transition: 'transform 0.3s'
                    }
                  }}>
                    <Box sx={{ color: 'primary.main', mb: 2 }}>
                      {tip.icon}
                    </Box>
                    <Typography variant="h6" gutterBottom>{tip.title}</Typography>
                    <Typography color="text.secondary">{tip.content}</Typography>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* FAQ Section */}
      <Box sx={{ py: 8 }}>
        <Container>
          <Typography
            variant="h3"
            textAlign="center"
            gutterBottom
            sx={{ mb: 6 }}
          >
            Frequently Asked Questions
          </Typography>
          <Grid container justifyContent="center">
            <Grid item xs={12} md={8}>
              {faqs.map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card
                    sx={{
                      mb: 2,
                      overflow: 'hidden',
                      boxShadow: expandedFaq === index ? 3 : 1,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        boxShadow: 3,
                      },
                    }}
                  >
                    <CardContent
                      sx={{
                        p: 0,
                        '&:last-child': { pb: 0 },
                      }}
                    >
                      <Button
                        onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                        sx={{
                          width: '100%',
                          justifyContent: 'space-between',
                          p: 2,
                          textAlign: 'left',
                          color: 'text.primary',
                        }}
                      >
                        <Typography variant="subtitle1" fontWeight="medium">
                          {faq.question}
                        </Typography>
                        {expandedFaq === index ? (
                          <ExpandLess color="primary" />
                        ) : (
                          <ExpandMore color="primary" />
                        )}
                      </Button>
                      <motion.div
                        initial={false}
                        animate={{ height: expandedFaq === index ? 'auto' : 0 }}
                        style={{ overflow: 'hidden' }}
                      >
                        <Typography
                          sx={{
                            p: 2,
                            pt: 0,
                            color: 'text.secondary',
                          }}
                        >
                          {faq.answer}
                        </Typography>
                      </motion.div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Partners Section */}
      <Box sx={{ py: 8, bgcolor: 'grey.50' }}>
        <Container>
          <Typography variant="h3" textAlign="center" gutterBottom>
            Our Partners
          </Typography>
          <Typography variant="subtitle1" textAlign="center" color="text.secondary" sx={{ mb: 6 }}>
            Trusted by leading healthcare institutions
          </Typography>
          <Grid container spacing={4} alignItems="center">
            {[1, 2, 3, 4, 5, 6].map((partner) => (
              <Grid item xs={6} sm={4} md={2} key={partner}>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: partner * 0.1 }}
                >
                  <Box
                    component="img"
                    src={`https://via.placeholder.com/150x80?text=Partner${partner}`}
                    alt={`Healthcare Partner ${partner}`}
                    sx={{
                      width: '100%',
                      filter: 'grayscale(100%)',
                      opacity: 0.7,
                      transition: 'all 0.3s',
                      '&:hover': {
                        filter: 'grayscale(0%)',
                        opacity: 1
                      }
                    }}
                  />
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default Index;
