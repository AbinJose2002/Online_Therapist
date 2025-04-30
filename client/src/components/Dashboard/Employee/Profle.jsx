<<<<<<< HEAD
import React, { useState, useEffect } from 'react';
=======
import React, { useState, useEffect, useRef } from 'react';
>>>>>>> f13231d (bot set)
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Alert,
  CircularProgress,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
<<<<<<< HEAD
} from '@mui/material';
import { Edit as EditIcon, Save as SaveIcon } from '@mui/icons-material';
=======
  Avatar,
  Divider,
  Card,
  CardMedia,
  IconButton,
  Snackbar,
  Fade,
  Tooltip,
} from '@mui/material';
import { 
  Edit as EditIcon, 
  Save as SaveIcon, 
  PhotoCamera, 
  UploadFile,
  Cancel,
  Business,
  Phone,
  Email,
  AccessTime,
  MonetizationOn,
  Category
} from '@mui/icons-material';
import { motion } from 'framer-motion';
>>>>>>> f13231d (bot set)

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
<<<<<<< HEAD
=======
  const [newImage, setNewImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef(null);

  // Get API base URL
  const API_BASE_URL = 'http://localhost:8080';
>>>>>>> f13231d (bot set)

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('empToken');
<<<<<<< HEAD
      const response = await fetch('http://localhost:8080/api/employee/profile', {
=======
      const response = await fetch(`${API_BASE_URL}/api/employee/profile`, {
>>>>>>> f13231d (bot set)
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch profile');
      }

      const data = await response.json();
      setProfile(data);
      setFormData(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

<<<<<<< HEAD
=======
  const getImageUrl = (imagePath) => {
    if (!imagePath) return 'https://via.placeholder.com/150?text=Profile';
    
    try {
      // Clean the path
      const cleanPath = imagePath.replace(/^\/+/, '');
      return `${API_BASE_URL}/${cleanPath}`;
    } catch (error) {
      console.error('Error processing image path:', error);
      return 'https://via.placeholder.com/150?text=Profile';
    }
  };

>>>>>>> f13231d (bot set)
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

<<<<<<< HEAD
=======
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be less than 5MB');
      return;
    }

    if (!file.type.match('image.*')) {
      setError('Please select an image file');
      return;
    }

    setNewImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const cancelImageUpload = () => {
    setNewImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const uploadImage = async () => {
    if (!newImage) return;

    try {
      setUploadingImage(true);
      setError('');
      const token = localStorage.getItem('empToken');

      const formData = new FormData();
      formData.append('image', newImage);

      // Debug logs
      console.log('Uploading image:', newImage.name, 'Size:', newImage.size);
      console.log('Form data entries:', [...formData.entries()]);

      // Add headers debug
      const response = await fetch(`${API_BASE_URL}/api/employee/profile/image`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          // Don't set Content-Type with FormData
        },
        body: formData,
      });

      // Debug response
      console.log('Upload response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to upload image');
      }

      const data = await response.json();
      console.log('Upload response data:', data);
      
      setProfile({...profile, image: data.image});
      setSuccess('Profile picture updated successfully!');
      cancelImageUpload();
      
      // Refresh profile
      fetchProfile();
    } catch (error) {
      console.error('Image upload error:', error);
      setError(error.message);
    } finally {
      setUploadingImage(false);
    }
  };

>>>>>>> f13231d (bot set)
  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError('');
      const token = localStorage.getItem('empToken');

<<<<<<< HEAD
      const response = await fetch('http://localhost:8080/api/employee/profile', {
=======
      const response = await fetch(`${API_BASE_URL}/api/employee/profile`, {
>>>>>>> f13231d (bot set)
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      const updatedProfile = await response.json();
      setProfile(updatedProfile);
      setIsEditing(false);
      setSuccess('Profile updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

<<<<<<< HEAD
  if (loading) {
    return <Box display="flex" justifyContent="center" py={4}><CircularProgress /></Box>;
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
          <Typography variant="h4">Profile</Typography>
          <Button
            startIcon={isEditing ? <SaveIcon /> : <EditIcon />}
            variant="contained"
            onClick={isEditing ? handleSubmit : () => setIsEditing(true)}
          >
            {isEditing ? 'Save Changes' : 'Edit Profile'}
          </Button>
        </Box>

        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 3 }}>{success}</Alert>}

        <Grid container spacing={3}>
          {/* Form fields */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="First Name"
              name="firstName"
              value={formData.firstName || ''}
              onChange={handleChange}
              disabled={!isEditing}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Last Name"
              name="lastName"
              value={formData.lastName || ''}
              onChange={handleChange}
              disabled={!isEditing}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Email"
              name="email"
              value={formData.email || ''}
              disabled
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Phone Number"
              name="number"
              value={formData.number || ''}
              onChange={handleChange}
              disabled={!isEditing}
            />
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth disabled={!isEditing}>
              <InputLabel>Service Type</InputLabel>
              <Select
                name="serviceType"
                value={formData.serviceType || ''}
                onChange={handleChange}
                label="Service Type"
              >
                <MenuItem value="Therapist">Therapist</MenuItem>
                <MenuItem value="Home Nurse">Home Nurse</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Description"
              name="description"
              value={formData.description || ''}
              onChange={handleChange}
              disabled={!isEditing}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Experience (years)"
              name="experience"
              type="number"
              value={formData.experience || ''}
              onChange={handleChange}
              disabled={!isEditing}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Location"
              name="location"
              value={formData.location || ''}
              onChange={handleChange}
              disabled={!isEditing}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Consultation Fee ($)"
              name="fee"
              type="number"
              value={formData.fee || ''}
              onChange={handleChange}
              disabled={!isEditing}
            />
          </Grid>
        </Grid>
      </Paper>
=======
  if (loading && !profile) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Grid container spacing={4}>
          {/* Profile Header with Image */}
          <Grid item xs={12}>
            <Card 
              elevation={3} 
              sx={{ 
                p: 4, 
                borderRadius: 2, 
                backgroundImage: 'linear-gradient(135deg, #3f51b5 0%, #5c6bc0 100%)',
                color: 'white',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <Box 
                sx={{ 
                  position: 'absolute', 
                  top: 0, 
                  right: 0, 
                  bottom: 0, 
                  left: 0, 
                  background: 'radial-gradient(circle at top right, rgba(255,255,255,0.1) 0%, transparent 70%)',
                }}
              />
              <Grid container alignItems="center" spacing={3}>
                <Grid item xs={12} md={4} sx={{textAlign: {xs: 'center', md: 'left'}}}>
                  <Box sx={{ position: 'relative', display: 'inline-block' }}>
                    <Avatar
                      src={imagePreview || getImageUrl(profile?.image)}
                      alt={profile?.firstName}
                      sx={{ 
                        width: 150, 
                        height: 150, 
                        border: '4px solid white',
                        boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
                      }}
                    />
                    <input
                      type="file"
                      accept="image/*"
                      style={{ display: 'none' }}
                      onChange={handleImageChange}
                      ref={fileInputRef}
                    />
                    <Tooltip title="Change profile picture">
                      <IconButton
                        color="primary"
                        aria-label="upload picture"
                        component="span"
                        onClick={() => fileInputRef.current.click()}
                        sx={{ 
                          position: 'absolute', 
                          bottom: 0, 
                          right: 0, 
                          backgroundColor: 'white',
                          '&:hover': { backgroundColor: '#f0f0f0' },
                        }}
                      >
                        <PhotoCamera />
                      </IconButton>
                    </Tooltip>
                  </Box>
                  
                  {newImage && (
                    <Box sx={{ mt: 2, display: 'flex', justifyContent: {xs: 'center', md: 'flex-start'}, gap: 1 }}>
                      <Button
                        variant="contained"
                        color="success"
                        size="small"
                        startIcon={<UploadFile />}
                        onClick={uploadImage}
                        disabled={uploadingImage}
                      >
                        {uploadingImage ? 'Uploading...' : 'Upload New Picture'}
                      </Button>
                      <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        startIcon={<Cancel />}
                        onClick={cancelImageUpload}
                        sx={{ bgcolor: 'rgba(255,255,255,0.1)' }}
                      >
                        Cancel
                      </Button>
                    </Box>
                  )}
                </Grid>

                <Grid item xs={12} md={8}>
                  <Typography variant="h4" fontWeight="bold" gutterBottom>
                    {profile?.firstName} {profile?.lastName}
                  </Typography>
                  <Typography variant="h6" sx={{ opacity: 0.9, mb: 1 }}>
                    {profile?.serviceType}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <Business fontSize="small" />
                    <Typography variant="body1">
                      {profile?.location}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <AccessTime fontSize="small" />
                    <Typography variant="body1">
                      {profile?.experience} years of experience
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <MonetizationOn fontSize="small" />
                    <Typography variant="body1">
                      ₹{profile?.fee}/session
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Card>
          </Grid>

          {/* Profile Details */}
          <Grid item xs={12}>
            <Card elevation={3} sx={{ p: 3, borderRadius: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h5" fontWeight="medium">Profile Details</Typography>
                <Button
                  variant={isEditing ? "contained" : "outlined"}
                  startIcon={isEditing ? <SaveIcon /> : <EditIcon />}
                  color={isEditing ? "success" : "primary"}
                  onClick={isEditing ? handleSubmit : () => setIsEditing(true)}
                  sx={{ 
                    borderRadius: 8,
                    px: 3,
                    boxShadow: isEditing ? 2 : 0
                  }}
                >
                  {isEditing ? 'Save Changes' : 'Edit Profile'}
                </Button>
              </Box>

              {error && (
                <Alert 
                  severity="error" 
                  sx={{ mb: 3 }}
                  onClose={() => setError('')}
                >
                  {error}
                </Alert>
              )}

              {success && (
                <Alert 
                  severity="success" 
                  sx={{ mb: 3 }}
                  onClose={() => setSuccess('')}
                >
                  {success}
                </Alert>
              )}

              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="First Name"
                    name="firstName"
                    value={formData.firstName || ''}
                    onChange={handleChange}
                    disabled={!isEditing}
                    variant="outlined"
                    InputProps={{
                      sx: { borderRadius: 2 }
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Last Name"
                    name="lastName"
                    value={formData.lastName || ''}
                    onChange={handleChange}
                    disabled={!isEditing}
                    variant="outlined"
                    InputProps={{
                      sx: { borderRadius: 2 }
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Email"
                    name="email"
                    value={formData.email || ''}
                    disabled
                    variant="outlined"
                    InputProps={{
                      startAdornment: <Email color="action" sx={{ mr: 1 }} />,
                      sx: { borderRadius: 2 }
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Phone Number"
                    name="number"
                    value={formData.number || ''}
                    onChange={handleChange}
                    disabled={!isEditing}
                    variant="outlined"
                    InputProps={{
                      startAdornment: <Phone color="action" sx={{ mr: 1 }} />,
                      sx: { borderRadius: 2 }
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth disabled={!isEditing} variant="outlined">
                    <InputLabel>Service Type</InputLabel>
                    <Select
                      name="serviceType"
                      value={formData.serviceType || ''}
                      onChange={handleChange}
                      label="Service Type"
                      startAdornment={<Category color="action" sx={{ ml: 1, mr: 2 }} />}
                      sx={{ borderRadius: 2 }}
                    >
                      <MenuItem value="Therapist">Therapist</MenuItem>
                      <MenuItem value="Home Nurse">Home Nurse</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Location"
                    name="location"
                    value={formData.location || ''}
                    onChange={handleChange}
                    disabled={!isEditing}
                    variant="outlined"
                    InputProps={{
                      startAdornment: <Business color="action" sx={{ mr: 1 }} />,
                      sx: { borderRadius: 2 }
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Experience (years)"
                    name="experience"
                    type="number"
                    value={formData.experience || ''}
                    onChange={handleChange}
                    disabled={!isEditing}
                    variant="outlined"
                    InputProps={{
                      startAdornment: <AccessTime color="action" sx={{ mr: 1 }} />,
                      sx: { borderRadius: 2 }
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Consultation Fee (₹)"
                    name="fee"
                    type="number"
                    value={formData.fee || ''}
                    onChange={handleChange}
                    disabled={!isEditing}
                    variant="outlined"
                    InputProps={{
                      startAdornment: <MonetizationOn color="action" sx={{ mr: 1 }} />,
                      sx: { borderRadius: 2 }
                    }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    label="Professional Description"
                    name="description"
                    value={formData.description || ''}
                    onChange={handleChange}
                    disabled={!isEditing}
                    variant="outlined"
                    placeholder="Describe your professional experience, specialities, and approach..."
                    helperText={isEditing ? "A detailed description helps patients understand your services better" : ""}
                    InputProps={{
                      sx: { borderRadius: 2 }
                    }}
                  />
                </Grid>
              </Grid>
            </Card>
          </Grid>
        </Grid>
      </motion.div>

      {/* Snackbar for success message */}
      <Snackbar
        open={!!success}
        autoHideDuration={6000}
        onClose={() => setSuccess('')}
        TransitionComponent={Fade}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          elevation={6} 
          variant="filled" 
          onClose={() => setSuccess('')} 
          severity="success"
        >
          {success}
        </Alert>
      </Snackbar>
>>>>>>> f13231d (bot set)
    </Container>
  );
}
