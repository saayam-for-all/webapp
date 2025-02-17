import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
import { FaFacebookF } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { signIn } from "aws-amplify/auth";
import { checkAuthStatus } from "../../redux/features/authentication/authActions";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().min(1, "Please enter your email"),
  password: z.string().min(1, "Please enter your password"),
});

const LoginPage = () => {
  const { t } = useTranslation();

  const [emailValue, setEmailValue] = useState("");
  const [passwordValue, setPasswordValue] = useState("");

  const [passwordVisible, setPasswordVisible] = useState(false);
  const [passwordFocus, setPasswordFocus] = useState(false);

  const [errors, setErrors] = useState({});

  const { user } = useSelector((state) => state.auth);

  const navigate = useNavigate();
  const dispatch = useDispatch();

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
        dispatch(checkAuthStatus());
        navigate("/dashboard");
      }
    } catch (error) {
      console.log("error", error);
      setErrors({ root: "Invalid email or password" });
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
            placeholder="Your Email"
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
              required={true}
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
          className="my-4 py-2 bg-blue-400 text-white rounded-xl hover:bg-blue-500"
          onClick={handleSignIn}
        >
          {t("LOGIN")}
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
