import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Box,  // Add Box import
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [selectedDocument, setSelectedDocument] = useState(null);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/admin/employees', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      });
      const data = await response.json();
      setEmployees(data);
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  const defaultAvatar = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNTAiIGhlaWdodD0iMjUwIiB2aWV3Qm94PSIwIDAgMjUwIDI1MCI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iI2VlZSIvPjxwYXRoIGQ9Ik0xMjUgODBhNDAgNDAgMCAxIDAgMCA4MCA0MCA0MCAwIDAgMCAwLTgwem0wIDEwMGE2MCA2MCAwIDAgMS01Mi0zMGMwLTIwIDM1LTMxIDUyLTMxIDE3IDAgNTIgMTEgNTIgMzFhNjAgNjAgMCAwIDEtNTIgMzB6IiBmaWxsPSIjOTk5Ii8+PC9zdmc+';

  const getImageUrl = (imagePath) => {
    if (!imagePath) return defaultAvatar;
    
    try {
      // Remove /api/employee from path if present
      const cleanPath = imagePath
        .replace(/^\/api\/employee/, '')
        .replace(/^\/+/, '');

      // If path is still null or invalid, return default avatar
      if (!cleanPath || cleanPath === 'null') return defaultAvatar;

      return `http://localhost:8080/${cleanPath}`;
    } catch (error) {
      console.error('Error processing image path:', error);
      return defaultAvatar;
    }
  };

  const getDocumentUrl = (docPath) => {
    if (!docPath) return null;
    try {
      return `http://localhost:8080/${docPath.replace(/^\/+/, '')}`;
    } catch (error) {
      console.error('Error processing document path:', error);
      return null;
    }
  };

  return (
    <Paper sx={{ p: 2 }}>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Photo</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Service Type</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Document</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {employees.map((employee) => (
              <TableRow key={employee._id}>
                <TableCell>
                  <img
                    src={getImageUrl(employee.image)}
                    alt={`${employee.firstName}'s profile`}
                    onError={(e) => {
                      console.log('Image load error:', e.target.src);
                      e.target.onerror = null; // Prevent infinite loop
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
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => setSelectedDocument(employee.verificationDocument)}
                  >
                    View Document
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog
        open={!!selectedDocument}
        onClose={() => setSelectedDocument(null)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Verification Document
          <IconButton
            sx={{ position: 'absolute', right: 8, top: 8 }}
            onClick={() => setSelectedDocument(null)}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {selectedDocument && (
            <div style={{ width: '100%', minHeight: '600px' }}>
              {selectedDocument.toLowerCase().endsWith('.pdf') ? (
                <object
                  data={getDocumentUrl(selectedDocument)}
                  type="application/pdf"
                  width="100%"
                  height="600px"
                >
                  <p>Unable to display PDF. <a href={getDocumentUrl(selectedDocument)} target="_blank" rel="noopener noreferrer">Download Instead</a></p>
                </object>
              ) : (
                <img
                  src={getDocumentUrl(selectedDocument)}
                  alt="Verification Document"
                  style={{ 
                    maxWidth: '100%', 
                    height: 'auto',
                    objectFit: 'contain'
                  }}
                  onError={(e) => {
                    console.error('Document load error');
                    e.target.onerror = null;
                    e.target.alt = 'Error loading document';
                  }}
                />
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Paper>
  );
};

export default EmployeeList;
