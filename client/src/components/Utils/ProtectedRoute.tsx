import React from 'react';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  isLoggedIn: boolean;
  children: React.ReactNode; // Може да съдържа множество елементи
  linkTo: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ isLoggedIn, children, linkTo }) => {
  if (!isLoggedIn) {
    return <Navigate to="/login" />;
  } else if (isLoggedIn && linkTo === "/login") {
    return <Navigate to="/dashboard" />
  }
  return <>{children}</>; // Връщаме children обвити в React Fragment
};

export default ProtectedRoute;