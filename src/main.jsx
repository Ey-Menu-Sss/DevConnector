// react ...
import React from 'react'
import ReactDOM from 'react-dom/client'
import { ToastContainer, toast } from 'react-toastify'
import { BrowserRouter as Router } from 'react-router-dom'
import axios from 'axios'

// styles ...
import './styles/main.scss'
import 'react-toastify/dist/ReactToastify.css';
import "../node_modules/boxicons/css/boxicons.min.css" 

// axios.defaults.baseURL = "http://localhost:8000/";
axios.defaults.baseURL = "https://devconnector-backend-yy5b.onrender.com/";
axios.defaults.headers.common["Content-Type"] = "application/json";
axios.defaults.withCredentials = true;
let token = localStorage.getItem("token");
if (token) axios.defaults.headers.common["x-auth-token"] = `${token}`;
// App file ...
import App from './App'
import { Provider } from 'react-redux'
import store from './store/index'

ReactDOM.createRoot(document.getElementById('root')).render(
  <Router>
    <Provider store={store}>
    <App />
    </Provider>
    <ToastContainer/>
  </Router>,
)
