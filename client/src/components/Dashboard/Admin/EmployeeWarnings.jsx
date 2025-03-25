import React, { useState, useEffect } from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  CircularProgress,
  Alert,
  Box,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Stack // Add Stack to imports
} from '@mui/material';
import { motion } from 'framer-motion';

const EmployeeWarnings = () => {
  const [warnings, setWarnings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchWarnings();
  }, []);

  const fetchWarnings = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/admin/employee-warnings', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      });
      const data = await response.json();
      setWarnings(data);
    } catch (error) {
      setError('Failed to fetch warnings');
    } finally {
      setLoading(false);
    }
  };

  const handleDisableEmployee = async (employeeId, isDisabled) => {
    try {
      const response = await fetch(`http://localhost:8080/api/admin/employees/${employeeId}/toggle-status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: JSON.stringify({ disableDuration: 15 }) // 15 days ban
      });

      if (!response.ok) {
        throw new Error('Failed to update employee status');
      }

      const data = await response.json();
      if (data.success) {
        setWarnings(data.warnings);
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      setError(error.message);
    }
  };

  const formatDisabledStatus = (employee) => {
    if (!employee.isDisabled) return 'Active';
    const disabledUntil = new Date(employee.disabledUntil);
    const daysLeft = Math.ceil((disabledUntil - new Date()) / (1000 * 60 * 60 * 24));
    return `Banned (${daysLeft} days left)`;
  };

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
      <Typography variant="h5" gutterBottom color="primary">
        Employee Reports
      </Typography>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Employee</TableCell>
              <TableCell>Patient</TableCell>
              <TableCell>Reason</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Actions</TableCell>
              <TableCell>Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {warnings.map((warning) => (
              <TableRow key={warning._id}>
                <TableCell>{`${warning.employeeId.firstName} ${warning.employeeId.lastName}`}</TableCell>
                <TableCell>{`${warning.patientId.firstName} ${warning.patientId.lastName}`}</TableCell>
                <TableCell>{warning.reason}</TableCell>
                <TableCell>{warning.description}</TableCell>
                <TableCell>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Chip
                      label={formatDisabledStatus(warning.employeeId)}
                      color={warning.employeeId.isDisabled ? 'error' : 'success'}
                      size="small"
                    />
                    <Button
                      size="small"
                      variant="contained"
                      color={warning.employeeId.isDisabled ? "primary" : "error"}
                      onClick={() => handleDisableEmployee(warning.employeeId._id, warning.employeeId.isDisabled)}
                    >
                      {warning.employeeId.isDisabled ? 'Enable' : 'Disable (15 days)'}
                    </Button>
                  </Stack>
                </TableCell>
                <TableCell>{new Date(warning.createdAt).toLocaleDateString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default EmployeeWarnings; // Make sure this export is present
