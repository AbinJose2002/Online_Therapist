import React from 'react'
import Tlogin from './components/Auth/Therapist/Tlogin'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './components/Dashboard/Employee/Home'
import Navbar from "./components/Navbar/Navbar"
import Plogin from './components/Auth/Patient/Plogn'
import PHome from "./components/Dashboard/Patient/PHome"
import Index from './components/Home/Index'
import Employees from './components/Home/Employees'
import './App.css'
import Contact from './components/Home/Contact'
import AdminLogin from './components/Auth/Admin/AdminLogin';
import AdminDashboard from './components/Dashboard/Admin/AdminDashboard';
import PaymentSuccess from './components/Payment/PaymentSuccess';
import Chatbot from './components/Chatbot/Chatbot';
import Footer from './components/Footer/Footer';

function App() {
  return (
    <BrowserRouter>
      <Navbar/>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/employees" element={<Employees />} />
        <Route path="/contact" element={<Contact />} />

        <Route path="/patient-login" element={<Plogin />} />
        <Route path="/patient-dashboard/*" element={<PHome />} />

        <Route path="/employee-login" element={<Tlogin />} />
        <Route path="/employee-dashboard/*" element={<Home />} />

        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/admin-dashboard/*" element={<AdminDashboard />} />
        <Route path="/payment-success" element={<PaymentSuccess />} />
        <Route path="/chatbot" element={<Chatbot />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
