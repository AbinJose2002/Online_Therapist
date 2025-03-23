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
  Stack,
  Chip,
  Button
} from '@mui/material';
import { Description as DocIcon } from '@mui/icons-material';
import { motion } from 'framer-motion';

// Add default avatar base64 image
const defaultAvatar = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNTAiIGhlaWdodD0iMjUwIiB2aWV3Qm94PSIwIDAgMjUwIDI1MCI+PHJlY3Qgd2g9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iI2VlZSIvPjxwYXRoIGQ9Ik0xMjUgODBhNDAgNDAgMCAxIDAgMCA4MCA0MCA0MCAwIDAgMCAwLTgwem0wIDEwMGE2MCA2MCAwIDAgMS01Mi0zMGMwLTIwIDM1LTMxIDUyLTMxIDE3IDAgNTIgMTEgNTIgMzFhNjAgNjAgMCAwIDEtNTIgMzB6IiBmaWxsPSIjOTk5Ii8+PC9zdmc+';

// Add image URL helper function
const getImageUrl = (imagePath) => {
  if (!imagePath) return defaultAvatar;
  try {
    return `http://localhost:8080/${imagePath.replace(/^\/+/, '')}`;
  } catch (error) {
    console.error('Error processing image path:', error);
    return defaultAvatar;
  }
};

const tableVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05
    }
  }
};

const rowVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { type: "spring", stiffness: 100 }
  }
};

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedDocument, setSelectedDocument] = useState(null);

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

  const renderDocumentPreview = (document) => {
    if (!document) return <Chip label="No Document" color="error" size="small" />;

    const isImage = document.match(/\.(jpg|jpeg|png|gif)$/i);
    const isPDF = document.toLowerCase().endsWith('.pdf');

    return (
      <Stack direction="row" spacing={1} alignItems="center">
        <DocIcon color={isPDF ? "primary" : "secondary"} />
        <Typography variant="body2" noWrap>
          {isImage ? 'Image Document' : 'PDF Document'}
        </Typography>
        <Button
          variant="outlined"
          size="small"
          color="primary"
          onClick={() => setSelectedDocument(document)}
        >
          View
        </Button>
      </Stack>
    );
  };

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Paper 
      component={motion.div}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      elevation={3}
      sx={{ 
        p: 3,
        borderRadius: 2,
        background: 'linear-gradient(to bottom, #ffffff, #f8f9fa)'
      }}
    >
      <Typography variant="h6" gutterBottom>
        Employee Verification Documents
      </Typography>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow sx={{ 
              background: theme => theme.palette.primary.main,
              '& th': { color: 'white', fontWeight: 'bold' }
            }}>
              <TableCell>Photo</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Service Type</TableCell>
              <TableCell>Location</TableCell>
              <TableCell width="250">Verification Document</TableCell>
            </TableRow>
          </TableHead>
          <TableBody component={motion.tbody} variants={tableVariants} initial="hidden" animate="visible">
            {employees.map((employee) => (
              <TableRow 
                key={employee._id}
                component={motion.tr}
                variants={rowVariants}
                whileHover={{ backgroundColor: '#f5f5f5' }}
              >
                <TableCell>
                  <img
                    src={getImageUrl(employee.image)}
                    alt={`${employee.firstName}'s profile`}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = defaultAvatar;
                    }}
                    style={{
                      width: '50px',
                      height: '50px',
                      borderRadius: '50%',
                      objectFit: 'cover',
                      backgroundColor: '#f5f5f5'
                    }}
                  />
                </TableCell>
                <TableCell>{`${employee.firstName} ${employee.lastName}`}</TableCell>
                <TableCell>{employee.serviceType}</TableCell>
                <TableCell>{employee.location}</TableCell>
                <TableCell>
                  {renderDocumentPreview(employee.verificationDocument)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default EmployeeList;
