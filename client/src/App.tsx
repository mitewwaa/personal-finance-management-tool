import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LandingPage from './components/Home/LandingPage';
import LoginPage from './components/Login/Login';
import RegisterPage from './components/Login/Register';
import NavBar from './components/Navigation/NavBar';
import TransactionsPage from './components/Transactions/TransactionsPage';
import Dashboard from './components/Home/Dashboard';
import BudgetPage from './components/Budgets/BudgetsPage';
import CreateBudgetPage from './components/Budgets/CreateBudgetPage';
import ProtectedRoute from './components/Utils/ProtectedRoute';

import './App.css';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(!!localStorage.getItem('jwt_token'));
  const [name, setName] = useState<string>('');
  const [userId, setUserId] = useState<string>('');

  useEffect(() => {
    const token = localStorage.getItem('jwt_token');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('jwt_token');
    setIsLoggedIn(false);
    setUserId('');
    setName('');
  };

  return (
    <Router>
      <div>
        {isLoggedIn && <NavBar onLogout={handleLogout} />}
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage setIsLoggedIn={setIsLoggedIn} setUserId={setUserId} setName={setName} />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/dashboard" element={ <ProtectedRoute isLoggedIn={isLoggedIn}> <Dashboard name={name} userId={userId} /></ProtectedRoute>}/>
          <Route
            path="/transactions"
            element={
              <ProtectedRoute isLoggedIn={isLoggedIn}><TransactionsPage /></ProtectedRoute>}/>
          <Route path="/budgets" element={<ProtectedRoute isLoggedIn={isLoggedIn}><BudgetPage /></ProtectedRoute>}/>
          <Route path="/create-budget" element={<ProtectedRoute isLoggedIn={isLoggedIn}><CreateBudgetPage /></ProtectedRoute>}/>
        </Routes>
      </div>
    </Router>
  );
};

export default App;