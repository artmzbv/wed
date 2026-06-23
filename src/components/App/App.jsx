import { useEffect, useRef } from 'react';
import './App.css';
import Nav from '../Nav/Nav';
import Main from '../Main/Main';
import Footer from '../Footer/Footer';

const DESIGN_WIDTH = 1440;
const DESKTOP_MIN = 1025; // below this the layout is fully responsive (no canvas)

const App = () => {
  const appRef = useRef(null);

  useEffect(() => {
    const el = appRef.current;
    if (!el) return;

    const fit = () => {
      // clientWidth excludes the vertical scrollbar, so the scaled canvas
      // never overflows horizontally. Capped at 1 — no upscaling past 1440.
      const available = document.documentElement.clientWidth;
      if (available >= DESKTOP_MIN) {
        el.style.zoom = Math.min(1, available / DESIGN_WIDTH);
      } else {
        // Tablet & mobile: hand control to the responsive CSS.
        el.style.zoom = '1';
      }
    };

    fit();
    window.addEventListener('resize', fit);
    return () => window.removeEventListener('resize', fit);
  }, []);

  return (
    <div className="app" ref={appRef}>
      <Nav />
      <Main />
      <Footer />
    </div>
  );
};

export default App;
