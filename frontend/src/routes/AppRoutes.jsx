import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/Login";
import RegisterForNgo from "../pages/RegisterForNgo";
import RegisterForVolunteer from "../pages/RegisterForVolunteer";
import ProfileEditFormForNgo from "../pages/ProfileEditFormForNgo";
import DashboardForNgo from "../pages/DashboardForNgo";
import ProfileForNgo from "../pages/ProfileForNgo";
import DashboardHome from "../pages/DashboardHome";
import Applications from "../pages/Applications";
import CreateOpportunity from "../pages/CreateOppurtunity";
import Opportunities from "../pages/Opportunities";
import EditOpportunity from "../pages/EditOpportunity"; // ✅ Added import for edit page

import DashboardForVolunteer from "../pages/DashboardForVolunteer";
import DashboardHomeForvol from "../pages/DashboardHomeForvol";
import ProfileForVolunteer from "../pages/ProfileForVolunteer";
import OpportunityForVol from "../pages/OppurtunityForVol";
import ProfileEditFormForVol from "../pages/ProfileEditFormForVol";
import MyApplications from "../pages/MyApplications";

import ProtectedDashboardLayout from "../pages/ProtectedDashboardLayout";
import DashboardIndex from "../pages/DashboardIndex";

import MsgForNgo from "../pages/MsgForNgo";
import MsgForVol from "../pages/MsgForVol";

function AppRoutes() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/register" element={<RegisterForNgo />} /> 
        <Route path="/volunteer" element={<RegisterForVolunteer />} />
        <Route path="/login" element={<Login />} />

        {/* Protected Routes */}
        <Route path="/dashboard" element={<ProtectedDashboardLayout />}>
          <Route index element={<DashboardIndex />} />

          {/* NGO Dashboard */}
          <Route path="home" element={<DashboardHome />} />
          <Route path="profile" element={<ProfileForNgo />} />
          <Route path="profile/edit" element={<ProfileEditFormForNgo />} />
          <Route path="applications" element={<Applications />} />
          <Route path="home/create" element={<CreateOpportunity />} />
          <Route path="home/edit/:id" element={<EditOpportunity />} /> {/* ✅ Added Edit route */}
          <Route path="opportunities" element={<Opportunities />} />
          <Route path="messages" element={<MsgForNgo/>}/>

          {/* Volunteer Dashboard */}
          <Route path="home-vol" element={<DashboardHomeForvol />} />
          <Route path="profile-vol" element={<ProfileForVolunteer />} />
          <Route path="profile-vol/edit-vol" element={<ProfileEditFormForVol />} />
          <Route path="find-oppurt" element={<OpportunityForVol />} />
          <Route path="my-applications" element={<MyApplications />} />
          <Route path="messages-vol" element={<MsgForVol/>}/>
        </Route>

        {/* Default redirect */}
        <Route path="/" element={<Navigate replace to="/login" />} />
      </Routes>
    </Router>
  );
}

export default AppRoutes;
