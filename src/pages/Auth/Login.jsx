import { signIn } from "aws-amplify/auth";
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

const LoginPage = () => {
  const { t } = useTranslation();
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
    email: z.string().min(1, { message: t("EMAIL_REQUIRED") }),
    password: z.string().min(1, { message: t("PASSWORD_REQUIRED") }),
  });

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user]);

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

      const { isSignedIn } = await signIn({
        username: emailValue,
        password: passwordValue,
      });
      if (isSignedIn) {
        await dispatch(checkAuthStatus());
        const newExpiry = Date.now() + INACTIVITY_TIMEOUT;
        localStorage.setItem("expireTime", newExpiry.toString());
        navigate("/dashboard");
      }
    } catch (error) {
      console.log("error", error);
      setErrors({ root: t("INVALID_CREDENTIALS") });
    }
  };

  return (
    <div className="flex items-center h-full justify-center">
      <div className="px-4 py-4 flex flex-col relative w-1/2">
        <h1 className="my-4 text-3xl font-bold text-center">{t("LOGIN")}</h1>
        <div className="my-2 flex flex-col">
          <label htmlFor="email">{t("EMAIL")}</label>
          <input
            id="email"
            value={emailValue}
            onChange={(e) => setEmailValue(e.target.value)}
            placeholder={t("Email")}
            type="text"
            className="px-4 py-2 border border-gray-300 rounded-xl"
            required={true}
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
          )}
        </div>
        <div className="my-2 flex flex-col">
          <label htmlFor="password">{t("PASSWORD")}</label>
          <div
            className={`flex flex-row px-4 py-2 rounded-xl ${
              passwordFocus
                ? "border-2 border-black -m-px"
                : " border border-gray-300"
            }`}
          >
            <input
              id="password"
              placeholder={t("Password")}
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
          {t("FORGOT_PASSWORD")}
        </button>
        <button
          disabled={loading}
          className="my-4 py-2 bg-blue-400 text-white rounded-xl hover:bg-blue-500"
          onClick={handleSignIn}
        >
          <div className="flex items-center justify-center">
            <span className={loading ? "mr-2" : ""}>{t("LOGIN")}</span>
            {loading && <LoadingIndicator size="24px" />}
          </div>
        </button>
        {errors.root && (
          <p className="text-red-500 text-sm mt-1">{errors.root}</p>
        )}

        {/* Uncommment for Google and Facebook signin is fully functional*/}
        {/* <div className="flex items-center my-4">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="px-4 text-gray-500">{t("OR_WITH")}</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div> 

         <div className="flex flex-row items-center">
          <button className="mr-2 px-4 py-2 w-1/2 flex items-center justify-center border border-gray-300 rounded-xl">
            <FaFacebookF className="mx-2 text-xl text-blue-800" />
            <span>{t("FACEBOOK")}</span>
          </button>

          <button className="ml-2 px-4 py-2 w-1/2 flex items-center justify-center border border-gray-300 rounded-xl">
            <FcGoogle className="mx-2 text-xl" />
            <span>{t("GOOGLE")}</span>
          </button>
        </div> */}

        <div className="mt-16 flex flex-row justify-center">
          <p>{t("NONE_ACCOUNT")}</p>
          <button
            className="mx-2 text-left underline"
            onClick={() => navigate("/signup")}
          >
            {t("SIGNUP")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
