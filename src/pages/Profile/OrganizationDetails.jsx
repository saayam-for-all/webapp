import React, { useState, useEffect, useRef } from "react";
import Select from "react-select";
import { useTranslation } from "react-i18next";
import PHONECODESEN from "../../utils/phone-codes-en";
import { getPhoneCodeslist } from "../../utils/utils";

const COUNTRY_CODE_API =
  "https://raw.githubusercontent.com/dr5hn/countries-states-cities-database/master/countries.json";

function OrganizationDetails({ setHasUnsavedChanges }) {
  const { t } = useTranslation();
  const [isEditing, setIsEditing] = useState(false);
  const organizationNameRef = useRef(null);

  const [errors, setErrors] = useState({});

  const [organizationInfo, setOrganizationInfo] = useState({
    organizationName: "",
    phoneNumber: "",
    phoneCountryCode: "",
    email: "",
    url: "",
    streetAddress: "",
    streetAddress2: "",
    city: "",
    state: "",
    zipCode: "",
    organizationType: t("NON_PROFIT"),
  });
  const phoneCodeOptions = getPhoneCodeslist(PHONECODESEN);

  useEffect(() => {
    fetch(COUNTRY_CODE_API)
      .then((response) => response.json())
      .then((data) => {
        const countries = data.map((country) => ({
          value: country.phone_code,
          label: `${country.name} (+${country.phone_code})`,
        }));

        const sortedCountries = countries.sort((a, b) => {
          if (a.label.includes("United States")) return -1;
          if (a.label.includes("Canada")) return -1;
          return 0;
        });

        setCountryOptions(sortedCountries);
      })
      .catch((error) => console.error("Error fetching country codes:", error));

    const savedOrganizationInfo = JSON.parse(
      localStorage.getItem("organizationInfo"),
    );
    if (savedOrganizationInfo) {
      setOrganizationInfo(savedOrganizationInfo);
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    let errorMsg = "";
    if (name == "email") {
      if (!/^[a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z]{2,}$/.test(value)) {
        errorMsg = "Please enter a valid Email Address.";
      }
    }
    if (name == "phoneNumber") {
      if (!/^\d{10}$/.test(value)) {
        errorMsg = "Please enter a valid Phone Number.";
      }
    }
    if (name == "url") {
      if (!/^https?:\/\/.+\.[a-zA-Z]{2,}$/.test(value)) {
        errorMsg = "Please enter a valid URL.";
      }
    }

    setErrors((prevErrors) => ({ ...prevErrors, [name]: errorMsg }));

    setOrganizationInfo((prevInfo) => ({
      ...prevInfo,
      [name]: value,
    }));
    setHasUnsavedChanges(true);
  };

  const handleEditClick = () => {
    setIsEditing(true);
    setTimeout(() => {
      if (organizationNameRef.current) {
        organizationNameRef.current.focus();
      }
    }, 0);
  };

  const handleSaveClick = () => {
    let hasError = false;
    Object.values(errors).forEach((error) => {
      if (error !== "") {
        hasError = true;
      }
    });
    if (hasError) {
      alert("Please fix the Errors before saving.");
      return;
    }

    setIsEditing(false);
    localStorage.setItem("organizationInfo", JSON.stringify(organizationInfo));
    setHasUnsavedChanges(false);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    setHasUnsavedChanges(false);
  };

  return (
    <div className="flex flex-col p-8 rounded-lg w-full max-w-4xl mb-8 bg-white shadow-md">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
        <div>
          <label className="block tracking-wide text-gray-700 text-xs font-bold mb-2">
            {t("ORGANIZATION_NAME")}
          </label>
          {isEditing ? (
            <input
              ref={organizationNameRef}
              type="text"
              name="organizationName"
              value={organizationInfo.organizationName}
              onChange={handleInputChange}
              className="appearance-none block w-full bg-white-200 text-gray-700 border border-gray-300 rounded py-2 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
            />
          ) : (
            <p className="text-lg text-gray-900">
              {organizationInfo.organizationName || ""}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 mb-6">
        <div>
          <label className="block tracking-wide text-gray-700 text-xs font-bold mb-2">
            {t("ORGANIZATION_TYPE")}
          </label>
          {isEditing ? (
            <div>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="organizationType"
                  value={t("NON_PROFIT")}
                  checked={
                    organizationInfo.organizationType === t("NON_PROFIT")
                  }
                  onChange={handleInputChange}
                  className="form-radio h-4 w-4 text-blue-500"
                />
                <span className="ml-2">{t("NON_PROFIT")}</span>
              </label>
              <label className="inline-flex items-center ml-6">
                <input
                  type="radio"
                  name="organizationType"
                  value={t("FOR_PROFIT")}
                  checked={
                    organizationInfo.organizationType === t("FOR_PROFIT")
                  }
                  onChange={handleInputChange}
                  className="form-radio h-4 w-4 text-blue-500"
                />
                <span className="ml-2">{t("FOR_PROFIT")}</span>
              </label>
            </div>
          ) : (
            <p className="text-lg text-gray-900">
              {organizationInfo.organizationType}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
        <div>
          <label className="block tracking-wide text-gray-700 text-xs font-bold mb-2">
            {t("PHONE_NUMBER")}
          </label>
          {isEditing ? (
            <div className="flex">
              <Select
                name="phoneCountryCode"
                value={phoneCodeOptions.find(
                  (option) => option.code === organizationInfo.phoneCountryCode,
                )}
                getOptionLabel={(option) =>
                  `${option.country} (${option.dialCode})`
                }
                getOptionValue={(option) => option.code}
                options={phoneCodeOptions}
                onChange={(selectedOption) =>
                  handleInputChange({
                    target: {
                      name: "phoneCountryCode",
                      value: selectedOption.code,
                    },
                  })
                }
                className="w-1/3 mr-2"
              />
              <input
                type="text"
                name="phoneNumber"
                value={organizationInfo.phoneNumber}
                onChange={handleInputChange}
                className="appearance-none block w-2/3 bg-white-200 text-gray-700 border border-gray-300 rounded py-2 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              />
            </div>
          ) : (
            <p className="text-lg text-gray-900">
              {organizationInfo.phoneCountryCode}{" "}
              {organizationInfo.phoneNumber || ""}
            </p>
          )}
          {errors.phoneNumber && (
            <p className="text-red-500 text-xs">{errors.phoneNumber}</p>
          )}
        </div>
        <div>
          <label className="block tracking-wide text-gray-700 text-xs font-bold mb-2">
            Email
          </label>
          {isEditing ? (
            <input
              type="email"
              name="email"
              value={organizationInfo.email}
              onChange={handleInputChange}
              className="appearance-none block w-full bg-white-200 text-gray-700 border border-gray-300 rounded py-2 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
            />
          ) : (
            <p className="text-lg text-gray-900">
              {organizationInfo.email || ""}
            </p>
          )}
          {errors.email && (
            <p className="text-red-500 text-xs">{errors.email}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 mb-6">
        <div>
          <label className="block tracking-wide text-gray-700 text-xs font-bold mb-2">
            URL
          </label>
          {isEditing ? (
            <input
              type="text"
              name="url"
              value={organizationInfo.url}
              onChange={handleInputChange}
              className="appearance-none block w-full bg-white-200 text-gray-700 border border-gray-300 rounded py-2 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
            />
          ) : (
            <p className="text-lg text-gray-900">
              {organizationInfo.url || ""}
            </p>
          )}
          {errors.url && <p className="text-red-500 text-xs">{errors.url}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
        <div>
          <label className="block tracking-wide text-gray-700 text-xs font-bold mb-2">
            {t("ADDRESS", { optional: "" })}
          </label>
          {isEditing ? (
            <input
              type="text"
              name="streetAddress"
              value={organizationInfo.streetAddress}
              onChange={handleInputChange}
              className="appearance-none block w-full bg-white-200 text-gray-700 border border-gray-300 rounded py-2 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
            />
          ) : (
            <p className="text-lg text-gray-900">
              {organizationInfo.streetAddress || ""}
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
              value={organizationInfo.streetAddress2}
              onChange={handleInputChange}
              className="appearance-none block w-full bg-white-200 text-gray-700 border border-gray-300 rounded py-2 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
            />
          ) : (
            <p className="text-lg text-gray-900">
              {organizationInfo.streetAddress2 || ""}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-6">
        <div>
          <label className="block tracking-wide text-gray-700 text-xs font-bold mb-2">
            {t("CITY")}
          </label>
          {isEditing ? (
            <input
              type="text"
              name="city"
              value={organizationInfo.city}
              onChange={handleInputChange}
              className="appearance-none block w-full bg-white-200 text-gray-700 border border-gray-300 rounded py-2 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
            />
          ) : (
            <p className="text-lg text-gray-900">
              {organizationInfo.city || ""}
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
              value={organizationInfo.state}
              onChange={handleInputChange}
              className="appearance-none block w-full bg-white-200 text-gray-700 border border-gray-300 rounded py-2 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
            />
          ) : (
            <p className="text-lg text-gray-900">
              {organizationInfo.state || ""}
            </p>
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
              value={organizationInfo.zipCode}
              onChange={handleInputChange}
              className="appearance-none block w-full bg-white-200 text-gray-700 border border-gray-300 rounded py-2 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
            />
          ) : (
            <p className="text-lg text-gray-900">
              {organizationInfo.zipCode || ""}
            </p>
          )}
        </div>
      </div>

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
              onClick={handleCancelClick}
            >
              {t("CANCEL")}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default OrganizationDetails;
