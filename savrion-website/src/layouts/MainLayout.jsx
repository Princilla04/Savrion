import React, { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SEO from '../components/SEO';
import AnalyticsTracker from '../components/AnalyticsTracker';
import { contentService } from '../services/contentService';

const MainLayout = () => {
  const [content, setContent] = useState(null);
  const [services, setServices] = useState([]);
  const location = useLocation();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  useEffect(() => {
    const loadContent = async () => {
      try {
        const data = await contentService.getWebsiteContent();
        if (data) setContent(data);
      } catch (err) {
        console.warn('Could not fetch global content:', err);
      }
    };
    loadContent();
  }, []);

  useEffect(() => {
    contentService.getServices({ status: 'active' }).then(setServices).catch(() => setServices([]));
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'var(--color-background)' }}>
      <SEO />
      <AnalyticsTracker />
      <Navbar />
      <main style={{ flex: 1, position: 'relative', zIndex: 1 }}>
        <Outlet context={{ content }} />
      </main>
      <Footer content={content} services={services} />
    </div>
  );
};

export default MainLayout;
