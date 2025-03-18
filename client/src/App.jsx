import React from 'react'
import Tlogin from './components/Auth/Therapist/Tlogin'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './components/Dashboard/Employee/Home'
import Navbar from "./components/Navbar/Navbar"
import Plogin from './components/Auth/Patient/Plogn'
import PHome from "./components/Dashboard/Patient/PHome"

export default function App() {
  return (
    <div>
      <BrowserRouter> 
      <Navbar />
        <Routes>
          {/* <Route path='/' element={< />} /> */}

          <Route path='/patient-login' element={<Plogin />} />
          <Route path='/patient-dashboard' element={<PHome />} />

          <Route path='/employee-login' element={<Tlogin />} />
          <Route path='/employee-dashboard' element={<Home />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}
