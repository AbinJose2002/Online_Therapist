import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  Container, 
  Card, 
  Typography, 
  TextField, 
  Button, 
  Alert,
  Box
} from '@mui/material';
import { AdminPanelSettings } from '@mui/icons-material';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [isRegistering, setIsRegistering] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const config = {
        headers: {
          'Content-Type': 'application/json'
        }
      };

      const baseUrl = 'http://localhost:8080/api/admin';

      if (isRegistering) {
        if (formData.password !== formData.confirmPassword) {
          throw new Error('Passwords do not match');
        }

        const registerResponse = await axios.post(
          `${baseUrl}/register`,
          {
            name: formData.name,
            email: formData.email,
            password: formData.password
          }
        );

        if (registerResponse.status === 201) {
          setIsRegistering(false);
          setFormData({
            name: '',
            email: '',
            password: '',
            confirmPassword: ''
          });
          alert('Registration successful! Please login.');
        }
      } else {
        const response = await axios.post(
          `${baseUrl}/login`,
          {
            email: formData.email,
            password: formData.password
          },
          config
        );

        if (response.data?.token) {
          localStorage.setItem('adminToken', response.data.token);
          localStorage.setItem('adminInfo', JSON.stringify(response.data.admin));
          navigate('/admin-dashboard');
        } else {
          throw new Error('Invalid response from server');
        }
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(
        err.response?.data?.message || 
        'Server connection failed. Please check your credentials and try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Card sx={{ p: 4, borderRadius: 2, boxShadow: 3 }}>
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <AdminPanelSettings sx={{ fontSize: 48, color: 'primary.main' }} />
          <Typography variant="h4" component="h1" gutterBottom>
            Admin {isRegistering ? 'Registration' : 'Login'}
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          {isRegistering && (
            <TextField
              fullWidth
              label="Name"
              variant="outlined"
              margin="normal"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          )}
          <TextField
            fullWidth
            label="Email"
            variant="outlined"
            type="email"
            margin="normal"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
          <TextField
            fullWidth
            label="Password"
            variant="outlined"
            type="password"
            margin="normal"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
          />
          {isRegistering && (
            <TextField
              fullWidth
              label="Confirm Password"
              variant="outlined"
              type="password"
              margin="normal"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              required
            />
          )}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            sx={{ mt: 3 }}
            disabled={loading}
          >
            {loading ? 'Processing...' : isRegistering ? 'Register' : 'Login'}
          </Button>

          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Button
              variant="text"
              onClick={() => setIsRegistering(!isRegistering)}
            >
              {isRegistering ? 'Already have an account? Login' : "Don't have an account? Register"}
            </Button>
          </Box>
        </form>
      </Card>
    </Container>
  );
};

export default AdminLogin;
