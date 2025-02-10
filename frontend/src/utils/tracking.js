import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// Helper function to get cookie
const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
};

export const usePageTracking = () => {
  const location = useLocation();

  useEffect(() => {
    // Check if user accepted cookies
    const cookieConsent = getCookie('cookieConsent');
    
    if (cookieConsent === 'accepted') {
    window.gtag("event", "page_view", {
      page_path: location.pathname + location.search + location.hash,
      page_search: location.search,
      page_hash: location.hash,
    });
  }
  }, [location]);
};

export const sendMetrik = (action, category, label, value) => {
  const values = {};
  if (typeof category !== 'undefined') {
      values['event_category'] = category;
  }
  if (typeof label !== 'undefined') {
      values['event_label'] = label;
  }
  if (typeof value !== 'undefined') {
      values['value'] = value;
  }
  if (typeof window !== 'undefined' && typeof window.gtag !== 'undefined') {
      window.gtag('event', action, values);
  } else {
  }
}
