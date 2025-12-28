import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from "react-router-dom";
import { HelmetProvider } from 'react-helmet-async';
import './index.css';
import App from './components/App/App';
import reportWebVitals from './reportWebVitals';

// const root = ReactDOM.createRoot(document.getElementById('root'));
const container = document.getElementById("root");

const app = (
  <BrowserRouter>
  <React.StrictMode>
  <HelmetProvider>
    <App />
  </HelmetProvider>
  </React.StrictMode>
  </BrowserRouter>
)

if (container && container.hasChildNodes()) {
  ReactDOM.hydrateRoot(container, app);
} else if (container) {
  ReactDOM.createRoot(container).render(app);
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
