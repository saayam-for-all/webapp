import React from 'react';
import { Link } from 'react-router-dom'; // Import Link from React Router
import './login.css'
import { FcGoogle } from "react-icons/fc";

const Login = () => {
  return (
    <center>
      <div className="form-container">
        <p className="title">Welcome</p>
        <form className="form">
          <input type="email" className="input" placeholder="Email" />
          <input type="password" className="input" placeholder="Password" />
          <p className="page-link">
            <span className="page-link-label">Forgot Password?</span>
          </p>
          <button className="form-btn">Log in</button>
        </form>
        <p className="sign-up-label">
          {/* Use Link to redirect to the login page */}
          Don't have an account? <Link to="/signup" className="sign-up-link">Sign up</Link>
        </p>
        <div className="buttons-container">
        {
        //   <div className="apple-login-button">
        //     <svg stroke="currentColor" fill="currentColor" strokeWidth="0" className="apple-icon" viewBox="0 0 1024 1024" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
        //       {/* SVG code for Apple login button */}
        //     </svg>
        //     <span>Log in with Apple</span>
        //   </div>
        } 
          <div className="google-login-button">
            <svg stroke="currentColor" fill="currentColor" strokeWidth="0" version="1.1" x="2px" y="2px" className="google-icon" viewBox="0 0 48 48" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
              {/* SVG code for Google login button */}
            </svg>
            <FcGoogle />
            <span>Log in with Google</span>
          </div>
        </div>
      </div>
    </center>
  );
}

export default Login;
