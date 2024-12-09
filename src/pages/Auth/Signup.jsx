import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
import { FaFacebookF } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import CountryList from "react-select-country-list";
import { signUp } from "aws-amplify/auth";
import PHONECODESEN from "../../utils/phone-codes-en";
import { getPhoneCodeslist } from "../../utils/utils";

const SignUp = () => {
  const [emailValue, setEmailValue] = useState("");
  const [passwordValue, setPasswordValue] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [countryCode, setCountryCode] = useState("US");
  const [country, setCountry] = useState("");
  const [confirmPasswordValue, setConfirmPasswordValue] = useState("");

  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [passwordFocus, setPasswordFocus] = useState(false);
  const [passwordsMatch, setPasswordsMatch] = useState(true);

  const countries = CountryList().getData();

  const navigate = useNavigate();

  const handleSignUp = async () => {
    if (passwordValue !== confirmPasswordValue) {
      setPasswordsMatch(confirmPasswordValue === passwordValue);
      return;
    }

    try {
      const user = await signUp({
        username: emailValue,
        password: passwordValue,
        options: {
          userAttributes: {
            given_name: firstName,
            family_name: lastName,
            email: emailValue,
            phone_number: `${PHONECODESEN[countryCode]["secondary"]}${phone}`,
            "custom:Country": country,
          },
        },
      });
      if (user && user.isSignUpComplete === false) {
        navigate("/verify-otp", { state: { email: emailValue } });
      }
    } catch (error) {
      console.log("Sign up error:", error);
    }

    //dispatch(signup(fullName, phone, country, emailValue, passwordValue));
  };

  return (
    <div className="flex items-center h-full justify-center">
      <div className="px-4 py-4 flex flex-col relative w-1/2">
        <h1 className="my-4 text-3xl font-bold text-center">Sign Up</h1>

        <div className="my-1 flex flex-row gap-4">
          {/* First Name */}
          <div className="flex-1">
            <label htmlFor="firstName">First Name</label>
            <input
              id="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="First Name"
              type="text"
              className="w-full px-4 py-2 border border-gray-300 rounded-xl"
            />
          </div>

          {/* Last Name */}
          <div className="flex-1">
            <label htmlFor="lastName">Last Name</label>
            <input
              id="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Last Name"
              type="text"
              className="w-full px-4 py-2 border border-gray-300 rounded-xl"
            />
          </div>
        </div>

        {/* Email */}
        <div className="my-1 flex flex-col">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            value={emailValue}
            onChange={(e) => setEmailValue(e.target.value)}
            placeholder="Your Email"
            type="text"
            className="px-4 py-2 border border-gray-300 rounded-xl"
          />
        </div>

        {/* Phone  Number */}
        <div className="my-2 flex flex-col">
          <label htmlFor="phone">Phone Number</label>
          <div className="flex space-x-2">
            {/* Country Code Dropdown */}
            <select
              id="countryCode"
              value={countryCode}
              onChange={(e) => setCountryCode(e.target.value)}
              className="w-1/3 px-4 py-2 border border-gray-300 rounded-xl"
            >
              {getPhoneCodeslist(PHONECODESEN).map((option) => (
                <option key={option.code} value={option.code}>
                  {option.country} ({option.dialCode})
                </option>
              ))}
            </select>

            <input
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Your Phone Number"
              type="text"
              maxLength={10}
              className="w-2/3 px-4 py-2 border border-gray-300 rounded-xl"
            />
          </div>
        </div>

        {/* Country */}
        <div className="my-2 flex flex-col">
          <label htmlFor="country">Country</label>
          <select
            id="country"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-xl"
          >
            <option value="">Select your country</option>
            {countries.map((option) => (
              <option key={option.value} value={option.label}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Password */}
        <div className="my-2 flex flex-col">
          <label htmlFor="password">Password</label>
          <div
            className={`flex flex-row px-4 py-2 rounded-xl ${
              passwordFocus
                ? "border-2 border-blue-700"
                : " border border-gray-300"
            }`}
          >
            <input
              id="password"
              placeholder="Password"
              value={passwordValue}
              type={passwordVisible ? "text" : "password"}
              onChange={(e) => setPasswordValue(e.target.value)}
              onFocus={() => setPasswordFocus(true)}
              onBlur={() => setPasswordFocus(false)}
              className="mr-auto w-full outline-none"
            />
            <button onClick={() => setPasswordVisible(!passwordVisible)}>
              {passwordVisible ? <IoEyeOutline /> : <IoEyeOffOutline />}
            </button>
          </div>
        </div>

        {/* Confirm Password */}
        <div className="my-2 flex flex-col">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <div
            className={`flex flex-row px-4 py-2 rounded-xl border border-gray-300 focus:border-black`}
          >
            <input
              id="confirmPassword"
              placeholder="Confirm Password"
              value={confirmPasswordValue}
              type={confirmPasswordVisible ? "text" : "password"}
              onChange={(e) => setConfirmPasswordValue(e.target.value)}
              className="mr-auto w-full outline-none"
            />
            <button
              onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
            >
              {confirmPasswordVisible ? <IoEyeOutline /> : <IoEyeOffOutline />}
            </button>
          </div>
          {!passwordsMatch && (
            <p className="text-red-500 text-sm mt-1">Passwords do not match</p>
          )}
        </div>

        <button
          className="my-4 py-2 bg-blue-400 text-white rounded-xl hover:bg-blue-500"
          onClick={handleSignUp}
        >
          Sign up
        </button>

        <div className="flex items-center my-4">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="px-4 text-gray-500">Or With</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>

        <div className="flex flex-row items-center">
          <button className="mr-2 px-4 py-2 w-1/2 flex items-center justify-center border border-gray-300 rounded-xl">
            <FaFacebookF className="mx-2 text-xl text-blue-800" />
            <span>Facebook</span>
          </button>

          <button className="ml-2 px-4 py-2 w-1/2 flex items-center justify-center border border-gray-300 rounded-xl">
            <FcGoogle className="mx-2 text-xl" />
            <span>Google</span>
          </button>
        </div>

        <div className="mt-16 flex flex-row justify-center">
          <p>Already have an account?</p>
          <button
            className="mx-2 text-left underline"
            onClick={() => navigate("/login")}
          >
            Sign In
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
