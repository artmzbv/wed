import React, { useState } from "react";
import { Link } from "react-router-dom";
import headerLogo from "../../images/logo/logo_new.jpg";
import "./Header.css";
import BurgerMenu from "../Navigation/Navigation";

export default function Header({ activeSection, setActiveSection }) {
  const [isShowMenu, setIsShowMenu] = useState(false);
  const [active, setActive] = useState("");

  const handleActiveClick = (e) => {
    setActive(e.target.id);
  };

  const handleToggleBurgerMenu = () => {
    setIsShowMenu(!isShowMenu);
  };

  const handleCloseBurgerMenu = () => {
    setIsShowMenu(false);
  };

  // Scroll to the top of the page
  const handleLogoClick = (e) => {
    setActive(e.target.id);
    handleCloseBurgerMenu(); // Close the menu if open
    window.scrollTo({ top: 0, behavior: "smooth" }); // Scroll to the top
  };

  return (
    <>
      <header className="header">
        <Link to="/">
          <img
            id={"0"}
            className="header__logo"
            src={headerLogo}
            alt="logo"
            onClick={handleLogoClick} // Use handleLogoClick for scrolling
          />
        </Link>
        {!isShowMenu ? (
          <>
            <div className="header__navigation">
              <div className="header__links-row">
                <BurgerMenu activeSection={activeSection} setActiveSection={setActiveSection}  active={active} handleActiveClick={handleActiveClick} />
              </div>
            </div>
          </>
        ) : (
          <div className="header__links-column">
            <div className="header__links-column-container">
              <BurgerMenu
               activeSection={activeSection} 
               setActiveSection={setActiveSection} 
                isShowMenu={isShowMenu}
                handleToggleBurgerMenu={handleToggleBurgerMenu}
                setIsShowMenu={setIsShowMenu}
                active={active}
                handleActiveClick={handleActiveClick}
              />
            </div>
          </div>
        )}
        <button
          id="navigation"
          aria-label="menu"
          className={`${isShowMenu ? "header__burger-close-button" : "header__burger-menu"}`}
          onClick={() => handleToggleBurgerMenu()}
        ></button>
      </header>
    </>
  );
}
