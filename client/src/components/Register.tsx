import React, { useState } from "react";
import "../styles/Form.css";
import { FaArrowCircleLeft } from "react-icons/fa";
import { Link } from "react-router-dom";

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

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Reset error and success messages before making a new request
    setErrorMessage("");
    setSuccessMessage("");

    const formData = {
      first_name: firstName,
      last_name: lastName,
      email: email,
      password: password,
      date_of_birth: dateOfBirth,
    };

    setLoading(true); // Start loading

    try {
      const response = await fetch("http://localhost:3000/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      setLoading(false); // End loading

      if (response.ok) {
        const data = await response.json();
        setSuccessMessage("User registered successfully!"); // Set success message
        console.log("User registered successfully:", data);
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.message || "Failed to register user."); // Set error message
        console.error("Error registering user:", errorData.message);
      }
    } catch (error) {
      setLoading(false); // End loading on error
      setErrorMessage("An error occurred while registering."); // Set error message for unexpected errors
      console.error("Error:", error);
    }
  };

  return (
    <div className="container">
      <div className="image">
        <Link to="/" className="icon"><FaArrowCircleLeft /></Link>
        <img src="./images/rb_22006.png" alt="lady-doing-finances" id="image" />
      </div>
      <div className="form">
        <h2 className="title">Register</h2>
        <form onSubmit={handleRegister}>
          <div className="name">
            <div className="formField">
              <label htmlFor="firstName" className="label">First Name</label>
              <input
                type="text"
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
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
                required
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
              required
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
              required
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
              required
              className="input"
            />
          </div>

          {errorMessage && <div className="error">{errorMessage}</div>} {/* Display error message */}
          {successMessage && <div className="success">{successMessage}</div>} {/* Display success message */}

          <button type="submit" className="buttonSubmit" disabled={loading}>
            {loading ? "Registering..." : "Register"} {/* Show loading state */}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;