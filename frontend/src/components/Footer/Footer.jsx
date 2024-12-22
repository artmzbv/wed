import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import './Footer.css';
import linkedin from '../../images/network/linkedin.png';
import twitter from '../../images/network/twitter.png';

export default function Footer() {
  const location = useLocation();
  const navigate = useNavigate();
  const [active, setActive] = useState("");
  const [targetSection, setTargetSection] = useState(null);

  // Scroll to a specific section by its ID
  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      const headerOffset = 65; // Height of your fixed header
      const elementPosition = section.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementPosition - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  // Handle navigation button click
  const handleNavigationClick = (e, sectionId) => {
    setActive(e.target.id);
    if (location.pathname === "/") {
      scrollToSection(sectionId); // Scroll to the section if on the main page
    } else {
      setTargetSection(sectionId); // Store the section ID for scrolling after navigation
      navigate("/"); // Redirect to the main page
    }
  };

  // Scroll to the section if targetSection is set and we are on the main page
  useEffect(() => {
    if (location.pathname === "/" && targetSection) {
      scrollToSection(targetSection);
      setTargetSection(null); // Clear the target section after scrolling
    }
  }, [location.pathname, targetSection]);

  // Reset active state on page change
  useEffect(() => {
    if (location.pathname !== "/") {
      setActive(""); // Reset active state when navigating away from the main page
    }
  }, [location.pathname]);

  return (
    <>
      <footer className='footer'>
        <div className='footer__info'>
          <button
            id="1"
            className={`footer__link ${active === "1" ? "footer__link_active" : ""}`}
            onClick={(e) => handleNavigationClick(e, "about")}
          >
            How it works?
          </button>
          <button
            id="2"
            className={`footer__link ${active === "2" ? "footer__link_active" : ""}`}
            onClick={(e) => handleNavigationClick(e, "photos")}
          >
            Photo
          </button>
          <button
            id="3"
            className={`footer__link ${active === "3" ? "footer__link_active" : ""}`}
            onClick={(e) => handleNavigationClick(e, "gifts")}
          >
            Gift Cards
          </button>
          <button
            id="4"
            className={`footer__link ${active === "4" ? "footer__link_active" : ""}`}
            onClick={(e) => handleNavigationClick(e, "faq")}
          >
            FAQ
          </button>
          <button
            id="5"
            className={`footer__link ${active === "5" ? "footer__link_active" : ""}`}
            onClick={(e) => handleNavigationClick(e, "contact")}
          >
            Contact Us
          </button>
        </div>
        <div className='footer__reg'>
          <div className='footer__reg-container'>
            <Link className="footer__reg-link" to="./cookie-policy">{`Cookie Policy`}</Link>
            <Link className="footer__reg-link" to="./terms-of-use">{`Terms of Use`}</Link>
            <Link className="footer__reg-link" to="./privacy-policy">{` Privacy Policy`}</Link>
            {/* <Link className="footer__reg-link" to="./pet-policy">{`Pet Policy`}</Link> */}
            {/* <Link target="_blank">
              <img className="footer__reg-logo footer__reg-logo_x" src={twitter} alt="Twitter" />
            </Link> */}
          </div>
          <p className="footer__reg-copyright">© Self Made Portraits 2024</p>
        </div>
      </footer>
    </>
  );
}
