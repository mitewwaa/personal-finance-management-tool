import React, { useState } from 'react';
import { FaArrowCircleLeft } from "react-icons/fa";
import { Link, useNavigate } from 'react-router-dom';  
import '../../styles/Form.css';

interface LoginPageProps {
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>; // Accept the function to update login state
}

const LoginPage: React.FC<LoginPageProps> = ({setIsLoggedIn}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate(); 

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { email, password };
    setLoading(true);

    try {
      const response = await fetch("http://localhost:3000/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Invalid email or password");
      }

      const data = await response.json();
      console.log(data.token);
      if (data.token) {
        localStorage.setItem('jwt_token', data.token); 
    }

      console.log("Successful login:", data);
      setLoading(false);

      setIsLoggedIn(true);
      
      navigate('/dashboard');  

    } catch (error: any) {
      setLoading(false);
      setError(error.message || "Login failed, please try again");
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
        <h2 className='title'>Log In</h2>
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
