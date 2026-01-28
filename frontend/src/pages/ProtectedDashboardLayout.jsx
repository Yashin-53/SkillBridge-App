import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import DashboardForNgo from '../pages/DashboardForNgo';
import DashboardForVolunteer from '../pages/DashboardForVolunteer';

const ProtectedDashboardLayout = () => {
  
  const token = localStorage.getItem('authToken');
  const role = localStorage.getItem('userRole');


  if (!token) {
    
    return <Navigate to="/login" replace />;
  }

  
  if (role === 'ngo') {
    return <DashboardForNgo />;
  } else if (role === 'volunteer') {
    return <DashboardForVolunteer />; 
  } else {
  
    localStorage.clear();
    return <Navigate to="/login" replace />;
  }
};

export default ProtectedDashboardLayout;

