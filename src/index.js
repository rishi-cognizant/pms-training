import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';
import './index.css';


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
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
