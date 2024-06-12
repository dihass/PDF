import React from 'react';
import { Route, Navigate } from 'react-router-dom';

const ProtectedRoute = ({ component: Component, ...rest }) => {
  const isAuthenticated = !!localStorage.getItem('token');

  console.log('ProtectedRoute: isAuthenticated = ', isAuthenticated);

  return (
    isAuthenticated ? (
      <Component {...rest} />
    ) : (
      <Navigate to="/login" />
    )
  );
};

export default ProtectedRoute;
