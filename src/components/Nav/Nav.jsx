import { useState } from 'react';
import './Nav.css';

const NAV_LINKS = [
  { label: 'ЛОКАЦИЯ', href: '#программа' },
  { label: 'ТАЙМИНГ', href: '#тайминг' },
  { label: 'ДРЕСС-КОД', href: '#дресс-код' },
  { label: 'ПОЖЕЛАНИЯ', href: '#пожелания' },
  { label: 'АНКЕТА', href: '#анкета' },
];

const Nav = () => {
  const [open, setOpen] = useState(false);

  const handleClick = (e, href) => {
    e.preventDefault();
    setOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav className="nav">
      <div className="nav__inner">
        <div className="nav__logo">И&amp;Н</div>
        <div className="nav__date">25 августа, 2026</div>

        <button
          className={`nav__burger${open ? ' nav__burger--open' : ''}`}
          aria-label="Меню"
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
        >
          <span /><span /><span />
        </button>

        <ul className={`nav__links${open ? ' nav__links--open' : ''}`}>
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <a href={link.href} onClick={(e) => handleClick(e, link.href)}>
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default Nav;
