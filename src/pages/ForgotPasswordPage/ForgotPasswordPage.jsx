import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { forgotPassword } from "../../redux/features/authentication/authActions";
import { z } from "zod";

const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
});

const ForgotPasswordPage = () => {
  const [emailValue, setEmailValue] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = () => {
    try {
      const result = forgotPasswordSchema.safeParse({ email: emailValue });
      if (!result.success) {
        setError(result.error.format().email?._errors[0] || "Invalid email");
        return;
      }
      setError("");
      dispatch(forgotPassword(emailValue));
      navigate("/verify-account", { state: { email: emailValue } });
    } catch (err) {
      setError("An error occurred. Please try again.");
    }
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
            onChange={(e) => {
              setEmailValue(e.target.value);
              setError(""); // Clear error when user types
            }}
            placeholder="Your Email"
            type="email"
            className={`px-4 py-2 border rounded-xl ${
              error ? "border-red-500" : "border-gray-300"
            }`}
            required={true}
          />
          {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
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
