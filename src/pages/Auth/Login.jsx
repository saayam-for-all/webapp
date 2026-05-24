import { signIn, signInWithRedirect } from "aws-amplify/auth";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { INACTIVITY_TIMEOUT } from "../../common/components/InactivityTimer/InactivityTimer.jsx";
import LoadingIndicator from "../../common/components/Loading/Loading.jsx";
import { checkAuthStatus } from "../../redux/features/authentication/authActions";
import "./Login.css";
import { FaAmazon, FaFacebookF, FaLinkedinIn } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

const LoginPage = () => {
  const { t } = useTranslation(["common"]);
  const { loading } = useSelector((state) => state.auth);

  const [emailValue, setEmailValue] = useState("");
  const [passwordValue, setPasswordValue] = useState("");

  const [passwordVisible, setPasswordVisible] = useState(false);
  const [passwordFocus, setPasswordFocus] = useState(false);

  const [errors, setErrors] = useState({});

  const { user } = useSelector((state) => state.auth);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const loginSchema = z.object({
    email: z.string().min(1, { message: t("common:EMAIL_REQUIRED") }),
    password: z.string().min(1, { message: t("common:PASSWORD_REQUIRED") }),
  });

  const handleGoogleLogin = async () => {
    try {
      await signInWithRedirect({ provider: "Google" });
    } catch (error) {
      console.error("Error redirecting to Google:", error);
    }
  };

  const handleFacebookLogin = async () => {
    try {
      await signInWithRedirect({ provider: "Facebook" });
    } catch (error) {
      console.error("Error redirecting to Facebook:", error);
    }
  };
  const handleLinkedInLogin = async () => {
    try {
      await signInWithRedirect({ provider: { custom: "LinkedIn" } });
    } catch (error) {
      console.error("Error starting redirect flow:", error);
    }
  };

  const socialProviders = [
    {
      label: "Amazon",
      icon: <FaAmazon className="mx-2 text-xl text-gray-700" />,
      onClick: undefined,
      disabled: true,
    },
    {
      label: t("common:FACEBOOK"),
      icon: <FaFacebookF className="mx-2 text-xl text-blue-800" />,
      onClick: handleFacebookLogin,
      disabled: false,
    },
    {
      label: t("common:GOOGLE"),
      icon: <FcGoogle className="mx-2 text-xl" />,
      onClick: handleGoogleLogin,
      disabled: false,
    },
    {
      label: "LinkedIn",
      icon: <FaLinkedinIn className="mx-2 text-xl text-[#0A66C2]" />,
      onClick: handleLinkedInLogin,
      disabled: false,
    },
  ];

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [navigate, user]);

  const handleSignIn = async () => {
    try {
      const result = loginSchema.safeParse({
        email: emailValue,
        password: passwordValue,
      });
      if (!result.success) {
        const formattedErrors = result.error.format();
        setErrors({
          email: formattedErrors.email?._errors[0],
          password: formattedErrors.password?._errors[0],
        });
        return;
      }

      const { isSignedIn, nextStep } = await signIn({
        username: emailValue,
        password: passwordValue,
      });
      if (isSignedIn) {
        await dispatch(checkAuthStatus());
        const newExpiry = Date.now() + INACTIVITY_TIMEOUT;
        localStorage.setItem("expireTime", newExpiry.toString());
        navigate("/dashboard");
      } else {
        if (nextStep?.signInStep) {
          if (nextStep.signInStep === "CONFIRM_SIGN_UP") {
            navigate("/verify-otp", {
              state: { email: emailValue, fromSignIn: true },
            });
          } else {
            throw new Error("Unsupported sign-in step: " + nextStep.signInStep);
          }
        } else {
          throw new Error("Unknown error, please contact admin");
        }
      }
    } catch (error) {
      console.log("error", error);
      setErrors({ root: t("common:INVALID_CREDENTIALS") });
    }
  };

  return (
    <div className="flex items-center h-full justify-center">
      <div className="px-4 py-4 flex flex-col relative w-1/2">
        <h1 className="my-4 text-3xl font-bold text-center">
          {t("common:LOGIN")}
        </h1>
        <div className="my-2 flex flex-col">
          <label htmlFor="email">{t("common:EMAIL")}</label>
          <input
            id="email"
            value={emailValue}
            onChange={(e) => setEmailValue(e.target.value)}
            placeholder={t("common:EMAIL")}
            type="text"
            className="px-4 py-2 border border-gray-300 rounded-xl"
            required={true}
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
          )}
        </div>
        <div className="my-2 flex flex-col">
          <label htmlFor="password">{t("common:PASSWORD")}</label>
          <div
            className={`flex flex-row px-4 py-2 rounded-xl ${
              passwordFocus
                ? "border-2 border-black -m-px"
                : " border border-gray-300"
            }`}
          >
            <input
              id="password"
              placeholder={t("common:PASSWORD")}
              value={passwordValue}
              type={passwordVisible ? "text" : "password"}
              onChange={(e) => setPasswordValue(e.target.value)}
              onFocus={() => setPasswordFocus(true)}
              onBlur={() => setPasswordFocus(false)}
              className="mr-auto w-full outline-none"
              required={true}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSignIn();
                }
              }}
            />
            <button onClick={() => setPasswordVisible(!passwordVisible)}>
              {passwordVisible ? <IoEyeOutline /> : <IoEyeOffOutline />}
            </button>
          </div>
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">{errors.password}</p>
          )}
        </div>
        <button
          className="my-2 text-left underline"
          onClick={() => navigate("/forgot-password")}
        >
          {t("common:FORGOT_PASSWORD")}
        </button>
        <button
          disabled={loading}
          className="my-4 py-2 bg-blue-400 text-white rounded-xl hover:bg-blue-500"
          onClick={handleSignIn}
        >
          <div className="flex items-center justify-center">
            <span className={loading ? "mr-2" : ""}>{t("common:LOGIN")}</span>
            {loading && <LoadingIndicator size="24px" />}
          </div>
        </button>
        {errors.root && (
          <p className="text-red-500 text-sm mt-1">{errors.root}</p>
        )}

        {/* Uncommment for Google and Facebook signin is fully functional*/}
        <div className="flex items-center my-4">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="px-4 text-gray-500">{t("common:OR_WITH")}</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {socialProviders.map((provider) => (
            <button
              key={provider.label}
              type="button"
              disabled={provider.disabled}
              onClick={provider.onClick}
              className={`px-4 py-2 flex items-center justify-center border border-gray-300 rounded-xl ${
                provider.disabled
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-white hover:bg-gray-50"
              }`}
            >
              {provider.icon}
              <span>{provider.label}</span>
            </button>
          ))}
        </div>

        <div className="mt-16 flex flex-row justify-center">
          <p>{t("common:NONE_ACCOUNT")}</p>
          <button
            className="mx-2 text-left underline"
            onClick={() => navigate("/signup")}
          >
            {t("common:SIGNUP")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
