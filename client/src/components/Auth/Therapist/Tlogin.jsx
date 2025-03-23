import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from 'axios';

const Tlogin = () => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    number: "",
    serviceType: "",
    description: "",
    experience: "",
    location: "",
    fee: "",
    loginServiceType: "",
  });

  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [document, setDocument] = useState(null);
  const [documentName, setDocumentName] = useState('');

  const toggleForm = () => setIsRegistering(!isRegistering);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleDocumentChange = (e) => {
    const file = e.target.files[0];
    setDocument(file);
    setDocumentName(file.name);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setLoading(true);

    try {
      if (isRegistering) {
        if (!image || !document) {
          setMessage({ type: "danger", text: "Please select both profile image and verification document" });
          setLoading(false);
          return;
        }

        const formDataWithImage = new FormData();
        Object.keys(formData).forEach(key => {
          formDataWithImage.append(key, formData[key]);
        });
        formDataWithImage.append('image', image);
        formDataWithImage.append('verificationDocument', document);

        const response = await axios.post(
          'http://localhost:8080/api/employee/register',
          formDataWithImage,
          {
            headers: { 'Content-Type': 'multipart/form-data' }
          }
        );

        if (response.data) {
          setMessage({ type: "success", text: "Registration successful" });
          alert("Registration Success");
          window.location.href = "/employee-login";
        }
      } else {
        const endpoint = "/api/employee/login";
        const response = await fetch(`http://localhost:8080${endpoint}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        const data = await response.json();
        setLoading(false);
        alert("Login Success")
        if (!response.ok) {
          setMessage({ type: "danger", text: data.message || "Something went wrong" });
          return;
        }
        
        setMessage({ type: "success", text: data.message });
        localStorage.setItem("empToken", data.token);
        window.location.href = "/employee-dashboard";
      }
    } catch (error) {
      setLoading(false);
      setMessage({ 
        type: "danger", 
        text: error.response?.data?.message || "Server error. Try again later." 
      });
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow-lg p-4">
            <h2 className="text-center mb-4">Employee {isRegistering ? "Register" : "Login"}</h2>

            {message && <div className={`alert alert-${message.type}`}>{message.text}</div>}

            <form onSubmit={handleSubmit}>
              {isRegistering && (
                <>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label>First Name</label>
                      <input type="text" className="form-control" name="firstName" value={formData.firstName} onChange={handleChange} required />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label>Last Name</label>
                      <input type="text" className="form-control" name="lastName" value={formData.lastName} onChange={handleChange} required />
                    </div>
                  </div>
                  <div className="mb-3">
                    <label>Phone Number</label>
                    <input type="tel" className="form-control" name="number" value={formData.number} onChange={handleChange} required />
                  </div>
                  <div className="mb-3">
                    <label>Type of Service</label>
                    <select className="form-control" name="serviceType" value={formData.serviceType} onChange={handleChange} required>
                      <option value="">Select...</option>
                      <option value="Therapist">Therapist</option>
                      <option value="Home Nurse">Home Nurse</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label>Description</label>
                    <textarea className="form-control" name="description" value={formData.description} onChange={handleChange} required></textarea>
                  </div>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label>Years of Experience</label>
                      <input type="number" className="form-control" name="experience" value={formData.experience} onChange={handleChange} required />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label>Location</label>
                      <input type="text" className="form-control" name="location" value={formData.location} onChange={handleChange} required />
                    </div>
                  </div>
                  <div className="mb-3">
                    <label>Consultation Fee ($)</label>
                    <input type="number" className="form-control" name="fee" value={formData.fee} onChange={handleChange} required />
                  </div>
                  <div className="mb-3">
                    <label>Profile Photo</label>
                    <input 
                      type="file" 
                      className="form-control" 
                      accept="image/*"
                      onChange={handleImageChange} 
                      required 
                    />
                    {imagePreview && (
                      <img 
                        src={imagePreview} 
                        alt="Preview" 
                        className="mt-2 rounded-circle"
                        style={{ width: '100px', height: '100px', objectFit: 'cover' }} 
                      />
                    )}
                  </div>
                  <div className="mb-3">
                    <label>Verification Document (PDF/Image)</label>
                    <input 
                      type="file" 
                      className="form-control" 
                      accept=".pdf,image/*"
                      onChange={handleDocumentChange} 
                      required 
                    />
                    {documentName && (
                      <div className="mt-2">
                        <small>Selected document: {documentName}</small>
                      </div>
                    )}
                  </div>
                </>
              )}

              <div className="mb-3">
                <label>Email</label>
                <input type="email" className="form-control" name="email" value={formData.email} onChange={handleChange} required />
              </div>
              <div className="mb-3">
                <label>Password</label>
                <input type="password" className="form-control" name="password" value={formData.password} onChange={handleChange} required />
              </div>

              <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                {loading ? "Processing..." : isRegistering ? "Register" : "Login"}
              </button>
            </form>

            <div className="text-center mt-3">
              <button className="btn btn-link" onClick={toggleForm}>
                {isRegistering ? "Already have an account? Login" : "Don't have an account? Register"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tlogin;
