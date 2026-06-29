import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './components/App/App';
import reportWebVitals from './reportWebVitals';

// Шрифты шапки: ссылки меню (PP Right Grotesk) и дата/кириллица (EB Garamond).
// Резолвятся в тот же URL, что и url() в index.css, поэтому preload реально
// попадает в нужный файл и убирает «дёрганье» текста в хедере при загрузке.
import fontTitle from './vendor/fonts/font_title.woff';
import fontCyrillic from './vendor/fonts/font.woff';

[fontTitle, fontCyrillic].forEach((href) => {
  const link = document.createElement('link');
  link.rel = 'preload';
  link.as = 'font';
  link.type = 'font/woff';
  link.href = href;
  link.crossOrigin = 'anonymous';
  document.head.appendChild(link);
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

reportWebVitals();
