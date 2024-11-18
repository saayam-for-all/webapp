import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { forgotPassword } from "../../redux/features/authentication/authActions";

const ForgotPasswordPage = () => {
  const [emailValue, setEmailValue] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = () => {
    dispatch(forgotPassword(emailValue));
    navigate("/verify-account", { state: { email: emailValue } });
  };
  return (
    <div className="flex items-center h-full justify-center">
      <div className="px-4 py-4 flex flex-col relative w-1/2">
        <h1 className="my-4 text-3xl font-bold text-center">Password Reset</h1>
        <div className="my-2 flex flex-col">
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

export default ForgotPasswordPage;
