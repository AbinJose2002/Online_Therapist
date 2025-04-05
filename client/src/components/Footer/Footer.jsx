import React from 'react';
import { Box, Container, Grid, Typography, Link, Divider, Stack, IconButton } from '@mui/material';
import { 
  Facebook as FacebookIcon, 
  Twitter as TwitterIcon, 
  Instagram as InstagramIcon, 
  LinkedIn as LinkedInIcon,
  LocationOn as LocationIcon,
  Phone as PhoneIcon,
  Email as EmailIcon
} from '@mui/icons-material';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <Box 
      component="footer" 
      sx={{ 
        bgcolor: 'primary.dark', 
        color: 'white',
        mt: 'auto',
        pt: 6,
        pb: 3
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Company Info */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom>
              HealthConnect
            </Typography>
            <Typography variant="body2" sx={{ mb: 2, opacity: 0.7 }}>
              Connecting patients with trusted healthcare professionals for better and more accessible healthcare services.
            </Typography>
            <Stack direction="row" spacing={1}>
              <IconButton size="small" sx={{ color: 'white' }}>
                <FacebookIcon />
              </IconButton>
              <IconButton size="small" sx={{ color: 'white' }}>
                <TwitterIcon />
              </IconButton>
              <IconButton size="small" sx={{ color: 'white' }}>
                <InstagramIcon />
              </IconButton>
              <IconButton size="small" sx={{ color: 'white' }}>
                <LinkedInIcon />
              </IconButton>
            </Stack>
          </Grid>

          {/* Quick Links */}
          <Grid item xs={12} sm={6} md={2}>
            <Typography variant="h6" gutterBottom>
              Quick Links
            </Typography>
            <Stack spacing={1}>
              {['Home', 'About Us', 'Services', 'Professionals', 'Contact'].map((item) => (
                <Link 
                  key={item} 
                  href="#" 
                  underline="hover" 
                  color="inherit"
                  sx={{ opacity: 0.7, '&:hover': { opacity: 1 } }}
                >
                  {item}
                </Link>
              ))}
            </Stack>
          </Grid>

          {/* Services */}
          <Grid item xs={12} sm={6} md={2}>
            <Typography variant="h6" gutterBottom>
              Services
            </Typography>
            <Stack spacing={1}>
              {['Therapy', 'Home Care', 'Medical Advice', 'Appointments', 'Support'].map((item) => (
                <Link 
                  key={item} 
                  href="#" 
                  underline="hover" 
                  color="inherit"
                  sx={{ opacity: 0.7, '&:hover': { opacity: 1 } }}
                >
                  {item}
                </Link>
              ))}
            </Stack>
          </Grid>

          {/* Contact Info */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom>
              Contact Us
            </Typography>
            <Stack spacing={2}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <LocationIcon fontSize="small" />
                <Typography variant="body2" sx={{ opacity: 0.7 }}>
                  123 Healthcare Avenue, Medical District, 12345
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <PhoneIcon fontSize="small" />
                <Typography variant="body2" sx={{ opacity: 0.7 }}>
                  +1 (555) 123-4567
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <EmailIcon fontSize="small" />
                <Typography variant="body2" sx={{ opacity: 0.7 }}>
                  info@healthconnect.com
                </Typography>
              </Box>
            </Stack>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4, bgcolor: 'rgba(255, 255, 255, 0.1)' }} />

        <Box sx={{ display: 'flex', justifyContent: { xs: 'center', sm: 'space-between' }, flexDirection: { xs: 'column', sm: 'row' }, alignItems: 'center', textAlign: { xs: 'center', sm: 'left' } }}>
          <Typography variant="body2" sx={{ opacity: 0.7 }}>
            © {currentYear} HealthConnect. All rights reserved.
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, mt: { xs: 2, sm: 0 } }}>
            <Link href="#" color="inherit" underline="hover" sx={{ opacity: 0.7, '&:hover': { opacity: 1 } }}>
              Privacy Policy
            </Link>
            <Link href="#" color="inherit" underline="hover" sx={{ opacity: 0.7, '&:hover': { opacity: 1 } }}>
              Terms of Service
            </Link>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
