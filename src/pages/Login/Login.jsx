import React, { useState } from 'react';
import dotenv from 'dotenv';

function Login() {
  const [error, setError] = useState(null); // State to store error message
  const loginUrl = process.env.REACT_APP_LOGIN_URL;

  const handleClick = async () => {
    try {
      const response = await fetch(loginUrl, {
        method: 'GET', // Assuming this is a login request (replace if needed)
        // body: JSON.stringify(data), // Replace 'data' with your actual login data object
        // headers: { 'Content-Type': 'application/json' } // Optional header for JSON data
      });

      if (!response.ok) {
        // Handle non-200 status codes as errors
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json(); // Parse the response as JSON
      console.log("Data:", data);
      // Handle successful login logic here (e.g., redirect, update state)
    } catch (error) {
      setError(error.message || "An error occurred during login.");
      console.error("Error:", error); // Log the error for debugging
    }
  };


  return (
    <div>
      <button onClick={handleClick}>Login</button>
      {error && <p className="error-message">{error}</p>} {/* Display error if present */}
    </div>
  );
}

export default Login;