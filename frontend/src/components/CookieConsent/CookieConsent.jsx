import React, { useState, useEffect } from "react";
import "./CookieConsent.css";

// Helper functions to manage cookies
const setCookie = (name, value, days) => {
  const date = new Date();
  date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000)); // Convert days to milliseconds
  const expires = `expires=${date.toUTCString()}`;
  document.cookie = `${name}=${value};${expires};path=/`;
};

const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
  return null;
};

// Cookie Consent Component
const CookieConsent = () => {
  
  // Scroll to the top every time the active step changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Check if the user has already accepted cookies
    const cookieConsent = getCookie("cookieConsent");
    if (!cookieConsent) {
      setShowBanner(true); // Show banner if no cookie consent has been given
    }
  }, []);

  const acceptCookies = () => {
    setCookie("cookieConsent", "accepted", 365); // Store the user's consent for 1 year
    setShowBanner(false); // Hide the banner
  };

  const rejectCookies = () => {
    setCookie("cookieConsent", "rejected", 365); // Store the rejection for 1 year
    setShowBanner(false); // Hide the banner
    // Optionally, disable tracking or other features here if necessary
  };

  if (!showBanner) return null; // Don't render if the banner shouldn't be shown

  return (
    <div className="cookie-consent-banner">
      <p>
      We use cookies to enhance your browsing experience on our website. 
      To learn more, please review our <a className="cookie__link" href="/privacy-policy" target="_blank" rel="noopener noreferrer">Privacy Policy</a>. 
      Do you accept cookies?
      </p>
      <div className="cookie-buttons">
        <button onClick={acceptCookies}>Accept</button>
        <button onClick={rejectCookies}>Reject</button>
      </div>
    </div>
  );
};

export default CookieConsent;
