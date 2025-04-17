import { useEffect, useRef, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useTranslation } from "react-i18next";
import Select from "react-select";
import CountryList from "react-select-country-list";
import { changeUiLanguage } from "../../common/i18n/utils";
import PHONECODESEN from "../../utils/phone-codes-en";
import { getPhoneCodeslist } from "../../utils/utils";
import { State, Country } from "country-state-city";
import languagesData from "../../common/i18n/languagesData";


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
  const streetAddressRef = useRef(null);

  const [personalInfo, setPersonalInfo] = useState({
    dateOfBirth: null,
    gender: "",
    streetAddress: "",
    streetAddress2: "",
    country: "",
    state: "",
    zipCode: "",
    languagePreference1: "",
    languagePreference2: "",
    languagePreference3: "",
    secondaryEmail: "",
    secondaryPhone: "",
    secondaryPhoneCountryCode: "US",
  });

  const countries = CountryList().getData();
  const phoneCodeOptions = getPhoneCodeslist(PHONECODESEN);

  const [states, setStates] = useState([]);

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

  const [languages, setLanguages] = useState([]);
  const [locale, setLocale] = useState("en-US");
  const [dateFormat, setDateFormat] = useState("MM/dd/yyyy");
  const [placeholder, setPlaceholder] = useState("MM/DD/YYYY");

  useEffect(() => {
    const updateDateFormat = async () => {
      const { locale, dateFormat, placeholder } = await getLocaleAndFormat(
        personalInfo.country || "United States", // Default to "United States" if no country
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
        dateOfBirth: savedPersonalInfo.dateOfBirth
          ? new Date(savedPersonalInfo.dateOfBirth)
          : null,
      });
      // If savedInfo, need to set the State field.
      getLatestStatesList(getCountryIsoCode(savedPersonalInfo.country));
    }

    // Build languages options directly from languagesData.js (limits to the 10 available languages)
    const languageOptions = languagesData.map((lang) => ({
      // Special case: If the language is "Mandarin Chinese", convert its value to "Chinese" to match the locale mapping.
      value: lang.name === "Mandarin Chinese" ? "Chinese" : lang.name,
      label: lang.name,
    }));
    setLanguages(languageOptions);
  }, []);

  const handleInputChange = (name, value) => {
    setPersonalInfo((prevInfo) => ({
      ...prevInfo,
      [name]: value,
    }));
    setHasUnsavedChanges(true);
  };

  const handleEditClick = () => {
    setIsEditing(true);
    setTimeout(() => {
      if (streetAddressRef.current) {
        streetAddressRef.current.focus();
      }
    }, 0);
  };

  const handleSaveClick = () => {
    setIsEditing(false);
    localStorage.setItem("personalInfo", JSON.stringify(personalInfo));
    setHasUnsavedChanges(false);
    // Call changeUiLanguage to update the UI based on the first language preference.
    changeUiLanguage(personalInfo);
  };

  return (
    <div className="flex flex-col p-4 rounded-lg w-full max-w-4xl mb-8 bg-white shadow-md">
      {/* Date of Birth and Gender */}
      <div className="grid grid-cols-2 gap-8 mb-6">
        <div>
          <label className="block tracking-wide text-gray-700 text-xs font-bold mb-2">
            {t("BIRTHDAY")}
          </label>
          {isEditing ? (
            <DatePicker
              selected={personalInfo.dateOfBirth || null}
              onChange={(date) => handleInputChange("dateOfBirth", date)}
              dateFormat={dateFormat}
              placeholderText={placeholder}
              className="appearance-none block w-full bg-white-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
            />
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
            <input
              ref={streetAddressRef}
              type="text"
              name="streetAddress"
              value={personalInfo.streetAddress}
              onChange={(e) =>
                handleInputChange("streetAddress", e.target.value)
              }
              className="appearance-none block w-full bg-white-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
            />
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
      </div>

      {/* Country, State, and Zip Code */}
      <div className="grid grid-cols-3 gap-8 mb-6">
        <div>
          <label className="block tracking-wide text-gray-700 text-xs font-bold mb-2">
            {t("COUNTRY")}
          </label>
          {isEditing ? (
            <Select
              value={countries.find(
                (option) => option.label === personalInfo.country,
              )}
              options={countries}
              onChange={(selectedOption) => {
                handleInputChange("country", selectedOption?.label || "");
                // This will reset the selected State to "" otherwise it will create inconsistency if someone updates state and changes Country.
                setPersonalInfo((prevInfo) => ({
                  ...prevInfo,
                  state: "",
                }));
                getLatestStatesList(selectedOption?.value || "");
              }}
              className="w-full"
            />
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
            <Select
              value={
                states.find((option) => option.label === personalInfo.state) ||
                null
              }
              options={states}
              onChange={(selectedOption) => {
                handleInputChange("state", selectedOption?.label || "");
              }}
            />
          ) : (
            <p className="text-lg text-gray-900">{personalInfo.state || ""}</p>
          )}
        </div>
        <div>
          <label className="block tracking-wide text-gray-700 text-xs font-bold mb-2">
            {t("ZIP_CODE")}
          </label>
          {isEditing ? (
            <input
              type="text"
              name="zipCode"
              value={personalInfo.zipCode}
              onChange={(e) => handleInputChange("zipCode", e.target.value)}
              className="appearance-none block w-full bg-white-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
            />
          ) : (
            <p className="text-lg text-gray-900">
              {personalInfo.zipCode || ""}
            </p>
          )}
        </div>
      </div>

      {/* Language Preferences */}
      <div className="grid grid-cols-3 gap-8 mb-6">
        {/* Preference 1 - full list */}
        <div>
          <label className="block tracking-wide text-gray-700 text-xs font-bold mb-2">
            {t("FIRST_LANGUAGE_PREFERENCE")}
          </label>
          {isEditing ? (
            <Select
              value={languages.find(
                (option) => option.value === personalInfo.languagePreference1,
              )}
              options={languages}
              onChange={(selectedOption) =>
                handleInputChange(
                  "languagePreference1",
                  selectedOption?.value || "",
                )
              }
              className="w-full"
            />
          ) : (
            <p className="text-lg text-gray-900">
              {personalInfo.languagePreference1 || ""}
            </p>
          )}
        </div>
        {/* Preference 2 - filter out languagePreference1 */}
        <div>
          <label className="block tracking-wide text-gray-700 text-xs font-bold mb-2">
            {t("SECOND_LANGUAGE_PREFERENCE")}
          </label>
          {isEditing ? (
            <Select
              value={languages.find(
                (option) => option.value === personalInfo.languagePreference2,
              )}
              options={languages.filter(
                (option) => option.value !== personalInfo.languagePreference1,
              )}
              onChange={(selectedOption) =>
                handleInputChange(
                  "languagePreference2",
                  selectedOption?.value || "",
                )
              }
              className="w-full"
            />
          ) : (
            <p className="text-lg text-gray-900">
              {personalInfo.languagePreference2 || ""}
            </p>
          )}
        </div>
        {/* Preference 3 - filter out languagePreference1 and languagePreference2 */}
        <div>
          <label className="block tracking-wide text-gray-700 text-xs font-bold mb-2">
            {t("THIRD_LANGUAGE_PREFERENCE")}
          </label>
          {isEditing ? (
            <Select
              value={languages.find(
                (option) => option.value === personalInfo.languagePreference3,
              )}
              options={languages.filter(
                (option) =>
                  option.value !== personalInfo.languagePreference1 &&
                  option.value !== personalInfo.languagePreference2,
              )}
              onChange={(selectedOption) =>
                handleInputChange(
                  "languagePreference3",
                  selectedOption?.value || "",
                )
              }
              className="w-full"
            />
          ) : (
            <p className="text-lg text-gray-900">
              {personalInfo.languagePreference3 || ""}
            </p>
          )}
        </div>
      </div>

      {/* Secondary Email and Secondary Phone */}
      <div className="grid grid-cols-2 gap-8 mb-6">
        <div>
          <label className="block tracking-wide text-gray-700 text-xs font-bold mb-2">
            Secondary Email
          </label>
          {isEditing ? (
            <input
              type="email"
              name="secondaryEmail"
              value={personalInfo.secondaryEmail}
              onChange={(e) =>
                handleInputChange("secondaryEmail", e.target.value)
              }
              className="appearance-none block w-full bg-white-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
            />
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
            <div className="flex">
              <Select
                value={phoneCodeOptions.find(
                  (option) =>
                    option.code === personalInfo.secondaryPhoneCountryCode,
                )}
                getOptionLabel={(e) => `${e.country} (${e.dialCode})`}
                getOptionValue={(e) => e.code}
                options={phoneCodeOptions}
                onChange={(selectedOption) =>
                  handleInputChange(
                    "secondaryPhoneCountryCode",
                    selectedOption?.code || "",
                  )
                }
                className="w-full max-w-[100px] mr-2"
              />
              <input
                type="text"
                name="secondaryPhone"
                value={personalInfo.secondaryPhone}
                onChange={(e) =>
                  handleInputChange("secondaryPhone", e.target.value)
                }
                className="appearance-none block w-full bg-white-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              />
            </div>
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
              className="py-2 px-4 bg-blue-500 text-white rounded-md mr-2 hover:bg-blue-600"
              onClick={handleSaveClick}
            >
              {t("SAVE")}
            </button>
            <button
              className="py-2 px-4 bg-gray-500 text-white rounded-md hover:bg-gray-600"
              onClick={() => {
                const savedPersonalInfo = JSON.parse(
                  localStorage.getItem("personalInfo"),
                );
                if (savedPersonalInfo) {
                  setPersonalInfo({
                    ...savedPersonalInfo,
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
                    country: "",
                    state: "",
                    zipCode: "",
                    languagePreference1: "",
                    languagePreference2: "",
                    languagePreference3: "",
                    secondaryEmail: "",
                    secondaryPhone: "",
                    secondaryPhoneCountryCode: "US",
                  });
                }
                setIsEditing(false);
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
