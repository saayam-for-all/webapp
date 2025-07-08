import {
  confirmSignUp,
  resendSignUpCode,
  confirmUserAttribute,
} from "aws-amplify/auth";
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { maskEmail } from "../../utils/utils";
import { updateUserProfile } from "../../redux/features/authentication/authActions";

function OTPVerification() {
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [resendMessage, setResendMessage] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { state } = useLocation();

  const isEmailUpdate = state?.isEmailUpdate;
  const pendingProfileData = state?.pendingProfileData;

  useEffect(() => {
    document.getElementById("otp-input-0")?.focus();
  }, []);

  const handleChange = (element, index) => {
    const value = element.value.slice(-1);
    if (!/^\d?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) {
      document.getElementById(`otp-input-${index + 1}`).focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      const newOtp = [...otp];
      if (!newOtp[index] && index > 0) {
        document.getElementById(`otp-input-${index - 1}`).focus();
      }
      newOtp[index] = "";
      setOtp(newOtp);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (isEmailUpdate) {
        // Handle email update verification
        await confirmUserAttribute({
          userAttributeKey: "email",
          confirmationCode: otp.join(""),
        });

        if (pendingProfileData) {
          const result = await dispatch(updateUserProfile(pendingProfileData))
            .then((response) => response)
            .catch((error) => {
              throw error;
            });

          if (result?.success) {
            setMessage("Email verified and profile updated successfully!");
            setTimeout(() => navigate("/profile"), 2000);
          } else {
            throw new Error(result?.error || "Failed to update profile");
          }
        } else {
          setMessage("Email verified successfully!");
          setTimeout(() => navigate("/profile"), 2000);
        }
      } else {
        const { isSignUpComplete } = await confirmSignUp({
          username: state?.email,
          confirmationCode: otp.join(""),
        });

        if (isSignUpComplete) {
          setMessage("OTP Verified Successfully!");
          setTimeout(() => navigate("/login"), 2000);
        }
      }
    } catch (error) {
      console.error("Verification error:", error);
      setMessage("Invalid OTP. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendCode = async () => {
    try {
      if (isEmailUpdate) {
        setResendMessage(
          "Please try updating your email again from the profile page.",
        );
      } else {
        await resendSignUpCode({ username: state?.email });
        setResendMessage("A new OTP has been sent to your email.");
      }
      setTimeout(() => setResendMessage(""), 5000);
    } catch (error) {
      setResendMessage("Failed to resend OTP. Please try again later.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white shadow-md rounded-lg">
        <h2 className="text-2xl font-semibold text-center text-gray-800">
          {isEmailUpdate ? "Verify Your New Email" : "Verify Your Email"}
        </h2>
        <p className="text-sm text-center text-gray-600">
          Enter OTP code sent to <strong>{maskEmail(state?.email)}</strong>
          {isEmailUpdate && (
            <span className="block mt-2 text-orange-600">
              Your profile will be updated after verification
            </span>
          )}
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
                autoFocus={index === 0}
                className="w-12 h-12 text-center text-xl border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            ))}
          </div>
          <button
            type="submit"
            className={`w-full py-2 mt-4 text-white font-semibold rounded-md ${
              isSubmitting
                ? "bg-gray-400 cursor-not-allowed hover:bg-gray-400"
                : "bg-blue-500 hover:bg-blue-600"
            }`}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Verifying..." : "Verify OTP"}
          </button>
          {message && (
            <p
              className={`mt-4 text-center font-medium ${
                message.includes("Success") || message.includes("successfully")
                  ? "text-green-600"
                  : "text-red-600"
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
        {isEmailUpdate && (
          <div className="mt-4 text-center">
            <button
              onClick={() => navigate("/profile")}
              className="text-gray-500 underline hover:text-gray-700"
            >
              Cancel and return to profile
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default OTPVerification;
