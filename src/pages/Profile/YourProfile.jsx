import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateUserAttributes, fetchAuthSession } from "aws-amplify/auth";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import PHONECODESEN from "../../utils/phone-codes-en";
import CountryList from "react-select-country-list";
import { FiPhoneCall, FiVideo } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";

import CallModal from "./CallModal.jsx";
import { updateUserProfile } from "../../redux/features/authentication/authActions";
import LoadingIndicator from "../../common/components/Loading/Loading";

// ✅ same component + validator used by ContactUs
import PhoneNumberInputWithCountry from "../../common/components/PhoneNumberInputWithCountry";
import { isValidPhoneNumber, parsePhoneNumber } from "react-phone-number-input";

function YourProfile({ setHasUnsavedChanges }) {
  const { t } = useTranslation("profile");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [isCallModalOpen, setIsCallModalOpen] = useState(false);
  const [callType, setCallType] = useState("audio");
  const [loading, setLoading] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [pendingEmailChange, setPendingEmailChange] = useState(null);

  const [saveAttempted, setSaveAttempted] = useState(false);
  const [showEmailVerificationMessage, setShowEmailVerificationMessage] =
    useState(false);

  const firstNameRef = useRef(null);
  const countries = CountryList().getData();
  const user = useSelector((state) => state.auth.user);

  const [nameErrors, setNameErrors] = useState({ firstName: "", lastName: "" });
  const [emailError, setEmailError] = useState("");
  const [phoneError, setPhoneError] = useState("");

  const [profileInfo, setProfileInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "", // national digits (no +)
    phoneCountryCode: "US", // ISO, e.g. 'US', 'CA', 'GB', 'GG'
    country: "",
  });

  const [originalEmail, setOriginalEmail] = useState("");

  // Local state used by PhoneNumberInputWithCountry (same pattern as ContactUs)
  const [phone, setPhone] = useState(""); // digits only (widget composes E.164 with selected country)
  const [countryCode, setCountryCode] = useState("US"); // ISO

  // ---------------- helpers ----------------
  const getIsoFromCountryLabel = (label) => {
    const match = Object.entries(PHONECODESEN).find(
      ([, data]) => data.primary === label,
    );
    return match ? match[0] : null;
  };

  // Prefer zoneinfo ISO when dial code collides (fallback if parsing fails)
  const detectIsoByDial = (e164, preferredIso) => {
    if (!e164 || e164[0] !== "+") return null;
    const all = Object.entries(PHONECODESEN)
      .map(([iso, data]) => ({ iso, dial: data.secondary || data.dialCode }))
      .filter((c) => !!c.dial)
      .sort((a, b) => b.dial.length - a.dial.length);

    const matches = [];
    for (const { iso, dial } of all) {
      if (e164.startsWith(dial)) matches.push(iso);
    }
    if (matches.length === 0) return null;
    if (preferredIso && matches.includes(preferredIso)) return preferredIso;
    return matches[0];
  };

  const stripDialOnce = (input, iso) => {
    if (!input) return "";
    const raw = String(input).replace(/\s+/g, "");
    const dial =
      PHONECODESEN[iso]?.secondary || PHONECODESEN[iso]?.dialCode || "";
    if (dial && raw.startsWith(dial))
      return raw.slice(dial.length).replace(/\D/g, "");
    if (raw.startsWith("+")) return raw.replace(/^\+/, "").replace(/\D/g, "");
    return raw.replace(/\D/g, "");
  };

  const digitsOnlyMax10 = (value) =>
    (value || "").replace(/\D/g, "").slice(0, 10);
  // -----------------------------------------

  // Load user into form (derive ISO via parsing first; fallbacks if needed)
  useEffect(() => {
    if (!user) return;

    const zoneIso =
      getIsoFromCountryLabel(user.zoneinfo || "United States") || "US";

    let parsedIso = null;
    if (user.phone_number && user.phone_number.startsWith("+")) {
      try {
        const parsed = parsePhoneNumber(user.phone_number);
        if (parsed?.isValid() && parsed.country) parsedIso = parsed.country;
      } catch (_) {
        parsedIso = null;
      }
    }

    const byDial = user.phone_number
      ? detectIsoByDial(user.phone_number, zoneIso)
      : null;

    // Strict precedence: parsed → zoneinfo (if matches dial) → byDial → 'US'
    const finalIso = parsedIso || byDial || zoneIso || "US";
    const digits = digitsOnlyMax10(
      stripDialOnce(user.phone_number || "", finalIso),
    );
    const userEmail = user.email || "";

    setOriginalEmail(userEmail);
    setProfileInfo({
      firstName: user.given_name || "",
      lastName: user.family_name || "",
      email: userEmail,
      phone: digits,
      phoneCountryCode: finalIso,
      country: user.zoneinfo || "",
    });

    // keep the ContactUs-style phone component in sync
    setPhone(digits);
    setCountryCode(finalIso);

    setPhoneError("");
  }, [user]);

  // Name + email validators (unchanged)
  const validateName = (field, value, requireNonEmpty = false) => {
    const label = field === "firstName" ? "First name" : "Last name";
    const trimmed = (value || "").trim();
    let error = "";

    if (requireNonEmpty && trimmed.length === 0) {
      error = `${label} is required`;
    } else if (trimmed.length > 50) {
      error = "Maximum 50 characters allowed";
    } else if (trimmed.length > 0) {
      if (/\d/.test(trimmed)) error = "Numbers are not allowed";
      else if (/\s{2,}/.test(trimmed))
        error = "Multiple consecutive spaces are not allowed";
      else if (!/^[A-Za-z]+(?: [A-Za-z]+)*$/.test(trimmed))
        error = "Only letters and spaces are allowed";
    }

    setNameErrors((prev) => ({ ...prev, [field]: error }));
    return error === "";
  };

  const validateEmail = (value, showError = false) => {
    let error = "";
    if (value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
      if (!emailRegex.test(value)) error = "Please enter a valid email address";
    }
    if (showError) setEmailError(error);
    return error === "";
  };

  // Generic field changes (phone handled by PhoneNumberInputWithCountry)
  const handleInputChange = (name, value) => {
    if (name === "firstName" || name === "lastName") {
      let sanitized = (value || "")
        .replace(/[^A-Za-z\s]/g, "")
        .replace(/\s{2,}/g, " ")
        .replace(/^\s+/, "");
      const limitedValue = sanitized.slice(0, 50);

      setProfileInfo((prev) => ({ ...prev, [name]: limitedValue }));
      validateName(name, limitedValue);

      if (saveAttempted && limitedValue.trim()) {
        setNameErrors((prev) => ({
          ...prev,
          [name]: prev[name].includes("required") ? "" : prev[name],
        }));
      }

      if (
        saveError &&
        (saveError.includes("validation errors") ||
          saveError.includes("First name") ||
          saveError.includes("Last name"))
      ) {
        setSaveError("");
      }
    } else if (name === "email") {
      setProfileInfo((prev) => ({ ...prev, email: value }));
      if (emailError) setEmailError("");
      if (saveError && saveError.includes("email")) setSaveError("");
      if (showEmailVerificationMessage) setShowEmailVerificationMessage(false);
    } else if (name === "country") {
      const nextIso = getIsoFromCountryLabel(value);
      setProfileInfo((prev) => ({
        ...prev,
        country: value,
        // do NOT override phoneCountryCode from "country"; they're independent
      }));
      setHasUnsavedChanges(true);
      return;
    } else if (name === "phoneCountryCode") {
      // not used by UI anymore; keep safe
      setProfileInfo((prev) => ({ ...prev, phoneCountryCode: value }));
      setCountryCode(value);
    } else if (name === "phone") {
      // not used by UI anymore; keep safe
      const digits = digitsOnlyMax10(value);
      setProfileInfo((prev) => ({ ...prev, phone: digits }));
      setPhone(digits);
    } else {
      setProfileInfo((prev) => ({ ...prev, [name]: value }));
    }
    setHasUnsavedChanges(true);
  };
  const handleWhatsAppCall = () => {
    const iso = profileInfo.phoneCountryCode || "US";
    const dial = PHONECODESEN[iso]?.secondary || "";
    const digits = (profileInfo.phone || "").replace(/\D/g, "");

    if (!dial || !digits) return;

    // WhatsApp expects digits only
    const waNumber = `${dial}${digits}`.replace(/^\+/, "");

    // Opens WhatsApp app on mobile, WhatsApp Web on desktop
    window.open(`https://wa.me/${waNumber}`, "_blank", "noopener,noreferrer");
  };

  const sendEmailVerification = async (newEmail) => {
    try {
      await updateUserAttributes({ userAttributes: { email: newEmail } });
      return true;
    } catch (error) {
      console.error("Error sending email verification:", error);
      throw new Error("Failed to send verification email");
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      setSaveError("");
      setSaveAttempted(true);

      const firstOk = validateName("firstName", profileInfo.firstName, true);
      const lastOk = validateName("lastName", profileInfo.lastName, true);
      if (!firstOk || !lastOk)
        throw new Error("Please fix the highlighted name fields");

      if (!profileInfo.email.trim()) throw new Error("Email is required");
      if (!validateEmail(profileInfo.email, true))
        throw new Error("Please enter a valid email address");

      // ✅ ContactUs-style validation + strict region check
      const dial = PHONECODESEN[countryCode]?.secondary || "";
      const fullPhoneNumber = dial ? `${dial}${phone}` : phone;

      // Only validate phone if it's provided (optional for Personal Information)
      if (phone) {
        if (!fullPhoneNumber || !isValidPhoneNumber(fullPhoneNumber)) {
          setPhoneError("Please enter a valid phone number");
          setLoading(false);
          return; // stop here, no banner
        }

        // Strict: parsed region must match selected countryCode (e.g., CA vs US, GB vs GG)
        try {
          const parsed = parsePhoneNumber(fullPhoneNumber);
          if (!parsed?.isValid()) {
            setPhoneError("Please enter a valid phone number");
            setLoading(false);
            return;
          }
          if (parsed.country && parsed.country !== countryCode) {
            const wanted = PHONECODESEN[countryCode]?.primary || countryCode;
            const got = PHONECODESEN[parsed.country]?.primary || parsed.country;
            setPhoneError(
              `The number doesn't belong to ${wanted}. Detected ${got}.`,
            );
            setLoading(false);
            return; // stop here, no banner
          }
        } catch {
          setPhoneError("Please enter a valid phone number");
          setLoading(false);
          return;
        }
      }

      // Ensure we have a fresh session
      let session;
      try {
        session = await fetchAuthSession();
      } catch {
        session = null;
      }
      const isAuthed = !!(session && session.tokens && session.tokens.idToken);
      if (!isAuthed) {
        setSaveError("Your session has expired. Please sign in again.");
        setTimeout(() => {
          navigate("/login", {
            replace: true,
            state: { from: "/your-profile" },
          });
        }, 800);
        return;
      }

      // Use the same composed value ContactUs sends (E.164)
      const formattedPhone = fullPhoneNumber;

      // Keep local profile in sync so read-only shows latest immediately
      setProfileInfo((p) => ({
        ...p,
        phone: phone,
        phoneCountryCode: countryCode,
      }));

      // Email change -> OTP flow (unchanged)
      const emailChanged = profileInfo.email !== originalEmail;
      if (emailChanged) {
        setShowEmailVerificationMessage(true);
        setPendingEmailChange({
          firstName: profileInfo.firstName,
          lastName: profileInfo.lastName,
          email: profileInfo.email,
          phone: formattedPhone,
          country: profileInfo.country,
        });

        await sendEmailVerification(profileInfo.email);

        navigate("/verify-otp", {
          state: {
            email: profileInfo.email,
            isEmailUpdate: true,
            pendingProfileData: {
              firstName: profileInfo.firstName,
              lastName: profileInfo.lastName,
              email: profileInfo.email,
              phone: formattedPhone,
              country: profileInfo.country,
            },
          },
        });
        return;
      }

      // Update profile (unchanged)
      const result = await dispatch(
        updateUserProfile({
          firstName: profileInfo.firstName,
          lastName: profileInfo.lastName,
          email: profileInfo.email,
          phone: formattedPhone, // E.164
          country: profileInfo.country, // profile country (independent of phone)
          // If your backend can store it, add: phoneCountryIso: countryCode
        }),
      )
        .then((response) => response)
        .catch((error) => {
          throw error;
        });

      if (result?.success) {
        alert(t("PROFILE_UPDATE_SUCCESS"));
        setIsEditing(false);
        setHasUnsavedChanges(false);
        setSaveAttempted(false);
        setShowEmailVerificationMessage(false);
      } else {
        const msg = result?.error || t("PROFILE_UPDATE_FAILED");
        if (String(msg).toLowerCase().includes("auth")) {
          setSaveError("Your session has expired. Please sign in again.");
          setTimeout(() => {
            navigate("/login", {
              replace: true,
              state: { from: "/your-profile" },
            });
          }, 800);
        } else {
          throw new Error(msg);
        }
      }
    } catch (error) {
      console.error("Profile save error:", error);
      setSaveError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCallInitiation = (type) => {
    setCallType(type);
    setIsCallModalOpen(true);
  };

  const resetFormData = () => {
    if (user) {
      const zoneIso =
        getIsoFromCountryLabel(user.zoneinfo || "United States") || "US";

      let parsedIso = null;
      if (user.phone_number && user.phone_number.startsWith("+")) {
        try {
          const parsed = parsePhoneNumber(user.phone_number);
          if (parsed?.isValid() && parsed.country) parsedIso = parsed.country;
        } catch (_) {}
      }

      const byDial = user.phone_number
        ? detectIsoByDial(user.phone_number, zoneIso)
        : null;

      const finalIso = parsedIso || byDial || zoneIso || "US";

      setProfileInfo({
        firstName: user.given_name || "",
        lastName: user.family_name || "",
        email: user.email || "",
        phone: digitsOnlyMax10(
          stripDialOnce(user.phone_number || "", finalIso),
        ),
        phoneCountryCode: finalIso,
        country: user.zoneinfo || "",
      });

      // keep shared phone component in sync
      setPhone(
        digitsOnlyMax10(stripDialOnce(user.phone_number || "", finalIso)),
      );
      setCountryCode(finalIso);
    }
    setSaveError("");
    setPendingEmailChange(null);
    setSaveAttempted(false);
    setShowEmailVerificationMessage(false);
    setNameErrors({ firstName: "", lastName: "" });
    setEmailError("");
    setPhoneError("");
  };

  return (
    <div className="flex flex-col border p-6 rounded-lg w-full">
      {/* Name */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block tracking-wide text-gray-700 text-xs font-bold mb-2">
            {isEditing && <span className="text-red-500 mr-1">*</span>}
            {t("FIRST_NAME")}
          </label>
          {isEditing ? (
            <input
              ref={firstNameRef}
              type="text"
              value={profileInfo.firstName}
              onChange={(e) => handleInputChange("firstName", e.target.value)}
              className="block w-full bg-white text-gray-700 border border-gray-200 rounded py-3 px-4 focus:outline-none"
            />
          ) : (
            <p className="text-lg text-gray-900">{profileInfo.firstName}</p>
          )}
          {nameErrors.firstName && isEditing && (
            <p className="text-sm text-red-600 mt-1">{nameErrors.firstName}</p>
          )}
        </div>
        <div>
          <label className="block tracking-wide text-gray-700 text-xs font-bold mb-2">
            {isEditing && <span className="text-red-500 mr-1">*</span>}
            {t("LAST_NAME")}
          </label>
          {isEditing ? (
            <input
              type="text"
              value={profileInfo.lastName}
              onChange={(e) => handleInputChange("lastName", e.target.value)}
              className="block w-full bg-white text-gray-700 border border-gray-200 rounded py-3 px-4 focus:outline-none"
            />
          ) : (
            <p className="text-lg text-gray-900">{profileInfo.lastName}</p>
          )}
          {nameErrors.lastName && isEditing && (
            <p className="text-sm text-red-600 mt-1">{nameErrors.lastName}</p>
          )}
        </div>
      </div>

      {/* Email */}
      <div className="mb-6">
        <label className="block tracking-wide text-gray-700 text-xs font-bold mb-2">
          {isEditing && <span className="text-red-500 mr-1">*</span>}
          {t("EMAIL")}
        </label>
        {isEditing ? (
          <div>
            <input
              type="email"
              value={profileInfo.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              className={`block w-full bg-white text-gray-700 border ${
                emailError ? "border-red-500" : "border-gray-200"
              } rounded py-3 px-4 focus:outline-none`}
            />
            {emailError && (
              <p className="text-sm text-red-600 mt-1">{emailError}</p>
            )}
            {showEmailVerificationMessage &&
              profileInfo.email !== originalEmail &&
              !emailError && (
                <p className="text-sm text-orange-600 mt-1">
                  {t(
                    "EMAIL_VERIFICATION_REQUIRED",
                    "Email verification will be required for this change",
                  )}
                </p>
              )}
          </div>
        ) : (
          <p className="text-lg text-gray-900">{profileInfo.email}</p>
        )}
      </div>

      {/* Phone Number */}
      <div className="mb-6">
        <label className="block tracking-wide text-gray-700 text-xs font-bold mb-2">
          {t("PHONE_NUMBER")}
        </label>
        <div className="flex items-center gap-2">
          {isEditing ? (
            <PhoneNumberInputWithCountry
              phone={phone}
              setPhone={(v) => {
                setPhone(v);
                setProfileInfo((p) => ({ ...p, phone: v }));
                setHasUnsavedChanges(true);
                if (phoneError) setPhoneError("");
              }}
              countryCode={countryCode}
              setCountryCode={(iso) => {
                setCountryCode(iso);
                setProfileInfo((p) => ({ ...p, phoneCountryCode: iso }));
                setHasUnsavedChanges(true);
                if (phoneError) setPhoneError("");
              }}
              error={phoneError}
              setError={setPhoneError}
              required={false}
              t={t}
              hideLabel={true}
            />
          ) : (
            <>
              {/* show only +dial and digits to avoid “UK vs Guernsey” wording confusion */}
              <p className="text-lg text-gray-900">
                <span className="mr-2">
                  {PHONECODESEN[profileInfo.phoneCountryCode]?.secondary || ""}
                </span>
                <span>{profileInfo.phone}</span>
              </p>

              <FiPhoneCall
                size={22}
                className="text-gray-500 cursor-pointer hover:text-gray-700 ml-3"
              />

              <FiVideo
                size={22}
                className="text-gray-500 cursor-pointer hover:text-gray-700 ml-3"
              />
              {profileInfo.phone && (
                <FaWhatsapp
                  size={22}
                  className="text-green-600 cursor-pointer hover:opacity-80 ml-3"
                  title="WhatsApp"
                  onClick={handleWhatsAppCall}
                />
              )}
            </>
          )}
        </div>
        {/* Phone error is rendered by the PhoneNumberInputWithCountry when editing */}
      </div>

      {/* Country */}
      <div className="mb-6">
        <label className="block tracking-wide text-gray-700 text-xs font-bold mb-2">
          {isEditing && <span className="text-red-500 mr-1">*</span>}
          {t("COUNTRY")}
        </label>
        {isEditing ? (
          <select
            value={profileInfo.country}
            onChange={(e) => handleInputChange("country", e.target.value)}
            className="block w-full bg-white text-gray-700 border border-gray-200 rounded py-3 px-4 focus:outline-none"
          >
            <option value="United States">United States</option>
          </select>
        ) : (
          <p className="text-lg text-gray-900">{profileInfo.country}</p>
        )}
      </div>

      {/* Error Message (kept for non-phone errors) */}
      {saveError && (
        <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
          {saveError}
        </div>
      )}

      {/* Buttons */}
      <div className="flex justify-center mt-6">
        {!isEditing ? (
          <button
            className="py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            onClick={() => {
              // ensure the edit component starts with clean digits & ISO
              setProfileInfo((prev) => ({
                ...prev,
                phone: digitsOnlyMax10(
                  stripDialOnce(
                    user?.phone_number || "",
                    prev.phoneCountryCode,
                  ),
                ),
              }));
              setPhoneError("");
              setPhone(
                digitsOnlyMax10(
                  stripDialOnce(
                    user?.phone_number || "",
                    profileInfo.phoneCountryCode,
                  ),
                ),
              );
              setCountryCode(profileInfo.phoneCountryCode || "US");
              setIsEditing(true);
              setTimeout(() => {
                if (firstNameRef.current) firstNameRef.current.focus();
              }, 0);
            }}
          >
            {t("EDIT")}
          </button>
        ) : (
          <>
            <button
              className="py-2 px-4 bg-blue-500 text-white rounded-md mr-2 hover:bg-blue-600 flex items-center justify-center"
              onClick={handleSave}
              disabled={loading}
            >
              {loading ? (
                <>
                  <LoadingIndicator size="20px" className="mr-2" />
                  {t("SAVING")}
                </>
              ) : (
                t("SAVE")
              )}
            </button>
            <button
              className="py-2 px-4 bg-gray-500 text-white rounded-md hover:bg-gray-600"
              onClick={() => {
                setIsEditing(false);
                setHasUnsavedChanges(false);
                resetFormData();
              }}
              disabled={loading}
            >
              {t("CANCEL")}
            </button>
          </>
        )}
      </div>

      {/* Call Modal */}
      <CallModal
        isOpen={isCallModalOpen}
        onClose={() => setIsCallModalOpen(false)}
        callType={callType}
      />
    </div>
  );
}

export default YourProfile;
