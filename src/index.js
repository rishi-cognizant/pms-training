import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

global.ENV = {
  PORT: 1234,
  HOST: 'localhost',
  BASE_URL: 'http://localhost:8080/',
  WEBSITE_TITLE: 'Project Management System',
  WEBSITE_THEME: 'Project Management System',
  ADMIN_EMAIL: 'admin@myapp.com',
  MAILER_SERVICE: 'gmail',
  SOCKET_PORT: 8080,
  APP_LANGUAGE: "en"
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <App />
);