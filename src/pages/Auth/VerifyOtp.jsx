import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { confirmSignUp, resendSignUpCode } from "aws-amplify/auth";
import { maskEmail } from "../../utils/utils";

function OTPVerification() {
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [resendMessage, setResendMessage] = useState("");
  const navigate = useNavigate();
  const { state } = useLocation();

  const handleChange = (element, index) => {
    const value = element.value.slice(-1);
    if (!/^\d$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      document.getElementById(`otp-input-${index + 1}`).focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && otp[index] === "" && index > 0) {
      document.getElementById(`otp-input-${index - 1}`).focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const { isSignUpComplete } = await confirmSignUp({
        username: state?.email,
        confirmationCode: otp.join(""),
      });
      if (isSignUpComplete) {
        setMessage("OTP Verified Successfully!");
        setTimeout(() => navigate("/login"), 2000);
      }
    } catch (error) {
      setMessage("Invalid OTP. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendCode = async () => {
    try {
      await resendSignUpCode({ username: state?.email });
      setResendMessage("A new OTP has been sent to your email.");
      setTimeout(() => setResendMessage(""), 5000); // Clear the message after 5 seconds
    } catch (error) {
      setResendMessage("Failed to resend OTP. Please try again later.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white shadow-md rounded-lg">
        <h2 className="text-2xl font-semibold text-center text-gray-800">
          Verify Your Email
        </h2>
        <p className="text-sm text-center text-gray-600">
          Enter OTP code send to <strong>{maskEmail(state?.email)}</strong>
        </p>
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div className="flex justify-center space-x-2">
            {otp.map((data, index) => (
              <input
                key={index}
                type="text"
                id={`otp-input-${index}`}
                name="otp"
                value={data}
                onChange={(e) => handleChange(e.target, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                maxLength={1}
                className="w-12 h-12 text-center text-xl border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            ))}
          </div>
          <button
            type="submit"
            className={`w-full py-2 mt-4 text-white font-semibold rounded-md ${
              isSubmitting
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600"
            }`}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Verifying..." : "Verify OTP"}
          </button>
          {message && (
            <p
              className={`mt-4 text-center font-medium ${
                message.includes("Success") ? "text-green-600" : "text-red-600"
              }`}
            >
              {message}
            </p>
          )}
        </form>
        <div className="mt-4 text-center">
          <p className="text-gray-600">Didn't receive OTP code?</p>
          <button
            onClick={handleResendCode}
            className="text-blue-500 underline hover:text-blue-700"
          >
            Resend code
          </button>
          {resendMessage && (
            <p className="mt-2 text-green-600 text-sm">{resendMessage}</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default OTPVerification;
