import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    // Check if the admin is logged in
    axios.get('http://localhost:8080/api/admin/me', { withCredentials: true })
      .then(response => {
        setIsAuthenticated(true);
      })
      .catch(error => {
        setIsAuthenticated(false);
      });
  }, []);

  if (isAuthenticated === null) {
    return <div style={{ padding: '100px', textAlign: 'center', color: '#c9a876' }}>Verifying Admin Access...</div>;
  }

  if (isAuthenticated === false) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}

export default ProtectedRoute;
