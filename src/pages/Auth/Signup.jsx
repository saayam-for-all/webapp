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

  const handleSignUp = async () => {
    setErrors({ root: "Signup is currently disabled." });
    return;
  };

  return (
    <div className="flex items-center h-full justify-center">
      <div className="px-4 py-4 flex flex-col relative w-1/2">
        <h1 className="my-4 text-3xl font-bold text-center">{t("SIGNUP")}</h1>

        <p className="mb-3 text-sm text-gray-600">
          <span className="text-red-500">*</span> All fields are mandatory
        </p>

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

        {/* rest of your code remains same */}
      </div>
    </div>
  );
};

export default SignUp;
