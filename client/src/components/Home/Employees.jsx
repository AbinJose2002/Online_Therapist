import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { FiMapPin, FiFilter, FiUsers } from 'react-icons/fi'

// Add default avatar base64 image near the top of the file
const defaultAvatar = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNTAiIGhlaWdodD0iMjUwIiB2aWV3Qm94PSIwIDAgMjUwIDI1MCI+PHJlY3Qgd2lkdD0iMTAwJSIgaGVpZ2h0PSIxMDAiIGZpbGw9IiNlZWUiLz48cGF0aCBkPSJNMTI1IDgwYTQwIDQwIDAgMSAwIDAgODAgNDAgNDAgMCAwIDAgMC04MHptMCAxMDBhNjAgNjAgMCAwIDE1Mi0zMGMwLTIwIDM1LTMxIDUyLTMxIDE3IDAgNTIgMTEgNTIgMzFhNjAgNjAgMCAwIDEtNTIgMzB6IiBmaWxsPSIjOTk5Ii8+PC9zdmc+';

// Add getImageUrl helper function
const getImageUrl = (imagePath) => {
  if (!imagePath) return defaultAvatar;
  try {
    return `http://localhost:8080/${imagePath.replace(/^\/+/, '')}`;
  } catch (error) {
    console.error('Error processing image path:', error);
    return defaultAvatar;
  }
};

export default function Employees() {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedService, setSelectedService] = useState('');

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        let url = 'http://localhost:8080/api/employee/fetch';
        const params = new URLSearchParams();
        
        if (selectedLocation) params.append('location', selectedLocation);
        if (selectedService) params.append('serviceType', selectedService);
        
        if (params.toString()) {
          url += `?${params.toString()}`;
        }

        console.log('Fetching from:', url); // Debug log
        const response = await axios.get(url);
        console.log('Received data:', response.data); // Debug log
        setEmployees(response.data);
      } catch (error) {
        console.error('Error fetching employees:', error);
      }
    };

    const fetchLocations = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/employee/localities');
        setLocations(response.data);
      } catch (error) {
        console.error('Error fetching locations:', error);
      }
    };

    fetchEmployees();
    fetchLocations();
  }, [selectedLocation, selectedService]);

  const handleBookNow = (employeeId) => {
    if (!localStorage.getItem('patientToken')) {
      navigate('/patient-login');
      return;
    }
    navigate(`/patient-dashboard/book-appointment/${employeeId}`);
  };

  return (
    <div className="min-vh-100 bg-light">
      <div className="container py-5">
        {/* Hero Section */}
        <div className="text-center mb-5">
          <h1 className="display-4 fw-bold text-primary mb-3">Our Healthcare Professionals</h1>
          <p className="lead text-muted">Find the right healthcare provider for your needs</p>
        </div>

        {/* Enhanced Filters */}
        <div className="card shadow-sm border-0 mb-5">
          <div className="card-body p-4">
            <div className="d-flex align-items-center mb-3">
              <FiFilter className="text-primary me-2" size={20} />
              <h5 className="mb-0">Filter Professionals</h5>
            </div>
            <div className="row g-3">
              <div className="col-md-6">
                <div className="position-relative">
                  <FiMapPin className="position-absolute text-primary" 
                    style={{ top: '12px', left: '12px' }} />
                  <select 
                    className="form-select form-select-lg border-0 shadow-sm ps-5"
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                    style={{ backgroundColor: '#f8f9fa' }}
                  >
                    <option value="">All Locations</option>
                    {locations.map(location => (
                      <option key={location} value={location}>{location}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="col-md-6">
                <div className="position-relative">
                  <FiUsers className="position-absolute text-primary" 
                    style={{ top: '12px', left: '12px' }} />
                  <select 
                    className="form-select form-select-lg border-0 shadow-sm ps-5"
                    value={selectedService}
                    onChange={(e) => setSelectedService(e.target.value)}
                    style={{ backgroundColor: '#f8f9fa' }}
                  >
                    <option value="">All Services</option>
                    <option value="Therapist">Therapist</option>
                    <option value="Home Nurse">Home Nurse</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Employee Grid with enhanced styling */}
        <div className="row g-4">
          {employees.map((employee) => (
            <div key={employee._id} className="col-md-6 col-lg-4">
              <div className="card h-100 border-0 shadow-sm hover-card">
                <div className="position-relative">
                  <img 
                    src={getImageUrl(employee.image)}
                    className="card-img-top"
                    alt={`${employee.firstName} ${employee.lastName}`}
                    style={{ height: '250px', objectFit: 'cover' }}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = defaultAvatar;
                    }}
                  />
                  <div className="position-absolute top-0 end-0 m-3">
                    <span className="badge bg-primary rounded-pill px-3 py-2">
                      {employee.serviceType}
                    </span>
                  </div>
                </div>
                <div className="card-body p-4">
                  <h3 className="h5 fw-bold mb-3 text-primary">
                    {employee.firstName} {employee.lastName}
                  </h3>
                  
                  <div className="mb-3">
                    <div className="d-flex align-items-center mb-2">
                      <i className="bi bi-briefcase-fill text-primary me-2"></i>
                      <span><strong>Experience:</strong> {employee.experience} years</span>
                    </div>
                    <div className="d-flex align-items-center mb-2">
                      <i className="bi bi-geo-alt-fill text-primary me-2"></i>
                      <span><strong>Location:</strong> {employee.location}</span>
                    </div>
                    <div className="d-flex align-items-center mb-3">
                      <i className="bi bi-currency-dollar text-primary me-2"></i>
                      <span><strong>Fee:</strong> ₹{employee.fee}/session</span>
                    </div>
                    <p className="text-muted mb-4">{employee.description}</p>
                  </div>

                  <div className="d-flex justify-content-between align-items-center">
                    <div className="d-flex align-items-center">
                      <div className="text-warning me-2">
                        {[...Array(5)].map((_, i) => (
                          <i key={i} className="bi bi-star-fill"></i>
                        ))}
                      </div>
                      <span className="text-muted">4.5/5</span>
                    </div>
                    <button 
                      className="btn btn-primary px-4 rounded-pill"
                      onClick={() => handleBookNow(employee._id)}
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No results message */}
        {employees.length === 0 && (
          <div className="text-center py-5">
            <h3 className="text-muted">No professionals found</h3>
            <p>Try adjusting your filters</p>
          </div>
        )}
      </div>
    </div>
  )
}
