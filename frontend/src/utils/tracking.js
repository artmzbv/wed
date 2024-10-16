import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export const usePageTracking = () => {
  const location = useLocation();
  // console.log(location)

  useEffect(() => {
    window.gtag("event", "page_view", {
      page_path: location.pathname + location.search + location.hash,
      page_search: location.search,
      page_hash: location.hash,
    });
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
  // на случай, если локально статистика отключена
      // console.log('event', action, values);
  }
}
