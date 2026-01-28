import React from 'react';
import { Navigate } from 'react-router-dom';
import DashboardHome from './DashboardHome';
import DashboardHomeForvol from './DashboardHomeForvol'; 



const DashboardIndex = () => {
 
  const role = localStorage.getItem('userRole');

  
  if (role === 'ngo') {
    return <DashboardHome />;
  } else if (role === 'volunteer') {
    return <DashboardHomeForvol />;
  } else {
   
    localStorage.clear();
    return <Navigate to="/login" replace />;
  }
};

export default DashboardIndex;

