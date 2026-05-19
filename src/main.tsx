import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';
import { MobileApp } from './app/MobileApp';
import './styles.css';

const isMobileApp =
  typeof window !== 'undefined' &&
  (window.location.pathname === '/app' || window.location.pathname.startsWith('/app/'));

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>{isMobileApp ? <MobileApp /> : <App />}</React.StrictMode>,
);
