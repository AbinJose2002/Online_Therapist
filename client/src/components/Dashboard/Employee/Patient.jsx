import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Alert,
  Box,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Divider,
  Button // Add Button import
} from '@mui/material';
import { Person, Event, Phone, Email, LocationOn, Add as AddIcon, Notes as NotesIcon } from '@mui/icons-material';
import dayjs from 'dayjs';

// Add Error Boundary
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <Container>
          <Alert severity="error" sx={{ mt: 2 }}>
            Something went wrong. Please refresh the page.
          </Alert>
        </Container>
      );
    }
    return this.props.children;
  }
}

// Wrap the Patient component with ErrorBoundary
export default function PatientWithErrorBoundary() {
  return (
    <ErrorBoundary>
      <Patient />
    </ErrorBoundary>
  );
}

function Patient() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [openRemarkModal, setOpenRemarkModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [remark, setRemark] = useState('');
  const [remarks, setRemarks] = useState([]);

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      setError('');
      const token = localStorage.getItem('empToken');
      
      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await fetch('http://localhost:8080/api/patient/employee-patients', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch patients');
      }

      const data = await response.json();
      console.log('Fetched patients:', data);
      setPatients(data);
    } catch (error) {
      console.error('Error:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchRemarks = async (patientId) => {
    try {
      const token = localStorage.getItem('empToken');
      const response = await fetch(`http://localhost:8080/api/patient/remarks/${patientId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setRemarks(data);
      }
    } catch (error) {
      console.error('Error fetching remarks:', error);
    }
  };

  const handleOpenRemarkModal = async (patient) => {
    setSelectedPatient(patient);
    setOpenRemarkModal(true);
    await fetchRemarks(patient._id);
  };

  const handleAddRemark = async () => {
    try {
      const token = localStorage.getItem('empToken');
      const response = await fetch('http://localhost:8080/api/patient/remarks', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          patientId: selectedPatient._id,
          remark
        }),
      });

      if (response.ok) {
        const newRemark = await response.json();
        setRemarks([newRemark, ...remarks]);
        setRemark('');
      }
    } catch (error) {
      console.error('Error adding remark:', error);
    }
  };

  const formatDate = (date) => {
    return date ? dayjs(date).format('MMM D, YYYY') : 'N/A';
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
          <Typography variant="h4" gutterBottom align="center" sx={{ mb: 4 }}>
            My Patients
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><Person /> Patient Name</TableCell>
                  <TableCell><Email /> Contact Info</TableCell>
                  <TableCell><LocationOn /> Location</TableCell>
                  <TableCell><Event /> Last Visit</TableCell>
                  <TableCell>Total Sessions</TableCell>
                  <TableCell>Remarks</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {patients.map((patient) => (
                  <TableRow 
                    key={patient._id}
                    sx={{ '&:hover': { bgcolor: 'action.hover' } }}
                  >
                    <TableCell>
                      <Typography variant="subtitle1">
                        {`${patient.firstName} ${patient.lastName}`}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        <Typography variant="body2">
                          <Email fontSize="small" sx={{ mr: 1 }} />
                          {patient.email}
                        </Typography>
                        <Typography variant="body2">
                          <Phone fontSize="small" sx={{ mr: 1 }} />
                          {patient.number}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>{patient.location}</TableCell>
                    <TableCell>{formatDate(patient.lastVisit)}</TableCell>
                    <TableCell>
                      <Chip 
                        label={`${patient.appointmentCount} sessions`}
                        color="primary"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <IconButton
                        color="primary"
                        onClick={() => handleOpenRemarkModal(patient)}
                        title="Add Remark"
                      >
                        <NotesIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {patients.length === 0 && (
            <Box sx={{ py: 4, textAlign: 'center' }}>
              <Typography variant="h6" color="text.secondary">
                No patients found
              </Typography>
              <Typography variant="body2" color="text.secondary">
                New patients will appear here after their first appointment
              </Typography>
            </Box>
          )}
        </Paper>
      </Container>

      <Dialog
        open={openRemarkModal}
        onClose={() => setOpenRemarkModal(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Patient Remarks - {selectedPatient?.firstName} {selectedPatient?.lastName}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mb: 3, mt: 2 }}>
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Add New Remark"
              value={remark}
              onChange={(e) => setRemark(e.target.value)}
              variant="outlined"
            />
            <Button
              startIcon={<AddIcon />}
              variant="contained"
              onClick={handleAddRemark}
              disabled={!remark.trim()}
              sx={{ mt: 2 }}
            >
              Add Remark
            </Button>
          </Box>
          
          <Divider sx={{ my: 2 }} />
          
          <List>
            {remarks.map((r) => (
              <ListItem key={r._id}>
                <ListItemText
                  primary={r.remark}
                  secondary={dayjs(r.date).format('MMMM D, YYYY h:mm A')}
                />
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenRemarkModal(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
