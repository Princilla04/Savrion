import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import Home from '../pages/Home';
import About from '../pages/About';
import Services from '../pages/Services';
import ServiceDetail from '../pages/ServiceDetail';
import Technologies from '../pages/Technologies';
import Projects from '../pages/Projects';
import ProjectDetail from '../pages/ProjectDetail';
import Contact from '../pages/Contact';
import NotFound from '../pages/NotFound';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="services" element={<Services />} />
        <Route path="services/:slug" element={<ServiceDetail />} />
        <Route path="technologies" element={<Technologies />} />
        <Route path="products" element={<Projects />} />
        <Route path="products/:slug" element={<ProjectDetail />} />
        <Route path="projects" element={<Navigate to="/products" replace />} />
        <Route path="projects/:slug" element={<Navigate to="/products" replace />} />
        <Route path="contact" element={<Contact />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
