import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BsPersonCircle } from "react-icons/bs";
import "./Navbar.css"; // For additional styling

const Navbar = () => {
  const navigate = useNavigate();
  const [userType, setUserType] = useState(null);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    // Check tokens and user info
    if (localStorage.getItem("patientToken")) {
      setUserType("patient");
      // setUserName(JSON.parse(localStorage.getItem("patientInfo"))?.firstName || "");
    } else if (localStorage.getItem("empToken")) {
      setUserType("employee");
      // setUserName(JSON.parse(localStorage.getItem("employeeInfo"))?.firstName || "");
    } else if (localStorage.getItem("adminToken")) {
      setUserType("admin");
      // setUserName("Admin");
    }
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setUserType(null);
    setUserName("");
    navigate("/");
  };

  const getDashboardLink = () => {
    switch (userType) {
      case "patient":
        console.log(userType)
        return "/patient-dashboard";
      case "employee":
        return "/employee-dashboard";
      case "admin":
        return "/admin-dashboard";
      default:
        return "/";
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light px-4">
      <Link className="navbar-brand" to="/">HealthCare</Link>
      
      <button
        className="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>

      <div className="collapse navbar-collapse justify-content-center" id="navbarNav">
        <ul className="navbar-nav">
          <li className="nav-item">
            <Link className="nav-link" to="/">Home</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/employees">Employees</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/contact">Contact Us</Link>
          </li>
        </ul>
      </div>

      <div className="ms-auto d-flex align-items-center">
        {userType ? (
          <div className="dropdown">
            <button
              type="button"
              className="btn btn-link nav-link d-flex align-items-center gap-2"
              id="profileDropdown"
              data-bs-toggle="dropdown"
              data-bs-auto-close="true"
              aria-expanded="false"
            >
              <BsPersonCircle size={24} />
              <span>{userName}</span>
            </button>
            <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="profileDropdown">
              <li>
                <Link className="dropdown-item" to={getDashboardLink()}>
                  Dashboard
                </Link>
              </li>
              <li><hr className="dropdown-divider" /></li>
              <li>
                <button className="dropdown-item text-danger" onClick={handleLogout}>
                  Logout
                </button>
              </li>
            </ul>
          </div>
        ) : (
          <div className="dropdown">
            <button
              type="button"
              className="btn btn-primary dropdown-toggle"
              id="loginDropdown"
              data-bs-toggle="dropdown"
              data-bs-auto-close="true"
              aria-expanded="false"
            >
              Login
            </button>
            <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="loginDropdown">
              <li>
                <button 
                  className="dropdown-item" 
                  onClick={() => navigate("/patient-login")}
                >
                  Patient Login
                </button>
              </li>
              <li>
                <button 
                  className="dropdown-item" 
                  onClick={() => navigate("/employee-login")}
                >
                  Employee Login
                </button>
              </li>
              <li>
                <button 
                  className="dropdown-item" 
                  onClick={() => navigate("/admin-login")}
                >
                  Admin Login
                </button>
              </li>
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
