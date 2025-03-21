import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const Plogin = () => {
    const [isRegistering, setIsRegistering] = useState(false);
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        number: "",
        location: "",
    });
    const [message, setMessage] = useState(null);
    const [loading, setLoading] = useState(false);

    const toggleForm = () => setIsRegistering(prev => !prev);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage(null);
        setLoading(true);

        try {
            const baseUrl = 'http://localhost:8080/api/patient';
            const endpoint = isRegistering ? '/register' : '/login';
            
            const response = await fetch(`${baseUrl}${endpoint}`, {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || 'Something went wrong');
            }

            if (data.token) {
                localStorage.setItem("patientToken", data.token);
                localStorage.setItem("patientInfo", JSON.stringify(data.user));
                window.location.href = "/patient-dashboard";
            } else if (isRegistering) {
                setIsRegistering(false);
                setMessage({ type: "success", text: "Registration successful! Please login." });
            }
        } catch (error) {
            setMessage({ 
                type: "danger", 
                text: error.message || "Server error. Try again later." 
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card shadow-lg p-4">
                        <h2 className="text-center mb-4">{isRegistering ? "Patient Register" : "Patient Login"}</h2>
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

                                    <div className="row">
                                        <div className="col-md-6 mb-3">
                                            <label>Phone Number</label>
                                            <input type="tel" className="form-control" name="number" value={formData.number} onChange={handleChange} required />
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <label>Location</label>
                                            <input type="text" className="form-control" name="location" value={formData.location} onChange={handleChange} required />
                                        </div>
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

export default Plogin;
