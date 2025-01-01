import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import LandingPage from './components/Home/LandingPage';
import LoginPage from './components/Login/Login';
import RegisterPage from './components/Login/Register';
import NavBar from './components/Navigation/NavBar';
import TransactionsPage from './components/Transactions/TransactionsPage';
import Dashboard from './components/Home/Dashboard';
import BudgetPage from './components/Budgets/BudgetsPage';
import CreateBudgetPage from './components/Budgets/CreateBudgetPage';
import ProfilePage from './components/Profile/ProfilePage';
import ProtectedRoute from './components/Utils/ProtectedRoute';

import './App.css';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [name, setName] = useState<string>('');
  const [userId, setUserId] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true); 

  useEffect(() => {
    const token = localStorage.getItem('jwt_token');
  
    if (token) {
      try {
        const decodedToken: any = jwtDecode(token);
  
        const expirationTime = decodedToken.exp * 1000;
        if (expirationTime < Date.now()) {
          console.log('Token has expired');
          localStorage.removeItem('jwt_token');
          setIsLoggedIn(false);
        } else {
          setIsLoggedIn(true);
          setName(decodedToken.name);
          setUserId(decodedToken.userId);
        }
      } catch (error) {
        console.error('Token decoding failed', error);
        localStorage.removeItem('jwt_token');
        setIsLoggedIn(false);
      }
    } else {
      setIsLoggedIn(false);
    }
    setLoading(false);
  }, []);
  

  const handleLogout = () => {
    console.log('Logging out...');
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('categories');
    setIsLoggedIn(false);
    setUserId('');
    setName('');
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <div>
      {isLoggedIn && <NavBar onLogout={handleLogout} />}
        <div className='pageContent'>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage setIsLoggedIn={setIsLoggedIn} setUserId={setUserId} setName={setName} />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/dashboard" element={<ProtectedRoute isLoggedIn={isLoggedIn}><Dashboard name={name} userId={userId} /></ProtectedRoute>} />
            <Route path="/transactions" element={<ProtectedRoute isLoggedIn={isLoggedIn}><TransactionsPage userId={userId} /></ProtectedRoute>} />
            <Route path="/budgets" element={<ProtectedRoute isLoggedIn={isLoggedIn}><BudgetPage /></ProtectedRoute>} />
            <Route path="/create-budget" element={<ProtectedRoute isLoggedIn={isLoggedIn}><CreateBudgetPage /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute isLoggedIn={isLoggedIn}><ProfilePage setIsLoggedIn={setIsLoggedIn} /></ProtectedRoute>} />
          </Routes>
        </div>
      </div>
    </Router>
        
  );
};

export default App;