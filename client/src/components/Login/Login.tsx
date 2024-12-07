import React, { useState } from 'react';
import { FaArrowCircleLeft } from "react-icons/fa";
import { Link, useNavigate } from 'react-router-dom';  
import '../../styles/Form.css';
import axios from 'axios';

interface LoginPageProps {
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
  setName: React.Dispatch<React.SetStateAction<string>>;
  setUserId: React.Dispatch<React.SetStateAction<string>>;
}

const LoginPage: React.FC<LoginPageProps> = ({ setIsLoggedIn, setUserId, setName }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate(); 

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { email, password };
    setLoading(true);
    setError('');
    try {
      const response = await axios.post("http://localhost:3000/users/login", payload);
      
      if (response.data.token) {
        localStorage.setItem('jwt_token', response.data.token); 
        setName(response.data.name);
        setUserId(response.data.id);
        setIsLoggedIn(true); 
        navigate('/dashboard');
      }
    } catch (error: any) {
      setError(error.response?.data?.message || "Login failed, please try again");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='container'>
      <div className='image'>
        <Link to="/" className='icon'><FaArrowCircleLeft /></Link>
        <img src="./images/rb_22006.png" alt='lady-doing-finances' id='image'/>
      </div>
      <div className='form'>
        <Link to="/" className='icon'><FaArrowCircleLeft /></Link>
        <h2 className='title-form'>Log In</h2>
        <form onSubmit={handleLogin}>
          <div className='formField'>
            <label htmlFor="email" className='label'>Email</label>
            <input 
              type="email" 
              id="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
              className='input'
            />
          </div>
          <div className='formField'>
            <label htmlFor="password" className='label'>Password</label>
            <input 
              type="password" 
              id="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
              className='input'
            />
          </div>
          <button type="submit" className='buttonSubmit' disabled={loading}>
            {loading ? 'Logging in...' : 'Log In'}
          </button>
        </form>

        {error && <div className='error-message' style={{color: "red"}}>{error}</div>}
      </div>
    </div>
  );
};

export default LoginPage;