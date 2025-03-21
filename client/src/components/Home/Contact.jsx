import React, { useState } from 'react';
import { FiMail, FiPhone, FiMapPin, FiClock, FiSend } from 'react-icons/fi';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log(formData);
  };

  return (
    <div className="min-vh-100 bg-light py-5">
      {/* About Us Section */}
      <div className="container mb-5">
        <div className="text-center mb-5">
          <h1 className="display-4 fw-bold text-primary mb-3">About Us</h1>
          <div className="row justify-content-center">
            <div className="col-md-8">
              <p className="lead text-muted">
                We're dedicated to making healthcare accessible and convenient for everyone. 
                Our platform connects patients with qualified healthcare professionals for personalized care.
              </p>
            </div>
          </div>
        </div>

        <div className="row g-4">
          <div className="col-md-4">
            <div className="card h-100 border-0 shadow-sm">
              <div className="card-body text-center p-4">
                <div className="rounded-circle bg-primary bg-opacity-10 p-3 d-inline-block mb-3">
                  <FiClock className="text-primary" size={24} />
                </div>
                <h4>24/7 Service</h4>
                <p className="text-muted">Round-the-clock support for all your healthcare needs</p>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card h-100 border-0 shadow-sm">
              <div className="card-body text-center p-4">
                <div className="rounded-circle bg-primary bg-opacity-10 p-3 d-inline-block mb-3">
                  <FiMapPin className="text-primary" size={24} />
                </div>
                <h4>Multiple Locations</h4>
                <p className="text-muted">Serving patients across multiple cities and regions</p>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card h-100 border-0 shadow-sm">
              <div className="card-body text-center p-4">
                <div className="rounded-circle bg-primary bg-opacity-10 p-3 d-inline-block mb-3">
                  <FiPhone className="text-primary" size={24} />
                </div>
                <h4>Expert Support</h4>
                <p className="text-muted">Professional healthcare experts at your service</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-10">
            <div className="card border-0 shadow-lg">
              <div className="row g-0">
                <div className="col-md-5 bg-primary text-white p-4">
                  <h3 className="mb-4">Contact Information</h3>
                  <div className="d-flex mb-3">
                    <FiMapPin className="me-3" size={20} />
                    <p>123 Healthcare Street, Medical City, MC 12345</p>
                  </div>
                  <div className="d-flex mb-3">
                    <FiPhone className="me-3" size={20} />
                    <p>+1 234 567 8900</p>
                  </div>
                  <div className="d-flex mb-3">
                    <FiMail className="me-3" size={20} />
                    <p>contact@healthcare.com</p>
                  </div>
                  <div className="mt-5">
                    <p className="mb-1">Hours of Operation</p>
                    <p className="small">
                      Monday - Friday: 9:00 AM - 8:00 PM<br />
                      Saturday: 9:00 AM - 5:00 PM<br />
                      Sunday: Closed
                    </p>
                  </div>
                </div>
                <div className="col-md-7 p-4">
                  <h3 className="mb-4">Send us a Message</h3>
                  <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Your Name"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <input
                        type="email"
                        className="form-control"
                        placeholder="Your Email"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Subject"
                        value={formData.subject}
                        onChange={(e) => setFormData({...formData, subject: e.target.value})}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <textarea
                        className="form-control"
                        rows="4"
                        placeholder="Your Message"
                        value={formData.message}
                        onChange={(e) => setFormData({...formData, message: e.target.value})}
                        required
                      ></textarea>
                    </div>
                    <button type="submit" className="btn btn-primary d-flex align-items-center">
                      Send Message
                      <FiSend className="ms-2" />
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
