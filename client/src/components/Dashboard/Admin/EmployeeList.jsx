import React, { useState, useEffect } from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Rating,
  Typography,
  CircularProgress,
  Alert,
} from '@mui/material';

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/employee/fetch');
      const data = await response.json();
      setEmployees(data);
    } catch (error) {
      setError('Failed to fetch employees');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <TableContainer component={Paper}>
      <Typography variant="h5" sx={{ p: 2 }}>Employee List</Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Service Type</TableCell>
            <TableCell>Location</TableCell>
            <TableCell>Rating</TableCell>
            <TableCell>Experience</TableCell>
            <TableCell>Fee</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {employees.map((employee) => (
            <TableRow key={employee._id}>
              <TableCell>{`${employee.firstName} ${employee.lastName}`}</TableCell>
              <TableCell>{employee.serviceType}</TableCell>
              <TableCell>{employee.location}</TableCell>
              <TableCell>
                <Rating value={4} readOnly size="small" />
              </TableCell>
              <TableCell>{employee.experience} years</TableCell>
              <TableCell>₹{employee.fee}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default EmployeeList;
