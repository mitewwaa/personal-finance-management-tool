import React, { useState } from "react";
import "../../styles/Form.css";
import { FaArrowCircleLeft } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const RegisterPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate(); 

  const isEmailValid = (email: string): boolean => {
    return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
  };

  const isNameValid = (name: string): boolean => {
    return /^[a-zA-Z-]+$/.test(name); // only latin letters and dashes
  };

  const isPasswordStrong = (password: string): boolean => {
      return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+={}\[\]|\\:;"'<>,.?/-]).{8,}$/.test(password);
  };


  const isAdult = (dateOfBirth: string): boolean => {
    const birthDate = new Date(dateOfBirth);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    return age >= 18;  // User should be at least 18 years old
  };

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!firstName || !lastName || !email || !password || !confirmPassword || !dateOfBirth) {
      setErrorMessage('All fields are required!');
      return;
    }

    if (!isEmailValid(email)) {
      setErrorMessage('Invalid email format!');
      return;
    }

    if (!isNameValid(firstName) || !isNameValid(lastName)) {
      setErrorMessage('Invalid first name or last name!');
      return;
    }

    if (!isPasswordStrong(password)) {
      setErrorMessage('Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one digit, and one special character!');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match!');
      return;
    }

    if (!isAdult(dateOfBirth)) {
      setErrorMessage('You must be at least 18 years old to register.');
      return;
    }

    const formData = {
      first_name: firstName,
      last_name: lastName,
      email: email,
      password: password,
      date_of_birth: dateOfBirth,
    };
    setLoading(true);

    try {
      const response = await axios.post("http://localhost:3000/users", formData);

      setLoading(false);

      if (response.status === 201) {
        setSuccessMessage("Successful registration!");
        console.log("User registered successfully:", response.data);

        setTimeout(() => {
          navigate('/login');
        }, 2000);
      }
    } catch (error: any) {
      setLoading(false);
      const message = error.response?.data?.message || "An error occurred while registering.";
      setErrorMessage(message);
      console.error("Error registering user:", message);
    }
  };
  

  return (
    <div className="container">
      <div className="image">
        <Link to="/" className="icon"><FaArrowCircleLeft /></Link>
        <img src="./images/rb_22006.png" alt="lady-doing-finances" id="image" />
      </div>
      <div className="form">
        <Link to="/" className='icon'><FaArrowCircleLeft /></Link>
        <h2 className="title-form">Register</h2>
        <form onSubmit={handleRegister}>
          <div className="name">
            <div className="formField">
              <label htmlFor="firstName" className="label">First Name</label>
              <input
                type="text"
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="inputName"
              />
            </div>
            <div className="formField">
              <label htmlFor="lastName" className="label">Last Name</label>
              <input
                type="text"
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="inputName"
              />
            </div>
          </div>
          <div className="formField">
            <label htmlFor="dateOfBirth" className="label">Date of birth</label>
            <input
              type="date"
              id="dateOfBirth"
              value={dateOfBirth}
              onChange={(e) => setDateOfBirth(e.target.value)}
              className="input"
            />
          </div>
          <div className="formField">
            <label htmlFor="email" className="label">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input"
            />
          </div>
          <div className="formField">
            <label htmlFor="password" className="label">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input"
            />
          </div>
          <div className="formField">
            <label htmlFor="confirmPassword" className="label">Repeat password</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="input"
            />
          </div>

          {errorMessage && <div className="error">{errorMessage}</div>} 
          {successMessage && <div className="success">{successMessage}</div>} 

          <button type="submit" className="buttonSubmit" disabled={loading}>
            {loading ? "Registering..." : "Register"} 
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;