import { useState, useEffect, useRef } from "react";
import Select from "react-select";
import { useTranslation } from "react-i18next";
import { HiChevronDown } from "react-icons/hi";
import PHONECODESEN from "../../utils/phone-codes-en";
import { getPhoneCodeslist } from "../../utils/utils";
import { getCategories } from "../../services/requestServices";
import PropTypes from "prop-types";

const COUNTRY_CODE_API =
  "https://raw.githubusercontent.com/dr5hn/countries-states-cities-database/master/countries.json";

function OrganizationDetails({ setHasUnsavedChanges }) {
  const { t, i18n } = useTranslation(["common", "profile", "categories"]);
  const [isEditing, setIsEditing] = useState(false);
  const organizationNameRef = useRef(null);
  const categoryDropdownRef = useRef(null);
  const categoryInputRef = useRef(null);

  const [errors, setErrors] = useState({});
  const [countryOptions, setCountryOptions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const [filteredCategories, setFilteredCategories] = useState([]);

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
    category: "GENERAL_CATEGORY",
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

    // Fetch categories from localStorage first, then API if not available
    const fetchCategoriesData = async () => {
      // Check localStorage first
      const storedCategories = localStorage.getItem("categories");
      if (storedCategories) {
        try {
          const validCategories = JSON.parse(storedCategories);
          setCategories(validCategories);
          return; // Exit early if we got categories from localStorage
        } catch (parseError) {
          console.warn(
            "Failed to parse categories from localStorage:",
            parseError,
          );
          // Continue to API fetch if localStorage parse fails
        }
      }

      // If not in localStorage, fetch from API
      try {
        const categoriesData = await getCategories();

        // Extract categories array from API response
        let categoriesArray;
        if (Array.isArray(categoriesData)) {
          categoriesArray = categoriesData;
        } else if (
          categoriesData &&
          Array.isArray(categoriesData.categories)
        ) {
          categoriesArray = categoriesData.categories;
        } else if (categoriesData && typeof categoriesData === "object") {
          console.log("API response structure:", Object.keys(categoriesData));
          throw new Error(
            "Invalid API response format - expected array or object with categories array",
          );
        } else {
          throw new Error("Invalid API response format - expected array");
        }

        // Filter out invalid/header entries (like cat_name, cat_id placeholders)
        const validCategories = categoriesArray.filter(
          (cat) =>
            cat.catName &&
            cat.catName !== "cat_name" &&
            cat.catId !== "cat_id" &&
            cat.catId !== "﻿cat_id" && // Handle BOM characters
            !cat.catName.toLowerCase().includes("cat_name") &&
            !cat.catId.toLowerCase().includes("cat_id"),
        );

        // Store in localStorage for future use
        localStorage.setItem("categories", JSON.stringify(validCategories));
        setCategories(validCategories);
      } catch (error) {
        console.warn(
          "Categories API failed, using static fallback:",
          error.message,
        );
        setCategories([]);
      }
    };

    fetchCategoriesData();

    const savedOrganizationInfo = JSON.parse(
      localStorage.getItem("organizationInfo"),
    );
    if (savedOrganizationInfo) {
      setOrganizationInfo({
        ...savedOrganizationInfo,
        category: savedOrganizationInfo.category || "GENERAL_CATEGORY",
      });
    }
  }, []);

  // Resolve category label function - matches HelpRequest implementation
  const resolveCategoryLabel = (selectedKeyOrText) => {
    if (!selectedKeyOrText) return "";

    // Ensure categories is an array before using array methods
    const categoriesArray = Array.isArray(categories) ? categories : [];

    // Check if matches a category catName
    const cat = categoriesArray.find(
      (c) => c.catName === selectedKeyOrText || c.catId === selectedKeyOrText,
    );
    if (cat) {
      // Try new API key first, fall back to old key mapping for backward compatibility
      const newKey = cat.catName;
      const oldKeyMap = {
        FOOD_AND_ESSENTIALS_SUPPORT: "FOOD_ESSENTIALS",
        CLOTHING_SUPPORT: "CLOTHING_AND_SUPPORT",
        HOUSING_SUPPORT: "HOUSING_ASSISTANCE",
        EDUCATION_CAREER_SUPPORT: "EDUCATION_CAREER_SUPPORT",
        HEALTHCARE_WELLNESS_SUPPORT: "HEALTHCARE_WELLBEING",
        ELDERLY_SUPPORT: "ELDERLY_COMMUNITY_SUPPORT",
        GENERAL_CATEGORY: "GENERAL",
      };

      // Try new key first
      const newKeyResult = t(`categories:REQUEST_CATEGORIES.${newKey}.LABEL`, {
        defaultValue: null,
      });
      if (newKeyResult && newKeyResult !== newKey) {
        return newKeyResult;
      }

      // Fall back to old key if new key translation doesn't exist
      const oldKey = oldKeyMap[newKey] || newKey;
      return t(`categories:REQUEST_CATEGORIES.${oldKey}.LABEL`, {
        defaultValue: cat.catName,
      });
    }

    // Check if matches a subcategory catName
    for (const c of categoriesArray) {
      const subs = c.subCategories || [];
      const match = subs.find(
        (s) => s.catName === selectedKeyOrText || s.catId === selectedKeyOrText,
      );
      if (match) {
        // Apply same fallback logic for subcategories
        const newCatKey = c.catName;
        const newSubKey = match.catName;
        const oldKeyMap = {
          FOOD_AND_ESSENTIALS_SUPPORT: "FOOD_ESSENTIALS",
          CLOTHING_SUPPORT: "CLOTHING_AND_SUPPORT",
          HOUSING_SUPPORT: "HOUSING_ASSISTANCE",
          EDUCATION_CAREER_SUPPORT: "EDUCATION_CAREER_SUPPORT",
          HEALTHCARE_WELLNESS_SUPPORT: "HEALTHCARE_WELLBEING",
          ELDERLY_SUPPORT: "ELDERLY_COMMUNITY_SUPPORT",
          GENERAL_CATEGORY: "GENERAL",
        };

        // Try new key first
        const newResult = t(
          `categories:REQUEST_CATEGORIES.${newCatKey}.SUBCATEGORIES.${newSubKey}.LABEL`,
          { defaultValue: null },
        );
        if (newResult && newResult !== newSubKey) {
          return newResult;
        }

        // Fall back to old key structure
        const oldCatKey = oldKeyMap[newCatKey] || newCatKey;
        return t(
          `categories:REQUEST_CATEGORIES.${oldCatKey}.SUBCATEGORIES.${newSubKey}.LABEL`,
          {
            defaultValue: match.catName,
          },
        );
      }
    }

    // Fallback to free text typed by user
    return selectedKeyOrText;
  };

  // Sort & filtered categories effect - matches HelpRequest
  useEffect(() => {
    if (categories && categories.length > 0) {
      const general = categories.find(
        (cat) => cat.catName === "GENERAL_CATEGORY",
      );
      const others = categories.filter(
        (cat) => cat.catName !== "GENERAL_CATEGORY",
      );
      const resolvedLabel = (cat) =>
        t(`categories:REQUEST_CATEGORIES.${cat.catName}.LABEL`, {
          defaultValue: cat.catName,
        });
      const sorted = others.sort((a, b) =>
        resolvedLabel(a).localeCompare(resolvedLabel(b), i18n.language || "en"),
      );
      if (general) sorted.push(general);
      setFilteredCategories(sorted);
    }
  }, [categories, i18n.language, t]);

  // Handle category search input - matches HelpRequest
  const handleCategorySearchInput = (e) => {
    const searchTerm = e.target.value;
    handleInputChange("category", searchTerm);

    const resolvedLabel = (cat) =>
      t(`categories:REQUEST_CATEGORIES.${cat.catName}.LABEL`, {
        defaultValue: cat.catName,
      });

    if (searchTerm.trim() === "") {
      const general = categories.find(
        (cat) => cat.catName === "GENERAL_CATEGORY",
      );
      const others = categories.filter(
        (cat) => cat.catName !== "GENERAL_CATEGORY",
      );
      const sorted = others.sort((a, b) =>
        resolvedLabel(a).localeCompare(resolvedLabel(b), i18n.language || "en"),
      );
      if (general) sorted.push(general);
      setFilteredCategories(sorted);
    } else {
      const filtered = categories.filter((category) =>
        resolvedLabel(category)
          .toLowerCase()
          .startsWith(searchTerm.toLowerCase()),
      );
      const general = filtered.find(
        (cat) => cat.catName === "GENERAL_CATEGORY",
      );
      const others = filtered.filter(
        (cat) => cat.catName !== "GENERAL_CATEGORY",
      );
      const sorted = others.sort((a, b) =>
        resolvedLabel(a).localeCompare(resolvedLabel(b), i18n.language || "en"),
      );
      if (general) sorted.push(general);
      setFilteredCategories(sorted);
    }
    setShowCategoryDropdown(true);
  };

  // Handle category click - matches HelpRequest
  const handleCategoryClick = (categoryKeyOrId) => {
    handleInputChange("category", categoryKeyOrId);
    setShowCategoryDropdown(false);
    setHoveredCategory(null);
  };

  // Handle subcategory click - matches HelpRequest
  const handleSubcategoryClick = (subcategoryId, subcategoryName) => {
    handleInputChange("category", subcategoryId);
    setShowCategoryDropdown(false);
    setHoveredCategory(null);
  };

  // Handle click outside dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        categoryDropdownRef.current &&
        !categoryDropdownRef.current.contains(event.target) &&
        categoryInputRef.current &&
        !categoryInputRef.current.contains(event.target)
      ) {
        setShowCategoryDropdown(false);
        setHoveredCategory(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
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
            {t("Category")}
          </label>
          {isEditing ? (
            <div className="relative">
              <div className="relative">
                <input
                  ref={categoryInputRef}
                  type="text"
                  value={resolveCategoryLabel(organizationInfo.category)}
                  onChange={handleCategorySearchInput}
                  onFocus={() => setShowCategoryDropdown(true)}
                  onBlur={(e) => {
                    if (
                      !categoryDropdownRef.current?.contains(e.relatedTarget)
                    ) {
                      setShowCategoryDropdown(false);
                    }
                  }}
                  className="block w-full appearance-none bg-white border border-gray-300 rounded-lg py-2 px-3 pr-8 text-gray-700 focus:outline-none focus:bg-white focus:border-gray-500"
                />
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                  <HiChevronDown className="h-5 w-5 text-gray-600" />
                </div>
              </div>
              {/* Dropdown with categories and subcategories */}
              {showCategoryDropdown && (
                <div
                  ref={categoryDropdownRef}
                  className={`absolute z-30 bg-white border mt-1 rounded shadow-lg w-full flex${
                    hoveredCategory &&
                    hoveredCategory.subCategories &&
                    hoveredCategory.subCategories.length > 0
                      ? ""
                      : " flex-col"
                  }`}
                  style={{
                    maxHeight: "240px",
                    minHeight: "120px",
                    overflow: "hidden",
                    zIndex: 30,
                    background: "#fff",
                  }}
                  tabIndex={0}
                >
                  {/* Main categories column */}
                  <div
                    className={
                      hoveredCategory &&
                      hoveredCategory.subCategories &&
                      hoveredCategory.subCategories.length > 0
                        ? "w-1/2 overflow-y-auto"
                        : "w-full overflow-y-auto"
                    }
                    style={{ maxHeight: "240px" }}
                  >
                    {filteredCategories.map((category) => {
                      const isSelected =
                        organizationInfo.category ===
                          (category.catId || category.catName);
                      return (
                        <div
                          key={category.catId}
                          className={`p-2 cursor-pointer hover:bg-gray-100 bg-white flex items-center justify-between ${
                            hoveredCategory?.catId === category.catId
                              ? "font-semibold bg-gray-50"
                              : ""
                          } ${isSelected ? "bg-blue-50" : ""}`}
                          style={{ background: "#fff" }}
                          onClick={(e) => {
                            if (
                              !category.subCategories ||
                              category.subCategories.length === 0
                            ) {
                              handleCategoryClick(
                                category.catId || category.catName,
                              );
                            }
                          }}
                          onMouseEnter={() => setHoveredCategory(category)}
                        >
                          <span
                            title={t(
                              `categories:REQUEST_CATEGORIES.${category.catName}.DESC`,
                              { defaultValue: category.catDesc },
                            )}
                          >
                            {t(
                              `categories:REQUEST_CATEGORIES.${category.catName}.LABEL`,
                              { defaultValue: category.catName },
                            )}
                          </span>
                          {category.subCategories &&
                            category.subCategories.length > 0 && (
                              <span className="ml-2 text-gray-400">&gt;</span>
                            )}
                        </div>
                      );
                    })}
                  </div>
                  {/* Subcategories column */}
                  {hoveredCategory &&
                    hoveredCategory.subCategories &&
                    hoveredCategory.subCategories.length > 0 && (
                      <>
                        <div className="w-px bg-gray-300 mx-1" style={{ minHeight: "100%" }} />
                        <div
                          className="w-1/2 overflow-y-auto"
                          style={{ maxHeight: "240px" }}
                        >
                          {hoveredCategory.subCategories.map(
                            (subcategory, index) => {
                              const isSelected =
                                organizationInfo.category ===
                                  (subcategory.catId || subcategory.catName);
                              return (
                                <div
                                  key={subcategory.catId}
                                  className={`cursor-pointer hover:bg-gray-200 p-2 bg-white${
                                    index !==
                                    hoveredCategory.subCategories.length - 1
                                      ? " border-b-0 border-t border-gray-200"
                                      : ""
                                  } ${isSelected ? "bg-blue-50" : ""}`}
                                  style={{
                                    background: "#fff",
                                    borderTop:
                                      index !== 0
                                        ? "1px solid #e5e7eb"
                                        : "none",
                                    borderBottom: "none",
                                  }}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleSubcategoryClick(
                                      subcategory.catId || subcategory.catName,
                                      subcategory.catName,
                                    );
                                  }}
                                >
                                  <span
                                    title={t(
                                      `categories:REQUEST_CATEGORIES.${hoveredCategory.catName}.SUBCATEGORIES.${subcategory.catName}.DESC`,
                                      { defaultValue: subcategory.catDesc },
                                    )}
                                  >
                                    {t(
                                      `categories:REQUEST_CATEGORIES.${hoveredCategory.catName}.SUBCATEGORIES.${subcategory.catName}.LABEL`,
                                      {
                                        defaultValue: subcategory.catName,
                                      },
                                    )}
                                  </span>
                                </div>
                              );
                            },
                          )}
                        </div>
                      </>
                    )}
                </div>
              )}
            </div>
          ) : (
            <p className="text-lg text-gray-900">
              {resolveCategoryLabel(organizationInfo.category)}
            </p>
          )}
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
                    category: "GENERAL_CATEGORY",
                  });
                } else {
                  setOrganizationInfo({
                    ...savedOrganizationInfo,
                    category: savedOrganizationInfo.category || "GENERAL_CATEGORY",
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
