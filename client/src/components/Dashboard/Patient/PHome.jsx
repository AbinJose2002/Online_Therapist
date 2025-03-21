// src/components/Dashboard.js
import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Appoitment from "./Appointment"
import Reviews from "./Reviews";
import Appointment from './Appointment';
import MyTherapists from './MyTherapists';
import MyAppointments from './MyAppointments';
// import Patient from "./Patient"
import Profile from './Profile';
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
            return <MyAppointments />;  // Added return
        case 'book':
            return <Appointment />;
        // case 'patient':
            // return <Patient />;
        case 'profile':
            return <Profile />;
        case 'review':
            return <MyTherapists />;
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