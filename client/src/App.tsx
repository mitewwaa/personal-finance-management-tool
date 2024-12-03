import React, {useState} from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LandingPage from './components/Home/LandingPage';
import LoginPage from './components/Login/Login';
import RegisterPage from './components/Login/Register';
import NavBar from './components/Navigation/NavBar';
import TransactionsPage from './components/Transactions/TransactionsPage';
import './App.css'
import Dashboard from './components/Home/Dashboard';


const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [name, setName] = useState<string>("");

  return (
      <Router>
      <div>
        {isLoggedIn && <NavBar />} 
        
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage setIsLoggedIn={setIsLoggedIn} setName={setName} />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/dashboard" element={isLoggedIn && <Dashboard name={name} />} />
          <Route path="/transactions" element={isLoggedIn && <TransactionsPage />} />
        </Routes>
      </div>
      </Router>
  );
};


export default App;