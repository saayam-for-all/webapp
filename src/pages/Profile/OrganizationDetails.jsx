import { useState, useEffect, useRef } from "react";
import Select from "react-select";
import { useTranslation } from "react-i18next";
import { HiChevronDown } from "react-icons/hi";
import PHONECODESEN from "../../utils/phone-codes-en";
import { getPhoneCodeslist } from "../../utils/utils";
import PropTypes from "prop-types";

const COUNTRY_CODE_API =
  "https://raw.githubusercontent.com/dr5hn/countries-states-cities-database/master/countries.json";

// Mapping from API category keys to translation keys
const CATEGORY_KEY_MAP = {
  FOOD_AND_ESSENTIALS_SUPPORT: "FOOD_AND_ESSENTIALS",
  CLOTHING_SUPPORT: "CLOTHING_ASSISTANCE",
  HOUSING_SUPPORT: "HOUSING_ASSISTANCE",
  EDUCATION_CAREER_SUPPORT: "EDUCATION_CAREER_SUPPORT",
  HEALTHCARE_WELLNESS_SUPPORT: "HEALTHCARE_AND_WELLNESS",
  ELDERLY_SUPPORT: "ELDERLY_COMMUNITY_ASSISTANCE",
  GENERAL_CATEGORY: "GENERAL_CATEGORY",
};

function OrganizationDetails({ setHasUnsavedChanges }) {
  const { t } = useTranslation(["profile", "categories"]);
  const [isEditing, setIsEditing] = useState(false);
  const organizationNameRef = useRef(null);
  const [categories, setCategories] = useState([]);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const categoryDropdownRef = useRef(null);

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
    helpCategories: [],
  });
  const phoneCodeOptions = getPhoneCodeslist(PHONECODESEN);

  // Helper function to get translated category label
  const getCategoryLabel = (catName, parentCatName = null) => {
    // Get the translation key (map API key to translation key if needed)
    const translationKey = CATEGORY_KEY_MAP[catName] || catName;
    const parentKey = parentCatName
      ? CATEGORY_KEY_MAP[parentCatName] || parentCatName
      : null;

    let translatedLabel;
    if (parentKey) {
      // This is a subcategory
      translatedLabel = t(
        `categories:REQUEST_CATEGORIES.${parentKey}.SUBCATEGORIES.${translationKey}.LABEL`,
        { defaultValue: "" },
      );
    } else {
      // This is a main category
      translatedLabel = t(
        `categories:REQUEST_CATEGORIES.${translationKey}.LABEL`,
        { defaultValue: "" },
      );
    }

    // If translation found and not empty, return it
    if (translatedLabel && !translatedLabel.includes("REQUEST_CATEGORIES")) {
      return translatedLabel;
    }

    // Fallback: format the catName to be more readable
    return catName
      .replace(/_/g, " ")
      .toLowerCase()
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  // Toggle category selection (for multi-select)
  const toggleCategorySelection = (catName) => {
    const currentSelection = organizationInfo.helpCategories || [];
    const isSelected = currentSelection.includes(catName);
    const newSelection = isSelected
      ? currentSelection.filter((c) => c !== catName)
      : [...currentSelection, catName];
    handleInputChange("helpCategories", newSelection);
  };

  // Check if a category is selected
  const isCategorySelected = (catName) => {
    return (organizationInfo.helpCategories || []).includes(catName);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        categoryDropdownRef.current &&
        !categoryDropdownRef.current.contains(event.target)
      ) {
        setShowCategoryDropdown(false);
        setHoveredCategory(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    // Load categories from localStorage (stored after user login)
    const storedCategories = localStorage.getItem("categories");
    if (storedCategories) {
      try {
        const parsedCategories = JSON.parse(storedCategories);
        if (Array.isArray(parsedCategories)) {
          setCategories(parsedCategories);
        }
      } catch (error) {
        console.warn("Failed to parse categories from localStorage:", error);
      }
    }

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
      setOrganizationInfo({
        ...savedOrganizationInfo,
        helpCategories: savedOrganizationInfo.helpCategories || [],
      });
    }
  }, []);

  const validateField = (name, value) => {
    let error = "";

    if (name === "organizationName") {
      if (!value.trim()) {
        error = "Organization Name is required.";
      }
    }

    if (name === "email") {
      if (!/^[a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z]{2,}$/.test(value)) {
        error = "Please enter a valid Email Address.";
      }
    }
    if (name === "phoneNumber") {
      if (!/^\d{10}$/.test(value)) {
        error = "Please enter a valid Phone Number.";
      }
    }

    if (name === "streetAddress") {
      if (!value) {
        error = "Street Address is required.";
      } else if (value.length < 5) {
        error = "Street Address must be at least 5 characters long.";
      }
    }

    if (name === "city") {
      if (!value) {
        error = "City is required.";
      }
    }

    if (name === "state") {
      if (!value) {
        error = "State is required.";
      }
    }

    if (name === "zipCode") {
      if (!value && !/^[0-9-]+$/.test(value)) {
        error = "ZIP Code is required.";
      } else if (value.length < 5) {
        error = "ZIP Code must be at least 5 characters long.";
      }
    }
    return error;
  };

  const handleInputChange = (name, value) => {
    const error = validateField(name, value);
    setErrors({ ...errors, [name]: error });
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
    const newErrors = {};
    const fieldsToValidate = [
      "organizationName",
      "phoneNumber",
      "phoneCountryCode",
      "email",
      "streetAddress",
      "city",
      "state",
      "zipCode",
    ];

    fieldsToValidate.forEach((field) => {
      const error = validateField(field, organizationInfo[field]);
      if (error) {
        newErrors[field] = error;
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return; // Prevent saving if there are errors
    }

    setIsEditing(false);
    localStorage.setItem("organizationInfo", JSON.stringify(organizationInfo));
    window.dispatchEvent(new Event("organization-info-updated"));
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
              onChange={(e) =>
                handleInputChange("organizationName", e.target.value)
              }
              className="appearance-none block w-full bg-white-200 text-gray-700 border border-gray-300 rounded py-2 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
            />
          ) : (
            <p className="text-lg text-gray-900">
              {organizationInfo.organizationName || ""}
            </p>
          )}
          {errors.organizationName && (
            <p className="text-red-500 text-xs">{errors.organizationName}</p>
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
                  onChange={(e) =>
                    handleInputChange(
                      "organizationType",
                      e.target.value || t("NON_PROFIT"),
                    )
                  }
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
                  onChange={(e) =>
                    handleInputChange(
                      "organizationType",
                      e.target.value || t("FOR_PROFIT"),
                    )
                  }
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
                onChange={(e) => {
                  const onlyDigits = e.target.value.replace(/\D/g, "");
                  handleInputChange("phoneNumber", onlyDigits);
                }}
                maxLength={10}
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
            {t("EMAIL")}
          </label>
          {isEditing ? (
            <input
              type="email"
              name="email"
              value={organizationInfo.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
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
            {t("URL")}
          </label>
          {isEditing ? (
            <input
              type="text"
              name="url"
              value={organizationInfo.url}
              onChange={(e) => handleInputChange("url", e.target.value)}
              className="appearance-none block w-full bg-white-200 text-gray-700 border border-gray-300 rounded py-2 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
            />
          ) : (
            <p className="text-lg text-gray-900">
              {organizationInfo.url || ""}
            </p>
          )}
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
              onChange={(e) =>
                handleInputChange("streetAddress", e.target.value)
              }
              className="appearance-none block w-full bg-white-200 text-gray-700 border border-gray-300 rounded py-2 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
            />
          ) : (
            <p className="text-lg text-gray-900">
              {organizationInfo.streetAddress || ""}
            </p>
          )}
          {errors.streetAddress && (
            <p className="text-red-500 text-xs">{errors.streetAddress}</p>
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
              onChange={(e) =>
                handleInputChange("streetAddress2", e.target.value)
              }
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
              onChange={(e) => handleInputChange("city", e.target.value)}
              className="appearance-none block w-full bg-white-200 text-gray-700 border border-gray-300 rounded py-2 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
            />
          ) : (
            <p className="text-lg text-gray-900">
              {organizationInfo.city || ""}
            </p>
          )}
          {errors.city && <p className="text-red-500 text-xs">{errors.city}</p>}
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
              onChange={(e) => handleInputChange("state", e.target.value)}
              className="appearance-none block w-full bg-white-200 text-gray-700 border border-gray-300 rounded py-2 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
            />
          ) : (
            <p className="text-lg text-gray-900">
              {organizationInfo.state || ""}
            </p>
          )}
          {errors.state && (
            <p className="text-red-500 text-xs">{errors.state}</p>
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
              onChange={(e) => {
                const onlyDigits = e.target.value
                  .replace(/\D/g, "")
                  .slice(0, 10);
                handleInputChange("zipCode", onlyDigits);
              }}
              className="appearance-none block w-full bg-white-200 text-gray-700 border border-gray-300 rounded py-2 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
            />
          ) : (
            <p className="text-lg text-gray-900">
              {organizationInfo.zipCode || ""}
            </p>
          )}
          {errors.zipCode && (
            <p className="text-red-500 text-xs">{errors.zipCode}</p>
          )}
        </div>
      </div>

      {/* Help Categories Dropdown */}
      <div className="grid grid-cols-1 gap-8 mb-6">
        <div>
          <label className="block tracking-wide text-gray-700 text-xs font-bold mb-2">
            {t("HELP_CATEGORIES")}
          </label>
          {isEditing ? (
            <div className="relative" ref={categoryDropdownRef}>
              {/* Selected categories display / trigger */}
              <div
                className="appearance-none block w-full bg-white text-gray-700 border border-gray-300 rounded py-2 px-4 leading-tight focus:outline-none focus:border-gray-500 cursor-pointer flex items-center justify-between min-h-[42px]"
                onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
              >
                <div className="flex flex-wrap gap-1">
                  {organizationInfo.helpCategories.length > 0 ? (
                    organizationInfo.helpCategories.map((catName) => {
                      // Find parent category for subcategories
                      let parentCatName = null;
                      for (const cat of categories) {
                        if (
                          cat.subCategories?.some(
                            (sub) => sub.catName === catName,
                          )
                        ) {
                          parentCatName = cat.catName;
                          break;
                        }
                      }
                      return (
                        <span
                          key={catName}
                          className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                        >
                          {getCategoryLabel(catName, parentCatName)}
                        </span>
                      );
                    })
                  ) : (
                    <span className="text-gray-400">
                      {t("SELECT_HELP_CATEGORIES")}
                    </span>
                  )}
                </div>
                <HiChevronDown className="h-5 w-5 text-gray-600 flex-shrink-0" />
              </div>

              {/* Two-column dropdown */}
              {showCategoryDropdown && (
                <div
                  className="absolute z-30 bg-white border mt-1 rounded shadow-lg w-full flex"
                  style={{
                    maxHeight: "280px",
                    minHeight: "120px",
                    overflow: "hidden",
                  }}
                >
                  {/* Main categories column */}
                  <div
                    className={
                      hoveredCategory?.subCategories?.length > 0
                        ? "w-1/2 overflow-y-auto border-r"
                        : "w-full overflow-y-auto"
                    }
                    style={{ maxHeight: "280px" }}
                  >
                    {categories.map((category) => (
                      <div
                        key={category.catId}
                        className={`p-2 cursor-pointer hover:bg-gray-100 flex items-center justify-between ${
                          hoveredCategory?.catId === category.catId
                            ? "bg-gray-50 font-semibold"
                            : ""
                        }`}
                        onMouseEnter={() => setHoveredCategory(category)}
                        onClick={() => {
                          if (
                            !category.subCategories ||
                            category.subCategories.length === 0
                          ) {
                            toggleCategorySelection(category.catName);
                          }
                        }}
                      >
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            checked={isCategorySelected(category.catName)}
                            onChange={() =>
                              toggleCategorySelection(category.catName)
                            }
                            onClick={(e) => e.stopPropagation()}
                            className="mr-2 h-4 w-4"
                          />
                          <span
                            title={t(
                              `categories:REQUEST_CATEGORIES.${CATEGORY_KEY_MAP[category.catName] || category.catName}.DESC`,
                              { defaultValue: category.catDesc },
                            )}
                          >
                            {getCategoryLabel(category.catName)}
                          </span>
                        </div>
                        {category.subCategories?.length > 0 && (
                          <span className="text-gray-400">&gt;</span>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Subcategories column */}
                  {hoveredCategory?.subCategories?.length > 0 && (
                    <div
                      className="w-1/2 overflow-y-auto bg-gray-50"
                      style={{ maxHeight: "280px" }}
                    >
                      {hoveredCategory.subCategories.map((subcategory) => (
                        <div
                          key={subcategory.catId}
                          className="p-2 cursor-pointer hover:bg-gray-200 flex items-center"
                          onClick={() =>
                            toggleCategorySelection(subcategory.catName)
                          }
                        >
                          <input
                            type="checkbox"
                            checked={isCategorySelected(subcategory.catName)}
                            onChange={() =>
                              toggleCategorySelection(subcategory.catName)
                            }
                            onClick={(e) => e.stopPropagation()}
                            className="mr-2 h-4 w-4"
                          />
                          <span
                            title={t(
                              `categories:REQUEST_CATEGORIES.${CATEGORY_KEY_MAP[hoveredCategory.catName] || hoveredCategory.catName}.SUBCATEGORIES.${subcategory.catName}.DESC`,
                              { defaultValue: subcategory.catDesc },
                            )}
                          >
                            {getCategoryLabel(
                              subcategory.catName,
                              hoveredCategory.catName,
                            )}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <p className="text-lg text-gray-900">
              {organizationInfo.helpCategories.length > 0
                ? organizationInfo.helpCategories
                    .map((catName) => {
                      // Find parent category for subcategories
                      let parentCatName = null;
                      for (const cat of categories) {
                        if (
                          cat.subCategories?.some(
                            (sub) => sub.catName === catName,
                          )
                        ) {
                          parentCatName = cat.catName;
                          break;
                        }
                      }
                      return getCategoryLabel(catName, parentCatName);
                    })
                    .join(", ")
                : ""}
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
              onClick={() => {
                const savedOrganizationInfo = JSON.parse(
                  localStorage.getItem("organizationInfo"),
                );
                if (!savedOrganizationInfo) {
                  setOrganizationInfo({
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
                    helpCategories: [],
                  });
                } else {
                  setOrganizationInfo({
                    ...savedOrganizationInfo,
                    helpCategories: savedOrganizationInfo.helpCategories || [],
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

export default OrganizationDetails;

OrganizationDetails.propTypes = {
  setHasUnsavedChanges: PropTypes.func.isRequired,
};
