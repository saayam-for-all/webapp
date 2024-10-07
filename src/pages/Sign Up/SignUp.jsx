import React, { useState, useEffect } from 'react';
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import Select from 'react-select';

const SignUpPage = () => {

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        
        const response = await fetch('https://restcountries.com/v3.1/all');
        const data = await response.json();
        const countryOptions = data.map((country) => ({
          value: country.cca2, // Using cca2 code
          label: country.name.common, // Country name
        }));
        setCountries(countryOptions);
        setSelectedCountry(countryOptions.find(country => country.value == 'US')); // Default to US
      } catch (error) {
        console.error('Error fetching countries:', error);
      }
    };
    fetchCountries();
  }, []);

  const handlePhoneChange = (value) => {
    setPhone(value);
  };

  // Email validation using regex
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Basic email format check
    return emailRegex.test(email);
  };

  // Handle email change and validation
  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);

    // Check if the email is valid and set error message accordingly
    if (!validateEmail(value) && value.length > 0) {
      setEmailError('Invalid email format. Please check your email');
    } else {
      setEmailError('');
    }
  };

  const handleCountryChange = (selectedOption) => {
    setSelectedCountry(selectedOption);
  };

  // Handle Password Validation
  const validatePassword = (value) => {
    setPassword(value);

    // Check for password length and complexity (e.g., min 8 characters, including a number)
    if (value.length < 8) {
      setPasswordError('Password must be at least 8 characters long.');
    } else if (!/\d/.test(value)) {
      setPasswordError('Password must contain at least one number.');
    } else {
      setPasswordError('');
    }
  };

  // Handle Confirm Password Validation
  const validateConfirmPassword = (value) => {
    setConfirmPassword(value);

    // Check if confirm password matches the password
    if (value !== password) {
      setConfirmPasswordError('Passwords do not match.');
    } else {
      setConfirmPasswordError('');
    }
  };

  return (
    <div className="flex items-center h-full justify-center">
      <div className="flex flex-col relative w-1/2">
        <h1 className="my-4 text-3xl font-bold text-center">Sign Up</h1>

        <form>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">First Name</label>
            <input type="text" className="w-full p-2 border border-gray-300 rounded-md" placeholder="eg. John" />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Last Name</label>
            <input type="text" className="w-full p-2 border border-gray-300 rounded-md" placeholder="eg. Doe" />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Email</label>
            <input type="email" 
            className="w-full p-2 border border-gray-300 rounded-md"
            placeholder="eg. abc@example.com" 
            value={email}
            onChange={handleEmailChange} />
            {emailError && (
              <p className="text-red-500 text-sm mt-1">{emailError}</p> // Show error message if email is invalid
            )}
          </div>

          <div className="mb-4">
          <label className="block mb-1 text-sm font-medium">Country</label>
          <div className="relative">
              
                <Select 
                value={selectedCountry}
                onChange={handleCountryChange}
                options={countries}
                placeholder="Select a country"
              />
        
            </div>
          </div>

          <div className="mb-4">
            
            <div className="w-5/5">
              <label className="block mb-1 text-sm font-medium">Phone</label>
              <div className="w-full">
              <PhoneInput 
              country={selectedCountry ? selectedCountry.value.toLowerCase() : 'us'} // Bind the selected country to PhoneInput
              value={phone}
              onChange={handlePhoneChange}
              inputProps={{
                name: 'phone',
                required: true,
                autoFocus: true,
                className: 'w-full p-2 border border-gray-300 rounded-md pl-12 ',
                placeholder:'eg. 1234567890'
              }}  
              containerClass="w-full"
            />
          </div>
            </div>
          </div>

          <div className="mb-4 relative">
            <label className="block text-gray-700 mb-2">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="Password"
              value={password}
              onChange={(e) => validatePassword(e.target.value)}
            />
            <span
              className="absolute right-3 top-10 cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <IoEyeOutline className="h-5 w-5 text-gray-500" />
              ) : (
                <IoEyeOffOutline className="h-5 w-5 text-gray-500" />
              )}
            </span>
            {/* Show validation error */}
            {passwordError && <p className="text-red-500 text-sm mt-1">{passwordError}</p>}
          </div>

          <div className="mb-6 relative">
            <label className="block text-gray-700 mb-2">Confirm Password</label>
            <input
              type={showConfirmPassword ? "text" : "password"}
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => validateConfirmPassword(e.target.value)}
            />
            <span
              className="absolute right-3 top-10 cursor-pointer"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? (
                <IoEyeOutline className="h-5 w-5 text-gray-500" />
              ) : (
                <IoEyeOffOutline className="h-5 w-5 text-gray-500" />
              )}
            </span>
             {/* Show validation error */}
            {confirmPasswordError && <p className="text-red-500 text-sm mt-1">{confirmPasswordError}</p>}
          </div>

          <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600">
            Sign Up
          </button>
          <p className="mt-4 text-sm flex justify-center">
           By continuing, you agree to our &nbsp;<a href="/terms" className="text-blue-600">Terms of Service &nbsp;</a> and &nbsp;<a href="/privacy" className="text-blue-600"> Privacy Policy</a>.
          </p>
        </form>

        <div className="mt-4 text-center mb-6">
          <p className="text-gray-600">Already have an account? <a href="/login" className="text-blue-500">Log In</a></p>
        </div>
      </div>
    </div>
  );
}

export default SignUpPage;