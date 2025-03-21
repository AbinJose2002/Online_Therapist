import React, { useState } from 'react';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Container,
  IconButton,
  AppBar,
  Toolbar,
  useTheme,
  Divider,
  Button,
} from '@mui/material';
import {
  People,
  PersonAdd,
  BarChart,
  Menu as MenuIcon,
  ChevronLeft,
  Dashboard,
  Logout as LogoutIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

import EmployeeList from './EmployeeList';
import PatientList from './PatientList';
import Analytics from './Analytics';

const drawerWidth = 240;

const AdminDashboard = () => {
  const [open, setOpen] = useState(true);
  const [selectedView, setSelectedView] = useState('employees');
  const theme = useTheme();
  const navigate = useNavigate();

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminInfo');
    navigate('/admin-login');
  };

  const menuItems = [
    { text: 'Employees', icon: <People />, value: 'employees' },
    { text: 'Patients', icon: <PersonAdd />, value: 'patients' },
    { text: 'Analytics', icon: <BarChart />, value: 'analytics' },
  ];

  const renderContent = () => {
    switch (selectedView) {
      case 'employees':
        return <EmployeeList />;
      case 'patients':
        return <PatientList />;
      case 'analytics':
        return <Analytics />;
      default:
        return <EmployeeList />;
    }
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar
        position="fixed"
        sx={{
          backgroundColor: 'white',
          boxShadow: 1,
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
      >
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton
              color="primary"
              onClick={handleDrawerToggle}
              edge="start"
              sx={{ mr: 2 }}
            >
              {open ? <ChevronLeft /> : <MenuIcon />}
            </IconButton>
            <Typography variant="h6" color="primary" noWrap component="div">
              Admin Dashboard
            </Typography>
          </Box>
          <Button
            color="primary"
            startIcon={<LogoutIcon />}
            onClick={handleLogout}
          >
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="permanent"
        sx={{
          width: open ? drawerWidth : theme.spacing(7),
          transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
          '& .MuiDrawer-paper': {
            width: open ? drawerWidth : theme.spacing(7),
            transition: theme.transitions.create('width', {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
            overflowX: 'hidden',
            backgroundColor: theme.palette.primary.dark,
            color: 'white',
          },
        }}
        open={open}
      >
        <Toolbar /> {/* Spacer for AppBar */}
        <Box sx={{ overflow: 'hidden', pt: 2 }}>
          <List>
            {menuItems.map((item) => (
              <ListItem
                button
                key={item.text}
                onClick={() => setSelectedView(item.value)}
                selected={selectedView === item.value}
                sx={{
                  minHeight: 48,
                  justifyContent: open ? 'initial' : 'center',
                  px: 2.5,
                  '&.Mui-selected': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    },
                  },
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : 'auto',
                    justifyContent: 'center',
                    color: 'white',
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.text} 
                  sx={{ 
                    opacity: open ? 1 : 0,
                    color: 'white',
                  }}
                />
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
          ml: `${theme.spacing(7)}`,
          width: `calc(100% - ${theme.spacing(7)}px)`,
        }}
      >
        <Toolbar /> {/* Spacer for AppBar */}
        <Container maxWidth="lg">
          {renderContent()}
        </Container>
      </Box>
    </Box>
  );
};

export default AdminDashboard;
