import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, BrowserRouter } from 'react-router-dom';
import JwtDecoder from './utils/jwtDecoder';
import ProtectedRoutes from './middleware/ProtectedRoute';
import UnProtectedRoute from './middleware/UnprotectedRoute';

// Helper function to check if the user is authenticated
const isAuthenticated = () => !!localStorage.getItem('token');

// Protected route component
const ProtectedRoute = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/" />;
};

const App = () => {

  const token = JwtDecoder().isTokenValid
  const userData = JwtDecoder().decodedToken
  const role = userData ? userData?.role : null;
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (token) {
      setIsLoading(false);
    } else {
      setIsLoading(false);
    }
  }, [token]);

  return (
    <>
      {isLoading ? undefined : (
        <BrowserRouter>
          {token ? <ProtectedRoutes roles={role}/> : <UnProtectedRoute />}
        </BrowserRouter>
      )}
    </>
  );
};

export default App;