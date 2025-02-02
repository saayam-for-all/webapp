import React, { useState, useEffect, useRef } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Select from "react-select";
import { useTranslation } from "react-i18next";
import PHONECODESEN from "../../utils/phone-codes-en";
import { getPhoneCodeslist } from "../../utils/utils";
import { changeUiLanguage } from "../../common/i18n/utils";
import CountryList from "react-select-country-list";

const genderOptions = [
  { value: "Female", label: "Female" },
  { value: "Male", label: "Male" },
  { value: "Non-binary", label: "Non-binary" },
  { value: "Transgender", label: "Transgender" },
  { value: "Intersex", label: "Intersex" },
  { value: "Gender-nonconforming", label: "Gender-nonconforming" },
];

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

  const [languages, setLanguages] = useState([]);

  useEffect(() => {
    const savedPersonalInfo = JSON.parse(localStorage.getItem("personalInfo"));
    if (savedPersonalInfo) {
      setPersonalInfo({
        ...savedPersonalInfo,
        dateOfBirth: savedPersonalInfo.dateOfBirth
          ? new Date(savedPersonalInfo.dateOfBirth)
          : null,
      });
    }

    fetch("https://restcountries.com/v3.1/all")
      .then((response) => response.json())
      .then((data) => {
        const languageSet = new Set();
        data.forEach((country) => {
          if (country.languages) {
            Object.values(country.languages).forEach((language) =>
              languageSet.add(language),
            );
          }
        });
        setLanguages(
          Array.from(languageSet).map((lang) => ({ value: lang, label: lang })),
        );
      });
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
              selected={personalInfo.dateOfBirth}
              onChange={(date) => handleInputChange("dateOfBirth", date)}
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
            />
          ) : (
            <p className="text-lg text-gray-900">
              {personalInfo.dateOfBirth
                ? personalInfo.dateOfBirth.toLocaleDateString()
                : ""}
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
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
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
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
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
              onChange={(selectedOption) =>
                handleInputChange("country", selectedOption?.label || "")
              }
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
            <input
              type="text"
              name="state"
              value={personalInfo.state}
              onChange={(e) => handleInputChange("state", e.target.value)}
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
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
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
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
        <div>
          <label className="block tracking-wide text-gray-700 text-xs font-bold mb-2">
            {t("LANGUAGE_PREFERENCE", { optional: "First" })}
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
        <div>
          <label className="block tracking-wide text-gray-700 text-xs font-bold mb-2">
            {t("LANGUAGE_PREFERENCE", { optional: "Second" })}
          </label>
          {isEditing ? (
            <Select
              value={languages.find(
                (option) => option.value === personalInfo.languagePreference2,
              )}
              options={languages}
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
        <div>
          <label className="block tracking-wide text-gray-700 text-xs font-bold mb-2">
            {t("LANGUAGE_PREFERENCE", { optional: "Third" })}
          </label>
          {isEditing ? (
            <Select
              value={languages.find(
                (option) => option.value === personalInfo.languagePreference3,
              )}
              options={languages}
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
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
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
                    option.value === personalInfo.secondaryPhoneCountryCode,
                )}
                options={phoneCodeOptions}
                onChange={(selectedOption) =>
                  handleInputChange(
                    "secondaryPhoneCountryCode",
                    selectedOption?.value || "",
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
                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
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
            Edit
          </button>
        ) : (
          <>
            <button
              className="py-2 px-4 bg-blue-500 text-white rounded-md mr-2 hover:bg-blue-600"
              onClick={() => {
                setIsEditing(false);
                localStorage.setItem(
                  "personalInfo",
                  JSON.stringify(personalInfo),
                );
                setHasUnsavedChanges(false);
                changeUiLanguage(personalInfo);
              }}
            >
              Save
            </button>
            <button
              className="py-2 px-4 bg-gray-500 text-white rounded-md hover:bg-gray-600"
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default PersonalInformation;
