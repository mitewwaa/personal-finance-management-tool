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

import './App.css';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    const token = localStorage.getItem('jwt_token');
    return !!token; 
  });
  const [userId, setUserId] = useState<string>('');

  const handleLogout = () => {
    localStorage.removeItem('jwt_token');
    setIsLoggedIn(false); 
    setUserId('');
  };

  return (
    <Router>
      <div>
        {isLoggedIn && <NavBar onLogout={handleLogout} />} {/* Рендериране на NavBar само ако потребителят е влязъл */}
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage setIsLoggedIn={setIsLoggedIn} setUserId={setUserId} />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/transactions" element={<TransactionsPage />} />
          <Route path="/budgets" element={<BudgetPage />} />
          <Route path="/create-budget" element={<CreateBudgetPage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;