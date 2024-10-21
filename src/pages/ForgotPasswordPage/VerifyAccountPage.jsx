import { useState, useEffect } from "react";

import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { confirmForgotPassword } from "../../redux/features/authentication/authActions";
import { useLocation } from "react-router";
import { useNavigate } from "react-router-dom";

const VerifyAccountPage = () => {
  const location = useLocation();
  const { email } = location.state || {};

  const [codeValue, setCodeValue] = useState("");

  const [passwordValue, setPasswordValue] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [passwordFocus, setPasswordFocus] = useState(false);

  const [confirmPasswordValue, setConfirmPasswordValue] = useState("");
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [confirmPasswordFocus, setConfirmPasswordFocus] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, success, error } = useSelector((state) => state.auth);

  const handleSubmit = () => {
    if (passwordValue !== confirmPasswordValue) {
      alert("Passwords do not match");
    } else {
      dispatch(confirmForgotPassword(email, codeValue, passwordValue));
    }
  };

  useEffect(() => {
    if (success) {
      alert("Password reset successful!");
      navigate("/login");
    }
    if (error) {
      alert(`Password reset failed: ${error}`);
    }
  }, [success, error]);

  return (
    <div className="flex items-center h-full justify-center">
      <div className="px-4 py-4 flex flex-col relative w-1/2">
        <h1 className="my-4 text-3xl font-bold text-center">Password Reset</h1>
        <div className="my-2 flex flex-col">
          <label htmlFor="code">Enter Code</label>
          <input
            id="code"
            value={codeValue}
            onChange={(e) => setCodeValue(e.target.value)}
            placeholder="Your Code"
            type="text"
            className="px-4 py-2 border border-gray-300 rounded-xl"
          />
        </div>
        <div className="my-2 flex flex-col">
          <label htmlFor="password">New Password</label>
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
        <div className="my-2 flex flex-col">
          <label htmlFor="password">Confirm New Password</label>
          <div
            className={`flex flex-row px-4 py-2 rounded-xl ${
              confirmPasswordFocus
                ? "border-2 border-blue-700"
                : " border border-gray-300"
            }`}
          >
            <input
              id="password"
              placeholder="Password"
              value={confirmPasswordValue}
              type={confirmPasswordVisible ? "text" : "password"}
              onChange={(e) => setConfirmPasswordValue(e.target.value)}
              onFocus={() => setConfirmPasswordFocus(true)}
              onBlur={() => setConfirmPasswordFocus(false)}
              className="mr-auto w-full outline-none"
            />
            <button
              onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
            >
              {confirmPasswordVisible ? <IoEyeOutline /> : <IoEyeOffOutline />}
            </button>
          </div>
        </div>
        <button
          className="my-4 py-2 bg-blue-400 text-white rounded-xl hover:bg-blue-500"
          onClick={handleSubmit}
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default VerifyAccountPage;
