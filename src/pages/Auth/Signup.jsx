import { useState } from "react";
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { signUp } from "aws-amplify/auth";
import CountryList from "react-select-country-list";
import { z } from "zod";
import PHONECODESEN from "../../utils/phone-codes-en";
import { getPhoneCodeslist } from "../../utils/utils";
import "./Login.css";
import { useTranslation } from "react-i18next";
import { isValidPhoneNumber } from "react-phone-number-input";
import PhoneNumberInputWithCountry from "../../common/components/PhoneNumberInputWithCountry";
const signUpSchema = z.object({
  firstName: z
    .string()
    .min(1, "First name is required")
    .max(50)
    .regex(
      /^[a-zA-Z\s]+$/,
      "First name must contain only alphabets and spaces",
    ),
  lastName: z
    .string()
    .min(1, "Last name is required")
    .max(50)
    .regex(/^[a-zA-Z\s]+$/, "Last name must contain only alphabets and spaces"),
  email: z
    .string()
    .max(50)
    .min(1, "Email is required")
    .email("Invalid email address"),
  phone: z
    .string()
    .min(1, "Phone number is required")
    .regex(/^[0-9]+$/, "A valid phone number is required"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/\d/, "Password must contain at least 1 number")
    .regex(/[A-Z]/, "Password must contain at least 1 uppercase letter")
    .regex(/[a-z]/, "Password must contain at least 1 lowercase letter")
    .regex(
      /[\^$*.[\]{}()?"!@#%&/\\,><':;|_~`=+-]/,
      "Password must contain at least 1 special character",
    ),
});

const SignUp = () => {
  const { t } = useTranslation();
  const [emailValue, setEmailValue] = useState("");
  const [passwordValue, setPasswordValue] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState("United States");
  const [confirmPasswordValue, setConfirmPasswordValue] = useState("");
  const [countryCode, setCountryCode] = useState("US");
  const [acceptedTOS, setAcceptedTOS] = useState(false);

  //Password variables
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [passwordFocus, setPasswordFocus] = useState(false);
  const [confirmPasswordFocus, setConfirmPasswordFocus] = useState(false);
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [errors, setErrors] = useState({});
  const [showPasswordValidation, setShowPasswordValidation] = useState(false);
  const [phoneError, setPhoneError] = useState("");
  const [phoneEmptyError, setPhoneEmptyError] = useState("");

  const hasNumber = /\d/.test(passwordValue);
  const hasUppercase = /[A-Z]/.test(passwordValue);
  const hasLowercase = /[a-z]/.test(passwordValue);
  const hasSpecialChar = /[\^$*.[\]{}()?"!@#%&/\\,><':;|_~`=+-]/.test(
    passwordValue,
  );
  const hasMinLength = passwordValue.length >= 8;
  const allRequirementsMet =
    hasNumber && hasUppercase && hasLowercase && hasSpecialChar && hasMinLength;

  const countries = CountryList().getData();
  const navigate = useNavigate();

  //name, email and phone number validation functions
  const validateName = (name) => /^[A-Za-z\s]+$/.test(name);
  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePassword = (password) =>
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
      password,
    );

  const handleSignUp = async () => {
    try {
      setErrors({});
      setPhoneEmptyError("");
      // Always run Zod schema validation
      const result = signUpSchema.safeParse({
        firstName,
        lastName,
        email: emailValue,
        phone,
        password: passwordValue,
      });
      let newErrors = {};
      // Empty field errors
      if (!firstName) newErrors.firstName = "First name is required";
      if (!lastName) newErrors.lastName = "Last name is required";
      if (!emailValue) newErrors.email = "Email is required";
      if (!phone) setPhoneEmptyError("Phone number is required");
      if (!passwordValue) newErrors.password = "Password is required";
      if (!confirmPasswordValue)
        newErrors.confirmPassword = "Confirm password is required";
      // Zod schema errors (only if field is not empty)
      if (!result.success) {
        const formattedErrors = result.error.format();
        if (firstName && formattedErrors.firstName?._errors[0])
          newErrors.firstName = formattedErrors.firstName._errors[0];
        if (lastName && formattedErrors.lastName?._errors[0])
          newErrors.lastName = formattedErrors.lastName._errors[0];
        if (emailValue && formattedErrors.email?._errors[0])
          newErrors.email = formattedErrors.email._errors[0];
        if (passwordValue && formattedErrors.password?._errors[0])
          newErrors.password = formattedErrors.password._errors[0];
      }
      if (passwordValue !== confirmPasswordValue) {
        setPasswordsMatch(false);
        newErrors.confirmPassword = "Passwords do not match";
      }
      // Phone validity check (run before early return)
      const fullPhoneNumber = `${PHONECODESEN[countryCode]["secondary"]}${phone}`;
      if (phone && !isValidPhoneNumber(fullPhoneNumber)) {
        setPhoneError("Please enter a valid phone number");
      }
      if (
        Object.keys(newErrors).length > 0 ||
        !phone ||
        (phone && !isValidPhoneNumber(fullPhoneNumber))
      ) {
        setErrors(newErrors);
        setShowPasswordValidation(true);
        return;
      }
      setPhoneError(""); // clear only if all is valid
      const user = await signUp({
        username: emailValue,
        password: passwordValue,
        options: {
          userAttributes: {
            given_name: firstName,
            family_name: lastName,
            email: emailValue,
            phone_number: fullPhoneNumber,
            "custom:Country": country,
          },
        },
      });
      if (user && user.isSignUpComplete === false) {
        navigate("/verify-otp", { state: { email: emailValue } });
      }
    } catch (error) {
      if (error.name === "UsernameExistsException") {
        setErrors({ email: t("USER_ALREADY_EXISTS") });
      }
      console.log("Sign up error:", error);
    }
  };

  return (
    <div className="flex items-center h-full justify-center">
      <div className="px-4 py-4 flex flex-col relative w-1/2">
        <h1 className="my-4 text-3xl font-bold text-center">{t("SIGNUP")}</h1>

        <div className="my-1 flex flex-row gap-4">
          {/* First Name */}
          <div className="flex-1">
            <label htmlFor="firstName">{t("FIRST_NAME")}</label>
            <input
              id="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder={t("FIRST_NAME")}
              type="text"
              className={`w-full px-4 py-2 border rounded-xl ${errors.firstName ? "border-red-500" : "border-gray-300"}`}
              required={true}
            />
            {errors.firstName && (
              <p className="text-sm text-red-500">{errors.firstName}</p>
            )}
          </div>

          {/* Last Name */}
          <div className="flex-1">
            <label htmlFor="lastName">{t("LAST_NAME")}</label>
            <input
              id="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder={t("LAST_NAME")}
              type="text"
              className={`w-full px-4 py-2 border rounded-xl ${errors.lastName ? "border-red-500" : "border-gray-300"}`}
              required={true}
            />
            {errors.lastName && (
              <p className="text-sm text-red-500">{errors.lastName}</p>
            )}
          </div>
        </div>

        {/* Email */}
        <div className="my-1 flex flex-col">
          <label htmlFor="email">{t("EMAIL")}</label>
          <input
            id="email"
            value={emailValue}
            onChange={(e) => setEmailValue(e.target.value)}
            placeholder={t("EMAIL")}
            type="text"
            className={`px-4 py-2 border rounded-xl ${errors.email ? "border-red-500" : "border-gray-300"}`}
            required={true}
          />
          {errors.email && (
            <p className="text-sm text-red-500">{errors.email}</p>
          )}
        </div>

        {/* Phone Number */}
        <div className="my-2 flex flex-col relative">
          <PhoneNumberInputWithCountry
            phone={phone}
            setPhone={setPhone}
            countryCode={countryCode}
            setCountryCode={setCountryCode}
            setError={setPhoneError}
            error={phoneError || phoneEmptyError}
            label={t("PHONE_NUMBER")}
            required={true}
            t={t}
          />
        </div>

        {/* Password */}
        <div className="my-2 flex flex-col relative">
          <label htmlFor="password">{t("PASSWORD")}</label>
          <div
            className={`flex flex-row px-4 py-2 rounded-xl ${
              passwordFocus
                ? "border-2 border-black -m-px"
                : errors.password
                  ? "border border-red-500"
                  : "border border-gray-300"
            }`}
          >
            <input
              id="password"
              placeholder={t("PASSWORD")}
              value={passwordValue}
              type={passwordVisible ? "text" : "password"}
              onChange={(e) => {
                setPasswordValue(e.target.value);
                setShowPasswordValidation(true);
              }}
              onFocus={() => {
                setPasswordFocus(true);
                setShowPasswordValidation(true);
              }}
              onBlur={() => setPasswordFocus(false)}
              className="mr-auto w-full outline-none"
            />
            <button onClick={() => setPasswordVisible(!passwordVisible)}>
              {passwordVisible ? <IoEyeOutline /> : <IoEyeOffOutline />}
            </button>
          </div>

          {/* Password validation */}
          {((showPasswordValidation && !allRequirementsMet) ||
            errors.password) && (
            <div
              className={`flex flex-col items-start absolute left-full top-0
               ml-2 w-[clamp(200px,25vw,300px)] border border-gray-300 bg-white p-2
               rounded shadow z-[1000] whitespace-normal break-words`}
            >
              <p
                className={`${hasMinLength ? "text-sm text-green-500" : "text-sm text-red-500"}`}
              >
                Password must contain at least 8 characters.
              </p>
              <p
                className={`${hasNumber ? "text-sm text-green-500" : "text-sm text-red-500"}`}
              >
                Password must contain at least 1 number.
              </p>
              <p
                className={`${hasSpecialChar ? "text-sm text-green-500" : "text-sm text-red-500"}`}
              >
                Password must contain at least 1 special character.
              </p>
              <p
                className={`${hasUppercase ? "text-sm text-green-500" : "text-sm text-red-500"}`}
              >
                Password must contain at least 1 uppercase letter.
              </p>
              <p
                className={`${hasLowercase ? "text-sm text-green-500" : "text-sm text-red-500"}`}
              >
                Password must contain at least 1 lowercase letter.
              </p>
            </div>
          )}
        </div>

        {/* Confirm Password */}
        <div className="my-2 flex flex-col">
          <label htmlFor="confirmPassword">{t("CONFIRM_PASSWORD")}</label>
          <div
            className={`flex flex-row px-4 py-2 rounded-xl ${
              confirmPasswordFocus
                ? "border-2 border-black -m-px"
                : errors.confirmPassword
                  ? "border border-red-500"
                  : "border border-gray-300"
            }`}
          >
            <input
              id="confirmPassword"
              placeholder={t("CONFIRM_PASSWORD")}
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
          {errors.confirmPassword && (
            <p className="text-sm text-red-500 mt-1">
              {errors.confirmPassword}
            </p>
          )}
        </div>
        {/*
        <button
          className="my-4 py-2 bg-blue-400 text-white rounded-xl hover:bg-blue-500"
          onClick={handleSignUp}
        >
          Sign Up
        </button>
        */}
        <div className="mb-2 flex items-center space-x-2">
          <input
            type="checkbox"
            className="w-3.2 h-3.2"
            checked={acceptedTOS}
            onChange={(e) => setAcceptedTOS(e.target.checked)}
          />
          <label className="my-2 text-gray-700">
            By checking this box, you are agreeing to the{" "}
            <a
              href="/terms-and-conditions"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 underline"
            >
              Terms and Conditions
            </a>
            .
          </label>
        </div>
        <button
          className={`my-4 py-2 rounded-xl text-white 
    ${acceptedTOS ? "bg-blue-400 hover:bg-blue-500 cursor-pointer" : "bg-blue-400 opacity-50 cursor-not-allowed"}
  `}
          onClick={handleSignUp}
          disabled={!acceptedTOS}
        >
          Sign up
        </button>

        {/* Uncomment this snippet when the signup functionality is fully developed  */}

        {/* <div className="flex items-center my-4">
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
        </div> */}

        <div className="mt-8 flex flex-row justify-center">
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
