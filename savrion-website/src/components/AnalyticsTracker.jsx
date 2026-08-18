import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { trackEvent, trackPageView } from '../services/analytics';

/** Records page views and tracks supported high-intent links across the public site. */
const AnalyticsTracker = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    trackPageView(pathname);
  }, [pathname]);

  useEffect(() => {
    /** Detects user actions on phone, email, WhatsApp, and download links. */
    const handleTrackedLinkClick = (event) => {
      const link = event.target.closest('a');
      if (!link?.href) return;

      const href = link.href;
      if (/wa\.me|api\.whatsapp\.com|whatsapp:/i.test(href)) {
        trackEvent('whatsapp_click', { page_path: window.location.pathname });
      } else if (href.startsWith('tel:')) {
        trackEvent('phone_click', { page_path: window.location.pathname });
      } else if (href.startsWith('mailto:')) {
        trackEvent('email_click', { page_path: window.location.pathname });
      } else if (link.hasAttribute('download')) {
        trackEvent('download', { page_path: window.location.pathname, file_name: link.getAttribute('download') || href.split('/').pop() });
      }
    };

    document.addEventListener('click', handleTrackedLinkClick);
    return () => document.removeEventListener('click', handleTrackedLinkClick);
  }, []);

  return null;
};

export default AnalyticsTracker;
