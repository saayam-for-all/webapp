import { useEffect, useRef, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useTranslation } from "react-i18next";
import Select from "react-select";
import CountryList from "react-select-country-list";
import PHONECODESEN from "../../utils/phone-codes-en";
import { getPhoneCodeslist } from "../../utils/utils";
import { State, Country } from "country-state-city";
import PhoneNumberInputWithCountry from "../../common/components/PhoneNumberInputWithCountry";
import {
  validateCityName,
  isValidStreetAddress,
  verifyAddressWithOpenStreetMap,
} from "./addressValidation";

const genderOptions = [
  { value: "Female", label: "Female" },
  { value: "Male", label: "Male" },
  { value: "Non-binary", label: "Non-binary" },
  { value: "Transgender", label: "Transgender" },
  { value: "Intersex", label: "Intersex" },
  { value: "Gender-nonconforming", label: "Gender-nonconforming" },
];

export const getLocaleAndFormat = async (countryName) => {
  try {
    const response = await fetch(
      `https://restcountries.com/v3.1/name/${countryName}?fullText=true`,
    );
    const data = await response.json();

    if (data && data.length > 0) {
      const country = data[0];
      const countryCode = country.cca2;
      const primaryLanguage = country.languages
        ? Object.keys(country.languages)[0]
        : "en";

      const locale = new Intl.Locale(primaryLanguage, {
        region: countryCode,
      }).toString();

      const dateFormatter = new Intl.DateTimeFormat(locale);
      const parts = dateFormatter.formatToParts(new Date());

      const formatOrder = parts
        .filter((part) => ["day", "month", "year"].includes(part.type))
        .map((part) => {
          if (part.type === "day") return "dd";
          if (part.type === "month") return "MM";
          if (part.type === "year") return "yyyy";
          return "";
        })
        .join("/");

      return {
        locale,
        dateFormat: formatOrder,
        placeholder: formatOrder
          .replace("dd", "DD")
          .replace("MM", "MM")
          .replace("yyyy", "YYYY"),
      };
    }

    return {
      locale: "en-US",
      dateFormat: "MM/dd/yyyy",
      placeholder: "MM/DD/YYYY",
    };
  } catch (error) {
    console.error("Error fetching country data:", error);

    return {
      locale: "en-US",
      dateFormat: "MM/dd/yyyy",
      placeholder: "MM/DD/YYYY",
    };
  }
};

function PersonalInformation({ setHasUnsavedChanges }) {
  const { t } = useTranslation();

  const [isEditing, setIsEditing] = useState(false);
  const [isVerifyingAddress, setIsVerifyingAddress] = useState(false);

  const streetAddressRef = useRef(null);
  const dateOfBirthRef = useRef(null);

  const [personalInfo, setPersonalInfo] = useState({
    dateOfBirth: null,
    gender: "",
    streetAddress: "",
    streetAddress2: "",
    city: "",
    country: "",
    state: "",
    zipCode: "",
    secondaryEmail: "",
    secondaryPhone: "",
    secondaryPhoneCountryCode: "US",
  });

  const countries = CountryList().getData();
  const phoneCodeOptions = getPhoneCodeslist(PHONECODESEN);

  const [states, setStates] = useState([]);
  const [errors, setErrors] = useState({});

  const [locale, setLocale] = useState("en-US");
  const [dateFormat, setDateFormat] = useState("MM/dd/yyyy");
  const [placeholder, setPlaceholder] = useState("MM/DD/YYYY");

  const getLatestStatesList = (countryCodeSelected) => {
    if (countryCodeSelected) {
      const statesList = State.getStatesOfCountry(countryCodeSelected).map(
        (state) => ({
          value: state.isoCode,
          label: state.name,
        }),
      );

      setStates(statesList);
    } else {
      setStates([]);
    }
  };

  const getCountryIsoCode = (countryName) => {
    const country = Country.getAllCountries().find(
      (c) => c.name.toLowerCase() === countryName.toLowerCase(),
    );

    return country ? country.isoCode : null;
  };

  useEffect(() => {
    const updateDateFormat = async () => {
      const { locale, dateFormat, placeholder } = await getLocaleAndFormat(
        personalInfo.country || "United States",
      );

      console.log("Setting placeholder:", placeholder);

      setLocale(locale);
      setDateFormat(dateFormat);
      setPlaceholder(placeholder);
    };

    updateDateFormat();
  }, [personalInfo.country]);

  useEffect(() => {
    const savedPersonalInfo = JSON.parse(localStorage.getItem("personalInfo"));

    if (savedPersonalInfo) {
      setPersonalInfo({
        ...savedPersonalInfo,
        city: savedPersonalInfo.city || "",
        dateOfBirth: savedPersonalInfo.dateOfBirth
          ? new Date(savedPersonalInfo.dateOfBirth)
          : null,
      });

      getLatestStatesList(getCountryIsoCode(savedPersonalInfo.country));
    }
  }, []);

  const handleInputChange = (name, value) => {
    const updatedPersonalInfo = {
      ...personalInfo,
      [name]: value,
    };

    setPersonalInfo(updatedPersonalInfo);

    const error = validateField(name, value);

    setErrors((prevErrors) => {
      const updatedErrors = {
        ...prevErrors,
        [name]: error,
        addressVerification: "",
      };

      if (name === "state" || name === "country") {
        updatedErrors.city = validateField("city", updatedPersonalInfo.city);
      }

      return updatedErrors;
    });

    setHasUnsavedChanges(true);
  };

  const handleEditClick = () => {
    setIsEditing(true);

    setTimeout(() => {
      if (dateOfBirthRef.current) {
        dateOfBirthRef.current.setFocus
          ? dateOfBirthRef.current.setFocus()
          : dateOfBirthRef.current.focus();
      }
    }, 0);
  };

  const validateField = (name, value) => {
    let error = "";

    if (name === "streetAddress") {
      if (!value?.trim()) {
        error = t("STREET_ADDRESS_REQUIRED");
      } else if (!isValidStreetAddress(value)) {
        error = t("STREET_ADDRESS_INVALID");
      }
    }

    if (name === "city") {
      if (!value?.trim()) {
        error = t("CITY_REQUIRED");
      } else {
        const countryCode = getCountryIsoCode(personalInfo.country);
        const selectedState = states.find(
          (option) => option.label === personalInfo.state,
        );

        if (countryCode && selectedState) {
          const isValidCity = validateCityName(
            value,
            countryCode,
            selectedState.value,
          );

          if (isValidCity === false) {
            error = t("CITY_INVALID");
          }
        }
      }
    }

    if (name === "streetAddress2") {
      if (value && value.length < 5) {
        error = "Street Address 2 must be at least 5 characters long.";
      }
    }

    if (name === "dateOfBirth") {
      if (!value) {
        error = "Date of Birth is required.";
      } else if (new Date(value) > new Date()) {
        error = "Date of Birth cannot be in the future.";
      }
    }

    if (name === "country") {
      if (!value) {
        error = "Country is required.";
      }
    }

    if (name === "state") {
      if (!value) {
        error = "State is required.";
      }
    }

    if (name === "zipCode") {
      if (!value || !/^[0-9-]+$/.test(value)) {
        error = "ZIP Code is required.";
      }
    }

    return error;
  };

  const handleSaveClick = async () => {
    if (isVerifyingAddress) return;

    const newErrors = {};

    const fieldsToValidate = [
      "dateOfBirth",
      "streetAddress",
      "streetAddress2",
      "city",
      "country",
      "state",
      "zipCode",
    ];

    fieldsToValidate.forEach((field) => {
      const error = validateField(field, personalInfo[field]);

      if (error) {
        newErrors[field] = error;
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const selectedCountry = countries.find(
      (option) => option.label === personalInfo.country,
    );

    const selectedState = states.find(
      (option) => option.label === personalInfo.state,
    );

    if (!selectedCountry || !selectedState) {
      setErrors({
        ...newErrors,
        addressVerification: t("ADDRESS_VERIFICATION_FAILED"),
      });

      return;
    }

    setIsVerifyingAddress(true);
    setErrors({});

    try {
      const verification = await verifyAddressWithOpenStreetMap({
        street: personalInfo.streetAddress,
        city: personalInfo.city,
        state: selectedState.label,
        country: selectedCountry.label,
        countryCode: selectedCountry.value,
        postalCode: personalInfo.zipCode,
      });

      if (!verification.isValid) {
        const errorMessage =
          verification.reason === "unavailable"
            ? t("ADDRESS_VERIFICATION_UNAVAILABLE")
            : t("ADDRESS_MISMATCH");

        setErrors({
          addressVerification: errorMessage,
        });

        return;
      }

      localStorage.setItem("personalInfo", JSON.stringify(personalInfo));

      window.dispatchEvent(new Event("personal-info-updated"));

      setIsEditing(false);
      setHasUnsavedChanges(false);
    } catch (error) {
      console.error("Address verification failed:", error);

      setErrors({
        addressVerification: t("ADDRESS_VERIFICATION_FAILED"),
      });
    } finally {
      setIsVerifyingAddress(false);
    }
  };

  return (
    <div className="flex flex-col p-4 rounded-lg w-full max-w-4xl mb-8 bg-white shadow-md">
      {/* Date of Birth and Gender */}
      <div className="grid grid-cols-2 gap-8 mb-6">
        <div>
          <div className="flex items-center gap-1 mb-2">
            <label className="tracking-wide text-gray-700 text-xs font-bold">
              {t("BIRTHDAY")}
            </label>

            <div className="relative group cursor-pointer">
              <div className="w-4 h-4 flex items-center justify-center rounded-full bg-gray-500 text-white text-xs font-bold">
                ?
              </div>

              <div className="absolute left-5 top-0 w-52 bg-gray-700 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                We require your date of birth to confirm you're at least 21. If
                left blank, we'll assume you meet this age requirement
              </div>
            </div>
          </div>

          {isEditing ? (
            <>
              <DatePicker
                ref={dateOfBirthRef}
                selected={personalInfo.dateOfBirth || null}
                onChange={(date) => handleInputChange("dateOfBirth", date)}
                dateFormat={dateFormat}
                placeholderText={placeholder}
                className={`appearance-none block w-full bg-white-200 text-gray-700 border ${
                  errors.dateOfBirth ? "border-red-500" : "border-gray-200"
                } rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500`}
              />

              {errors.dateOfBirth && (
                <p className="text-red-500 text-xs italic">
                  {errors.dateOfBirth}
                </p>
              )}
            </>
          ) : (
            <p className="text-lg text-gray-900">
              {personalInfo.dateOfBirth ? (
                new Intl.DateTimeFormat(locale).format(personalInfo.dateOfBirth)
              ) : (
                <span className="text-gray-500">{placeholder}</span>
              )}
            </p>
          )}
        </div>

        <div>
          <label className="block tracking-wide text-gray-700 text-xs font-bold mb-2">
            {t("GENDER")}
          </label>

          {isEditing ? (
            <>
              <Select
                value={genderOptions.find(
                  (option) => option.value === personalInfo.gender,
                )}
                options={genderOptions}
                onChange={(selectedOption) =>
                  handleInputChange("gender", selectedOption?.value || "")
                }
                className="w-full"
              />

              {errors.gender && (
                <p className="text-red-500 text-xs mt-1">{errors.gender}</p>
              )}
            </>
          ) : (
            <p className="text-lg text-gray-900">{personalInfo.gender || ""}</p>
          )}
        </div>
      </div>

      {/* Street Address */}
      <div className="grid grid-cols-1 gap-8 mb-6">
        <div>
          <label className="block tracking-wide text-gray-700 text-xs font-bold mb-2">
            {t("ADDRESS", { optional: "" })}
          </label>

          {isEditing ? (
            <>
              <input
                ref={streetAddressRef}
                type="text"
                name="streetAddress"
                value={personalInfo.streetAddress}
                onChange={(e) =>
                  handleInputChange("streetAddress", e.target.value)
                }
                className={`appearance-none block w-full bg-white-200 text-gray-700 border ${
                  errors.streetAddress ? "border-red-500" : "border-gray-200"
                } rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500`}
              />

              {errors.streetAddress && (
                <p className="text-red-500 text-xs italic">
                  {errors.streetAddress}
                </p>
              )}
            </>
          ) : (
            <p className="text-lg text-gray-900">
              {personalInfo.streetAddress || ""}
            </p>
          )}
        </div>

        <div>
          <label className="block tracking-wide text-gray-700 text-xs font-bold mb-2">
            {t("ADDRESS", { optional: " 2" })}
          </label>

          {isEditing ? (
            <input
              type="text"
              name="streetAddress2"
              value={personalInfo.streetAddress2}
              onChange={(e) =>
                handleInputChange("streetAddress2", e.target.value)
              }
              className="appearance-none block w-full bg-white-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
            />
          ) : (
            <p className="text-lg text-gray-900">
              {personalInfo.streetAddress2 || ""}
            </p>
          )}
        </div>

        {/* City */}
        <div>
          <label className="block tracking-wide text-gray-700 text-xs font-bold mb-2">
            {t("CITY")}
          </label>

          {isEditing ? (
            <>
              <input
                type="text"
                name="city"
                value={personalInfo.city}
                onChange={(e) => handleInputChange("city", e.target.value)}
                className={`appearance-none block w-full bg-white-200 text-gray-700 border ${
                  errors.city ? "border-red-500" : "border-gray-200"
                } rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500`}
              />

              {errors.city && (
                <p className="text-red-500 text-xs italic">{errors.city}</p>
              )}
            </>
          ) : (
            <p className="text-lg text-gray-900">{personalInfo.city || ""}</p>
          )}
        </div>
      </div>

      {/* Country, State, and Zip Code */}
      <div className="grid grid-cols-3 gap-8 mb-6">
        <div>
          <label className="block tracking-wide text-gray-700 text-xs font-bold mb-2">
            {t("COUNTRY")}
          </label>

          {isEditing ? (
            <>
              <Select
                value={countries.find(
                  (option) => option.label === personalInfo.country,
                )}
                options={countries}
                onChange={(selectedOption) => {
                  handleInputChange("country", selectedOption?.label || "");

                  setPersonalInfo((prevInfo) => ({
                    ...prevInfo,
                    state: "",
                  }));

                  getLatestStatesList(selectedOption?.value || "");
                }}
                className={`w-full ${
                  errors.country ? "border border-red-500" : ""
                }`}
              />

              {errors.country && (
                <p className="text-red-500 text-xs italic mt-1">
                  {errors.country}
                </p>
              )}
            </>
          ) : (
            <p className="text-lg text-gray-900">
              {personalInfo.country || ""}
            </p>
          )}
        </div>

        <div>
          <label className="block tracking-wide text-gray-700 text-xs font-bold mb-2">
            {t("STATE")}
          </label>

          {isEditing ? (
            <>
              <Select
                value={
                  states.find(
                    (option) => option.label === personalInfo.state,
                  ) || null
                }
                options={states}
                onChange={(selectedOption) =>
                  handleInputChange("state", selectedOption?.label || "")
                }
              />

              {errors.state && (
                <p className="text-red-500 text-xs mt-1">{errors.state}</p>
              )}
            </>
          ) : (
            <p className="text-lg text-gray-900">{personalInfo.state || ""}</p>
          )}
        </div>

        <div>
          <label className="block tracking-wide text-gray-700 text-xs font-bold mb-2">
            {t("ZIP_CODE")}
          </label>

          {isEditing ? (
            <>
              <input
                type="text"
                name="zipCode"
                value={personalInfo.zipCode}
                onChange={(e) => handleInputChange("zipCode", e.target.value)}
                className={`appearance-none block w-full bg-white-200 text-gray-700 border ${
                  errors.zipCode ? "border-red-500" : "border-gray-200"
                } rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500`}
              />

              {errors.zipCode && (
                <p className="text-red-500 text-xs italic mt-1">
                  {errors.zipCode}
                </p>
              )}
            </>
          ) : (
            <p className="text-lg text-gray-900">
              {personalInfo.zipCode || ""}
            </p>
          )}
        </div>
      </div>

      {/* Address Verification Error */}
      {errors.addressVerification && (
        <p className="text-red-500 text-sm italic mb-4">
          {errors.addressVerification}
        </p>
      )}

      {/* Secondary Email and Secondary Phone */}
      <div className="grid grid-cols-2 gap-8 mb-6">
        <div>
          <label className="block tracking-wide text-gray-700 text-xs font-bold mb-2">
            Secondary Email
          </label>

          {isEditing ? (
            <>
              <input
                type="email"
                name="secondaryEmail"
                value={personalInfo.secondaryEmail}
                onChange={(e) =>
                  handleInputChange("secondaryEmail", e.target.value)
                }
                className="appearance-none block w-full bg-white-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              />

              {errors.secondaryEmail && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.secondaryEmail}
                </p>
              )}
            </>
          ) : (
            <p className="text-lg text-gray-900">
              {personalInfo.secondaryEmail || ""}
            </p>
          )}
        </div>

        <div>
          <label className="block tracking-wide text-gray-700 text-xs font-bold mb-2">
            Secondary Phone
          </label>

          {isEditing ? (
            <PhoneNumberInputWithCountry
              phone={personalInfo.secondaryPhone}
              setPhone={(value) => handleInputChange("secondaryPhone", value)}
              countryCode={personalInfo.secondaryPhoneCountryCode}
              setCountryCode={(value) =>
                handleInputChange("secondaryPhoneCountryCode", value)
              }
              error={errors.secondaryPhone}
              setError={(err) =>
                setErrors((prev) => ({
                  ...prev,
                  secondaryPhone: err,
                }))
              }
              label={t("Secondary Phone")}
              required={false}
              t={t}
            />
          ) : (
            <p className="text-lg text-gray-900">
              {personalInfo.secondaryPhoneCountryCode}{" "}
              {personalInfo.secondaryPhone || ""}
            </p>
          )}
        </div>
      </div>

      {/* Save/Cancel Buttons */}
      <div className="flex justify-center mt-6">
        {!isEditing ? (
          <button
            className="py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            onClick={handleEditClick}
          >
            {t("EDIT")}
          </button>
        ) : (
          <>
            <button
              className="py-2 px-4 bg-blue-500 text-white rounded-md mr-2 hover:bg-blue-600 disabled:opacity-50"
              onClick={handleSaveClick}
              disabled={isVerifyingAddress}
            >
              {isVerifyingAddress ? t("VERIFYING_ADDRESS") : t("SAVE")}
            </button>

            <button
              className="py-2 px-4 bg-gray-500 text-white rounded-md hover:bg-gray-600 disabled:opacity-50"
              disabled={isVerifyingAddress}
              onClick={() => {
                const savedPersonalInfo = JSON.parse(
                  localStorage.getItem("personalInfo"),
                );

                if (savedPersonalInfo) {
                  setPersonalInfo({
                    ...savedPersonalInfo,
                    city: savedPersonalInfo.city || "",
                    dateOfBirth: savedPersonalInfo.dateOfBirth
                      ? new Date(savedPersonalInfo.dateOfBirth)
                      : null,
                  });
                } else {
                  setPersonalInfo({
                    dateOfBirth: null,
                    gender: "",
                    streetAddress: "",
                    streetAddress2: "",
                    city: "",
                    country: "",
                    state: "",
                    zipCode: "",
                    secondaryEmail: "",
                    secondaryPhone: "",
                    secondaryPhoneCountryCode: "US",
                  });
                }

                setIsEditing(false);
                setErrors({});
                setHasUnsavedChanges(false);
              }}
            >
              {t("CANCEL")}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default PersonalInformation;
