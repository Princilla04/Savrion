import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import AdminLayout from '../layouts/AdminLayout';
import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';
import ManageServices from '../pages/ManageServices';
import ManageProjects from '../pages/ManageProjects';
import ManageTechnologies from '../pages/ManageTechnologies';
import ManageContacts from '../pages/ManageContacts';
import ManageTestimonials from '../pages/ManageTestimonials';
import ManageContent from '../pages/ManageContent';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      {/* Protected Admin Routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AdminLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/services" element={<ManageServices />} />
          <Route path="/projects" element={<ManageProjects />} />
          <Route path="/technologies" element={<ManageTechnologies />} />
          <Route path="/contacts" element={<ManageContacts />} />
          <Route path="/testimonials" element={<ManageTestimonials />} />
          <Route path="/content" element={<ManageContent />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
