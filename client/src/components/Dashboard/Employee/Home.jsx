// src/components/Dashboard.js
import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
// import Appoitment from "./Appoitment";
import Appointments from './Appointments';
import Patient from "./Patient"
import Profle from './Profle';
import Review from './Review'
import ReportPatientWarning from './ReportPatientWarning';
// import Navbar from '../../Navbar/Navbar'

const Home = () => {
    const [selected, setSelected] = useState('case'); // Default selected link
    
    
    return (
        <>
            {/* <Navbar /> */}
            <div style={{ display: 'flex' }}>
                <Sidebar setSelected={setSelected} />
                <div style={{ padding: '20px', flex: 1 }}>
                    {/* <h2>Selected: {selected}</h2> Display the selected link */}
                    {(() => {
    switch (selected) {
        case 'appointment':
            return <Appointments />;  // Added return
        case 'profile':
            return <Profle />;
        case 'patient':
            return <Patient />;
        case 'review':
            return <Review />;
        case 'warn':
            return <ReportPatientWarning />;
        // default:
        //     return <Case />;
    }
})()}
                    <Outlet />
                </div>
            </div>
        </>
    );
};

export default Home;