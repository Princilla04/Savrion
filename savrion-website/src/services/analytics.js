/** Pushes a privacy-safe custom event to the analytics data layer. */
export const trackEvent = (eventName, parameters = {}) => {
  if (typeof window === 'undefined') return;

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: eventName,
    ...parameters
  });
};

/** Tracks a public page view with its clean URL path. */
export const trackPageView = (pathname) => {
  trackEvent('page_view', { page_path: pathname, page_location: window.location.href });
};
