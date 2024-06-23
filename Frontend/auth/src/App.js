import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUser } from './Redux/slices/UserSlice';
import axios from 'axios';
import Home from './Components/Home';
import Login from './Components/Login';
import Signup from './Components/Signup';
import AdminLogin from './Components/AdminLogin';

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Validate token or decode it to check expiration (not shown here)
      axios.get('http://localhost:5000/api/auth/user', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then(response => {
        dispatch(setUser(response.data)); // Assuming backend returns user data
      })
      .catch(error => {
        console.error('Error fetching user data:', error);
        // Handle token validation errors or clear invalid tokens from localStorage
        localStorage.removeItem('token');
      });
    }
  }, [dispatch]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin-login" element={<AdminLogin />} />
      </Routes>
    </Router>
  );
};

export default App;
