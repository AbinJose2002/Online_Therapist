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
            console.log(formData)
            const endpoint = isRegistering ? "/api/patient/register" : "/api/patient/login";
            const response = await fetch(`http://localhost:8080${endpoint}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await response.json();
            setLoading(false);
            
            if (!response.ok) {
                setMessage({ type: "danger", text: data.message || "Something went wrong" });
                return;
            }

            setMessage({ type: "success", text: data.message });
            if (!isRegistering) {
                localStorage.setItem("patientToken", data.token);
                window.location.href = "/patient-dashboard";
            }
        } catch (error) {
            setLoading(false);
            setMessage({ type: "danger", text: "Server error. Try again later." });
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
