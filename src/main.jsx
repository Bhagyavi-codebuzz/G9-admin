import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css';
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "react-phone-input-2/lib/style.css";
import { ToastContainer } from 'react-toastify';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  // <React.StrictMode>
    <BrowserRouter>
      <App />

      <ToastContainer
        position="top-center"
        autoClose={2000}
        closeOnClick
        // draggable
        theme="colored"
      />
    </BrowserRouter>
  // </React.StrictMode>,
)
