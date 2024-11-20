import React from 'react';
import { Link } from 'react-router-dom';

import '../styles/LandingPage.css'

const LandingPage: React.FC = () => {
  return (
    <div className='page'>
      <div className='pageContainer'>
        <div className='textContainer'>
            <h1>Pocketly</h1>
            <h2>The modern way to manage your finances!</h2>
            <div className='buttonContainer'>
              <button className='button'><Link to="/login">Log In</Link></button>
              <button className='button'><Link to="/register">Register</Link></button>
            </div>
        </div>
        <div className='imageContainer'>
            <img src='./images/OBJECTS.svg' id='image' alt='piggy-bank'/>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;