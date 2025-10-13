import { StandaloneSearchBox } from "@react-google-maps/api";
import { useEffect, useRef, useState } from "react"; //added for testing
import { useTranslation } from "react-i18next";
import { IoMdInformationCircle } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Don't forget to import the CSS
import Modal from "../../common/components/Modal/Modal";
import { loadCategories } from "../../redux/features/help_request/requestActions";
import {
  useAddRequestMutation,
  useGetAllRequestQuery,
} from "../../services/requestApi";
import {
  checkProfanity,
  createRequest,
  predictCategories,
  getCategories,
} from "../../services/requestServices";
import HousingCategory from "./Categories/HousingCategory";
import JobsCategory from "./Categories/JobCategory";
import usePlacesSearchBox from "./location/usePlacesSearchBox";
import { HiChevronDown } from "react-icons/hi";
import languagesData from "../../common/i18n/languagesData";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Typography,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Snackbar,
  Alert,
  RadioGroup,
  Radio,
  FormControlLabel,
} from "@mui/material";

const genderOptions = [
  { value: "Select", label: "Select" },
  { value: "Woman", label: "Woman" },
  { value: "Man", label: "Man" },
  { value: "Non-binary", label: "Non-binary" },
  { value: "Transgender", label: "Transgender" },
  { value: "Intersex", label: "Intersex" },
  { value: "Gender-nonconforming", label: "Gender-nonconforming" },
];

const HelpRequestForm = ({ isEdit = false, onClose }) => {
  const { t, i18n } = useTranslation(["common", "categories"]);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { categories, categoriesFetched } = useSelector(
    (state) => state.request,
  );
  const token = useSelector((state) => state.auth.idToken);
  const groups = useSelector((state) => state.auth.user?.groups);
  const [location, setLocation] = useState("");
  const { inputRef, isLoaded, handleOnPlacesChanged } =
    usePlacesSearchBox(setLocation);

  const [languages, setLanguages] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("General");
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [requestType, setRequestType] = useState("");
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [suggestedCategories, setSuggestedCategories] = useState([]);
  const [categoryConfirmed, setCategoryConfirmed] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info", // 'success', 'error', 'warning' also valid
  });

  const { data, error, isLoading } = useGetAllRequestQuery();
  const [addRequest] = useAddRequestMutation();
  const { id } = useParams();

  const inputref = useRef(null);
  const dropdownRef = useRef(null);

  const [formData, setFormData] = useState({
    is_self: "yes",
    requester_first_name: "",
    requester_last_name: "",
    email: "",
    phone: "",
    age: "",
    gender: "Select",
    lead_volunteer: "Ethan Marshall",
    preferred_language: "",
    category: "General",
    request_type: "remote",
    location: "",
    subject: "",
    description: "",
    priority: "MEDIUM",
  });

  // useEffect(() => {
  //   if (
  //     formData.category === "General" &&
  //     formData.subject.trim() !== "" &&
  //     formData.description.trim() !== "" &&
  //     !categoryConfirmed
  //   ) {
  //     fetchPredictedCategories();
  //     setShowModal(true);
  //   }
  // }, [formData.subject, formData.description, formData.category]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const closeForm = () => {
    navigate("/dashboard");
  };

  // Fetch predicted categories when category is "General" and debounced values change
  const fetchPredictedCategories = async () => {
    if (formData.category !== "General") return; // Only call the API if category is "General"
    if (!formData.subject || !formData.description) return; // Skip if no relevant data

    try {
      const requestBody = {
        subject: formData.subject,
        description: formData.description,
      };

      const response = await predictCategories(requestBody);
      console.log("API Response:", response);
      const formattedCategories = (response || []).map((category) => ({
        id: category.toLowerCase(),
        name: category,
      }));

      if (formattedCategories.length > 0) {
        const categoriesWithGeneral = [
          { id: "general", name: "General" },
          ...formattedCategories,
        ];

        setSuggestedCategories(categoriesWithGeneral);
      } else {
        setSuggestedCategories([{ id: "general", name: "General" }]);
      }
    } catch (error) {
      console.error("Error fetching predicted categories:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // If Senior Living Relocation Help is selected, merge its fields into submission
    let submissionData = { ...formData, location };
    if (
      formData.category === "elderly" &&
      elderlySubcategory === "senior_living"
    ) {
      submissionData = {
        ...submissionData,
        preferredLocation: seniorLivingFields.preferredLocation,
        minBudget: seniorLivingFields.minBudget,
        maxBudget: seniorLivingFields.maxBudget,
        facilityTypes: seniorLivingFields.facilityTypes,
        moveTimeline: seniorLivingFields.moveTimeline,
        amenities: seniorLivingFields.amenities,
        requestType: seniorLivingFields.requestType,
        priority: seniorLivingFields.priority,
        subject: seniorLivingFields.subject,
        description: seniorLivingFields.description,
      };
    }

    try {
      const res = await checkProfanity({
        subject: submissionData.subject,
        description: submissionData.description,
      });
      if (res.contains_profanity) {
        setSnackbar({
          open: true,
          message:
            "Profanity detected. Please remove these word(s): " +
            res.profanity +
            " from Subject/Description and submit again!",
          severity: "error",
        });
        return;
      }
      // Submit request to backend
      await createRequest(submissionData);
      setTimeout(() => {
        navigate("/dashboard", {
          state: {
            successMessage:
              "New Request #REQ-00-000-000-00011 submitted successfully!",
          },
        });
      }, 2000);
    } catch (error) {
      console.error("Failed to process request:", error);
      alert("Failed to submit request!");
    }
  };
  useEffect(() => {
    // Build languages options directly from languagesData.js
    const languageOptions = languagesData.map((lang) => ({
      // Special case: If the language is "Mandarin Chinese", convert its value to "Chinese" to match the locale mapping.
      value: lang.name === "Mandarin Chinese" ? "Chinese" : lang.name,
      label: lang.name,
    }));
    setLanguages(languageOptions);
    /*   const fetchLanguages = async () => {
      try {
        const response = await fetch("https://restcountries.com/v3.1/all");

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        // Ensure data is an array before processing
        if (!Array.isArray(data)) {
          console.warn("Languages API returned non-array data, using fallback");
          setLanguages([
            { value: "English", label: "English" },
            { value: "Spanish", label: "Spanish" },
            { value: "French", label: "French" },
            { value: "German", label: "German" },
            { value: "Hindi", label: "Hindi" },
          ]);
          return;
        }

        const languageSet = new Set();
        data.forEach((country) => {
          if (country.languages) {
            Object.values(country.languages).forEach((language) =>
              languageSet.add(language),
            );
          }
        });
        setLanguages(
          [...languageSet].map((lang) => ({ value: lang, label: lang })),
        );
      } catch (error) {
        console.warn(
          "Error fetching languages, using fallback:",
          error.message,
        );
        // Fallback to common languages if API fails
        setLanguages([
          { value: "English", label: "English" },
          { value: "Spanish", label: "Spanish" },
          { value: "French", label: "French" },
          { value: "German", label: "German" },
          { value: "Hindi", label: "Hindi" },
          { value: "Chinese", label: "Chinese" },
          { value: "Arabic", label: "Arabic" },
          { value: "Portuguese", label: "Portuguese" },
          { value: "Russian", label: "Russian" },
          { value: "Japanese", label: "Japanese" },
        ]);
      }
    };*/

    // Fetch categories from API if not already fetched, following same pattern as other APIs
    const fetchCategoriesData = async () => {
      if (!categoriesFetched) {
        try {
          const categoriesData = await getCategories(); // Direct API call like checkProfanity and predictCategories

          // Store the API response directly in Redux as-is
          // No complex mappings needed - API keys now match i18n keys exactly
          console.log("Categories API response:", categoriesData);

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
            // Log the structure to understand the API format
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

          console.log(
            "Filtered categories:",
            validCategories.length,
            "out of",
            categoriesArray.length,
          );
          dispatch(loadCategories(validCategories));
        } catch (error) {
          console.warn(
            "Categories API failed, using static fallback:",
            error.message,
          );
          dispatch(loadCategories()); // Load static categories as fallback
        }
      }
    };

    fetchCategoriesData();

    //fetchLanguages();
  }, [dispatch, categoriesFetched]);

  useEffect(() => {
    if (id && data) {
      const requestData = data.body?.find((item) => item.id === id);
      setFormData({
        category: requestData.category,
        description: requestData.description,
        subject: requestData.subject,
        ...requestData,
      });
    }
  }, [data]);

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

  const handleSearchInput = (e) => {
    const searchTerm = e.target.value;
    setSearchInput(searchTerm);
    setFormData({
      ...formData,
      category: searchTerm,
    });

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
    setShowDropdown(true);
  };

  const handleClickOutside = (event) => {
    if (inputRef.current && inputRef.current.getPlaces) {
      const inputNode = inputRef.current.input;
      if (inputNode && !inputNode.contains(event.target)) {
        setShowDropdown(false);
      }
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleCategoryClick = (categoryKeyOrId) => {
    setFormData({
      ...formData,
      category: categoryKeyOrId,
    });
    setShowDropdown(false);
    setHoveredCategory(null);
  };

  const handleSubcategoryClick = (subcategoryId) => {
    setFormData({
      ...formData,
      category: subcategoryId,
    });
    setElderlySubcategory(subKey); // <-- Ensure dynamic form renders
    setShowDropdown(false);
    setHoveredCategory(null);

    // Debug: Log category value to verify what is stored
    console.log("Selected category:", formData.category);
    console.log("Selected category value:", formData.category);
  };

  const [selfFlag, setSelfFlag] = useState(true);

  const handleConfirmCategorySelection = () => {
    const oldCategory = "General";
    const newCategory = formData.category;

    setCategoryConfirmed(true); // unlock submission
    setShowModal(false);

    if (oldCategory !== newCategory) {
      setSnackbar({
        open: true,
        message: `Category updated from \"${oldCategory}\" to \"${newCategory}\". Click Submit to continue.`,
        severity: "info",
      });
    }
  };

  // Senior Living Relocation Help fields
  const [seniorLivingFields, setSeniorLivingFields] = useState({
    preferredLocation: "",
    minBudget: "",
    maxBudget: "",
    facilityTypes: [],
    moveTimeline: "",
    amenities: [],
    requestType: "",
    priority: "MEDIUM",
    subject: "",
    description: "",
  });

  // Ensure elderlySubcategory state is defined
  const [elderlySubcategory, setElderlySubcategory] = useState("");

  // Add state for subcategory selection
  const [subcategory, setSubcategory] = useState("");

  // Update subcategory when user selects from dropdown
  const handleSubcategoryChange = (e) => {
    setSubcategory(e.target.value);
  };

  if (isLoading) return <div>Loading...</div>;
  return (
    <div className="">
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      <form className="w-full max-w-3xl mx-auto p-8" onSubmit={handleSubmit}>
        <div className="w-full max-w-2xl mx-auto px-4 mt-4">
          <button
            onClick={() => navigate("/dashboard")}
            className="text-blue-600 hover:text-blue-800 font-semibold text-lg flex items-center"
          >
            <span className="text-2xl mr-2">&lt;</span>{" "}
            {t("BACK_TO_DASHBOARD") || "Back to Dashboard"}
          </button>
        </div>
        <div className="bg-white p-8 rounded-lg shadow-md border">
          <h1 className="text-2xl font-bold text-gray-800 ">
            {isEdit ? t("EDIT_HELP_REQUEST") : t("CREATE_HELP_REQUEST")}
          </h1>
          <div
            className="flex items-start gap-2 p-4 my-4 text-sm text-yellow-800 rounded-lg bg-yellow-50"
            role="alert"
          >
            <IoMdInformationCircle size={22} />
            <div>
              <span className="font-medium mr-1">{t("NOTE")}:</span>
              {t("LIFE_THREATENING_REQUESTS")}
            </div>
          </div>
          <div className="mt-3 flex gap-4" data-testid="parentDivOne">
            {/* For Self Dropdown */}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <label htmlFor="self" className="text-gray-700 font-medium">
                  {t("FOR_SELF")}
                </label>
                <div className="relative group cursor-pointer">
                  {/* Circle Question Mark Icon */}
                  <div className="w-4 h-4 flex items-center justify-center rounded-full bg-gray-400 text-white text-xs font-bold">
                    ?
                  </div>
                  {/* Tooltip */}
                  <div className="absolute left-5 top-0 w-52 bg-gray-700 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 group-hover:visible transition-opacity duration-200 z-10 pointer-events-none">
                    Choose ‘Yes’ if you’re submitting this request on your own
                    behalf else ‘No’ if you’re requesting for someone else.
                  </div>
                </div>
              </div>

              <div className="flex-1 relative">
                <select
                  id="self"
                  data-testid="dropdown"
                  className="appearance-none bg-white border p-2 w-full rounded-lg text-gray-700"
                  onChange={(e) => setSelfFlag(e.target.value === "yes")}
                >
                  <option value="yes">{t("YES")}</option>
                  <option value="no">{t("NO")}</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                  <HiChevronDown className="h-5 w-5 text-gray-600" />
                </div>
              </div>
            </div>

            {/* Lead Volunteer */}
            {/* Lead Volunteer */}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <label
                  htmlFor="lead_volunteer"
                  className="text-gray-700 font-medium"
                >
                  {t("Lead Volunteer")}
                </label>
                <div className="relative group cursor-pointer">
                  <div className="w-4 h-4 flex items-center justify-center rounded-full bg-gray-400 text-white text-xs font-bold">
                    ?
                  </div>
                  <div
                    className="absolute left-5 top-0 w-52 bg-gray-700 text-white text-xs rounded py-1 px-2 
                                  opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10"
                  >
                    Select “Yes” if you’re the main volunteer coordinating this
                    request.
                  </div>
                </div>
              </div>

              {/* when editing, admins can type new name; otherwise show a dropdown */}
              {isEdit ? (
                <input
                  type="text"
                  id="lead_volunteer"
                  name="lead_volunteer"
                  disabled={
                    !(
                      groups?.includes("Admins") ||
                      groups?.includes("SuperAdmins")
                    )
                  }
                  value={formData.lead_volunteer}
                  onChange={handleChange}
                  className="border p-2 w-full rounded-lg disabled:text-gray-600"
                />
              ) : (
                <div className="relative">
                  <select
                    id="lead_volunteer"
                    name="lead_volunteer"
                    value={formData.lead_volunteer}
                    onChange={handleChange}
                    className="block w-full appearance-none bg-white border border-gray-300 rounded-lg 
                              py-2 px-3 pr-8 text-gray-700 focus:outline-none"
                  >
                    <option value="No">{t("No")}</option>
                    <option value="Yes">{t("Yes")}</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                    <HiChevronDown className="h-5 w-5 text-gray-600" />
                  </div>
                </div>
              )}
            </div>
          </div>

          {
            //Temporarily commented out as MVP only allows for self requests
            !selfFlag && (
              <div
                className="mt-5 w-full border border-gray-200 rounded-lg p-4 bg-gray-50"
                data-testid="parentDivTwo"
              >
                <div className="flex items-start gap-2 mb-3 text-sm text-gray-600">
                  <IoMdInformationCircle className="text-gray-500 mr-1 mt-0.5" />
                  <div className="text-sm text-gray-600">
                    Please fill the details of the person you are submitting the
                    request for.
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="requester_first_name"
                      className="block text-gray-700 mb-1 font-medium"
                    >
                      {t("FIRST_NAME")}
                    </label>
                    <input
                      type="text"
                      id="requester_first_name"
                      value={formData.requester_first_name}
                      onChange={handleChange}
                      className="w-full rounded-lg border py-2 px-3"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="requester_last_name"
                      className="block text-gray-700 mb-1 font-medium"
                    >
                      {t("LAST_NAME")}
                    </label>
                    <input
                      type="text"
                      id="requester_last_name"
                      value={formData.requester_last_name}
                      onChange={handleChange}
                      className="w-full rounded-lg border py-2 px-3"
                    />
                  </div>
                </div>
                <div className="mt-3" data-testid="parentDivThree">
                  <label
                    htmlFor="email"
                    className="block text-gray-700 mb-1 font-medium"
                  >
                    {t("EMAIL")}
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full rounded-lg border py-2 px-3"
                  />
                </div>

                <div className="mt-3 grid grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-gray-700 mb-1 font-medium"
                    >
                      {t("PHONE")}
                    </label>
                    <input
                      type="text"
                      id="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full rounded-lg border py-2 px-3"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="age"
                      className="block text-gray-700 mb-1 font-medium"
                    >
                      {t("AGE")}
                    </label>
                    <input
                      type="number"
                      id="age"
                      value={formData.age}
                      onChange={handleChange}
                      className="w-full rounded-lg border py-2 px-3"
                    />
                  </div>
                  <div className="mt-3" data-testid="parentDivFour">
                    <label
                      htmlFor="gender"
                      className="block text-gray-700 mb-1 font-medium"
                    >
                      {t("GENDER")}
                    </label>
                    <select
                      id="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      className="border border-gray-300 text-gray-700 rounded-lg p-2 w-full bg-white"
                    >
                      {genderOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="mt-3" data-testid="parentDivFive">
                    <label
                      htmlFor="language"
                      className="block text-gray-700 mb-1 font-medium"
                    >
                      {t("PREFERRED_LANGUAGE")}
                    </label>
                    <select
                      id="preferred_language"
                      value={formData.preferred_language}
                      onChange={handleChange}
                      className="border border-gray-300 text-gray-700 rounded-lg p-2 w-full bg-white"
                    >
                      {languages.map((language) => (
                        <option key={language.value} value={language.value}>
                          {language.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )
          }

          <div className="mt-3 grid grid-cols-2 gap-4">
            <div className="flex-1 relative">
              <div className="flex items-center gap-2 mb-1">
                <label htmlFor="category" className="font-medium text-gray-700">
                  {t("REQUEST_CATEGORY")}
                </label>
                <div className="relative group cursor-pointer">
                  {/* Circle Question Mark Icon */}
                  <div className="w-4 h-4 flex items-center justify-center rounded-full bg-gray-400 text-white text-xs font-bold">
                    ?
                  </div>
                  {/* Tooltip */}
                  <div className="absolute left-5 top-0 w-52 bg-gray-700 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 group-hover:visible transition-opacity duration-200 z-10 pointer-events-none">
                    Choose the category that best describes your need (e.g.,
                    Medical, Food, Jobs).
                    <br /> If you select ‘General,’ please describe your need
                    fully in the Description field.
                  </div>
                </div>
              </div>
              <div className="relative">
                <input
                  type="text"
                  id="category"
                  value={resolveCategoryLabel(formData.category)}
                  onChange={handleSearchInput}
                  className="block w-full appearance-none bg-white border border-gray-300 rounded-lg py-2 px-3 pr-8 text-gray-700 focus:outline-none"
                  onFocus={() => setShowDropdown(true)}
                  onBlur={(e) => {
                    if (!dropdownRef.current?.contains(e.relatedTarget)) {
                      setShowDropdown(false);
                    }
                  }}
                />

                {/* the dropdown arrow, pointer-events-none so it doesn’t block input clicks */}
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                  <HiChevronDown className="h-5 w-5 text-gray-600" />
                </div>
              </div>
              {showDropdown && (
                <div
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
                  ref={dropdownRef}
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
                    {filteredCategories.map((category) => (
                      <div
                        key={category.catId}
                        className={`p-2 cursor-pointer hover:bg-gray-100 bg-white flex items-center justify-between ${
                          hoveredCategory?.catId === category.catId
                            ? "font-semibold bg-gray-50"
                            : ""
                        }`}
                        style={{ background: "#fff" }}
                        onClick={(e) => {
                          if (
                            !category.subCategories ||
                            category.subCategories.length === 0
                          ) {
                            handleCategoryClick(category.catName);
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
                        {/* Show chevron if subcategories exist */}
                        {category.subCategories &&
                          category.subCategories.length > 0 && (
                            <span className="ml-2 text-gray-400">&gt;</span>
                          )}
                      </div>
                    ))}
                  </div>
                  {/* Only show subcategories column if there are subcategories */}
                  {hoveredCategory &&
                    hoveredCategory.subCategories &&
                    hoveredCategory.subCategories.length > 0 && (
                      <>
                        {/* Vertical divider */}
                        <div
                          className="w-px bg-gray-300 mx-1"
                          style={{ minHeight: "100%" }}
                        />
                        {/* Subcategories column */}
                        <div
                          className="w-1/2 overflow-y-auto"
                          style={{ maxHeight: "240px" }}
                        >
                          {hoveredCategory.subCategories.map(
                            (subcategory, index) => (
                              <div
                                key={subcategory.catId}
                                className={`cursor-pointer hover:bg-gray-200 p-2 bg-white${
                                  index !==
                                  hoveredCategory.subCategories.length - 1
                                    ? " border-b-0 border-t border-gray-200"
                                    : ""
                                }`}
                                style={{
                                  background: "#fff",
                                  borderTop:
                                    index !== 0 ? "1px solid #e5e7eb" : "none",
                                  borderBottom: "none",
                                }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleSubcategoryClick(subcategory.catId);
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
                            ),
                          )}
                        </div>
                      </>
                    )}
                </div>
              )}
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <label
                  htmlFor="requestType"
                  className="font-medium text-gray-700"
                >
                  {t("REQUEST_TYPE")}
                </label>
                <div className="relative group cursor-pointer">
                  {/* Circle Question Mark Icon */}
                  <div className="w-4 h-4 flex items-center justify-center rounded-full bg-gray-400 text-white text-xs font-bold">
                    ?
                  </div>
                  <div
                    className="absolute left-5 top-0 w-52 bg-gray-700 text-white text-xs rounded py-1 px-2
                                  opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10 pointer-events-none"
                  >
                    Indicate how you’d like help delivered: “Remote” for virtual
                    support or “In Person” for onsite assistance.
                  </div>
                </div>
              </div>

              <div className="relative">
                <select
                  id="requestType"
                  value={formData.request_type}
                  onChange={(e) =>
                    setFormData({ ...formData, request_type: e.target.value })
                  }
                  className="
                    block w-full appearance-none
                    bg-white border border-gray-300
                    rounded-lg py-2 px-3 pr-8
                    text-gray-700
                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                  "
                >
                  <option value="Remote">{t("REMOTE")}</option>
                  <option value="In Person">{t("IN_PERSON")}</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                  <HiChevronDown className="h-5 w-5 text-gray-600" />
                </div>
              </div>
              {formData.request_type === "In Person" && (
                <div
                  className="mt-5 ml-2 sm:ml-4 border border-gray-200 rounded-lg p-4 bg-gray-50"
                  data-testid="parentDivTwo"
                >
                  <label
                    htmlFor="location"
                    className="block mb-1 font-medium text-gray-700"
                  >
                    Location
                  </label>
                  {isLoaded && (
                    <StandaloneSearchBox
                      onLoad={(ref) => (inputRef.current = ref)}
                      onPlacesChanged={handleOnPlacesChanged}
                    >
                      <input
                        type="text"
                        id="location"
                        value={formData.location}
                        onChange={handleChange}
                        name="location"
                        className="border p-2 w-full rounded-lg"
                        placeholder="Search for location..."
                      />
                    </StandaloneSearchBox>
                  )}
                </div>
              )}
            </div>

            <div className="mt-3 flex gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <label
                    htmlFor="calamity"
                    className="font-medium text-gray-700"
                  >
                    Is Calamity?
                  </label>
                  <div className="relative group cursor-pointer">
                    {/* Circle Question Mark Icon */}
                    <div className="w-4 h-4 flex items-center justify-center rounded-full bg-gray-400 text-white text-xs font-bold">
                      ?
                    </div>
                    <div
                      className="absolute left-5 top-0 w-52 bg-gray-700 text-white text-xs rounded py-1 px-2
                                  opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10 pointer-events-none"
                    >
                      Indicate if it is a calamity by checking the box.
                    </div>
                  </div>
                </div>
                <div className="relative">
                  <input
                    id="calamity"
                    type="checkbox"
                    name="calamity"
                    className="w-5 h-5 inset-y-10 right-0 flex items-center pr-2"
                  />
                </div>
              </div>
            </div>
            <div className="flex-1 relative">
              <div className="flex items-center gap-2 mb-1">
                <label
                  htmlFor="requestPriority"
                  className="font-medium text-gray-700"
                >
                  {t("Request Priority")}
                </label>
                <div className="relative group cursor-pointer">
                  {/* Circle Question Mark Icon */}
                  <div className="w-4 h-4 flex items-center justify-center rounded-full bg-gray-400 text-white text-xs font-bold">
                    ?
                  </div>
                  {/* Tooltip */}
                  <div className="absolute left-5 top-0 w-52 bg-gray-700 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 group-hover:visible transition-opacity duration-200 z-10 pointer-events-none">
                    How urgent is this request? <br />
                    • Low – Not time sensitive <br />
                    • Medium – Within few days <br />• High – Immediate support
                  </div>
                </div>
              </div>
              <div className="relative">
                <select
                  id="requestPriority"
                  value={formData.priority || "MEDIUM"}
                  onChange={(e) =>
                    setFormData({ ...formData, priority: e.target.value })
                  }
                  className="
                    block w-full appearance-none
                    bg-white border border-gray-300
                    rounded-lg px-3 py-2 pr-8
                    text-gray-700
                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                  "
                >
                  <option value="LOW">{t("Low")}</option>
                  <option value="MEDIUM">{t("Medium")}</option>
                  <option value="HIGH">{t("High")}</option>
                </select>

                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                  <HiChevronDown className="h-5 w-5 text-gray-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Render dynamic forms for all subcategories inside the main pane, after category selection */}
          {formData.category === "SENIOR_LIVING_RELOCATION" && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">
                Senior Living Relocation Help
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Preferred Location */}
                <div>
                  <label className="block font-medium mb-1">
                    Preferred Location (City or Zip Code)
                  </label>
                  <input
                    type="text"
                    className="w-full border p-2 rounded"
                    value={seniorLivingFields.preferredLocation}
                    onChange={(e) =>
                      setSeniorLivingFields((f) => ({
                        ...f,
                        preferredLocation: e.target.value,
                      }))
                    }
                    placeholder="Enter city or zip code"
                  />
                </div>
                {/* Interactive Map (placeholder) */}
                <div>
                  <label className="block font-medium mb-1">
                    Select on Map (optional)
                  </label>
                  <div className="border rounded p-2 bg-gray-50 text-gray-500">
                    [Map integration coming soon]
                  </div>
                </div>
                {/* Budget Range */}
                <div>
                  <label className="block font-medium mb-1">
                    Monthly Budget Range
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      className="w-1/2 border p-2 rounded"
                      value={seniorLivingFields.minBudget}
                      onChange={(e) =>
                        setSeniorLivingFields((f) => ({
                          ...f,
                          minBudget: e.target.value,
                        }))
                      }
                      placeholder="Min $"
                      min={0}
                    />
                    <input
                      type="number"
                      className="w-1/2 border p-2 rounded"
                      value={seniorLivingFields.maxBudget}
                      onChange={(e) =>
                        setSeniorLivingFields((f) => ({
                          ...f,
                          maxBudget: e.target.value,
                        }))
                      }
                      placeholder="Max $"
                      min={0}
                    />
                  </div>
                </div>
                {/* Facility Types */}
                <div>
                  <label className="block font-medium mb-1">
                    Type of Facility
                  </label>
                  <select
                    multiple
                    className="w-full border p-2 rounded"
                    value={seniorLivingFields.facilityTypes}
                    onChange={(e) => {
                      const options = Array.from(
                        e.target.selectedOptions,
                        (opt) => opt.value,
                      );
                      setSeniorLivingFields((f) => ({
                        ...f,
                        facilityTypes: options,
                      }));
                    }}
                  >
                    <option value="Independent Living">
                      Independent Living
                    </option>
                    <option value="Assisted Living">Assisted Living</option>
                    <option value="Skilled Nursing">Skilled Nursing</option>
                    <option value="Memory Care">Memory Care</option>
                    <option value="CCRC">
                      Continuing Care Retirement Community (CCRC)
                    </option>
                  </select>
                </div>
                {/* Move Timeline */}
                <div>
                  <label className="block font-medium mb-1">
                    Move Timeline
                  </label>
                  <select
                    className="w-full border p-2 rounded"
                    value={seniorLivingFields.moveTimeline}
                    onChange={(e) =>
                      setSeniorLivingFields((f) => ({
                        ...f,
                        moveTimeline: e.target.value,
                      }))
                    }
                  >
                    <option value="">-- Choose --</option>
                    <option value="Immediately">Immediately</option>
                    <option value="Within 1 Month">Within 1 Month</option>
                    <option value="1–3 Months">1–3 Months</option>
                    <option value="Flexible">Flexible</option>
                  </select>
                </div>
                {/* Amenities */}
                <div>
                  <label className="block font-medium mb-1">
                    Desired Amenities
                  </label>
                  <select
                    multiple
                    className="w-full border p-2 rounded"
                    value={seniorLivingFields.amenities}
                    onChange={(e) => {
                      const options = Array.from(
                        e.target.selectedOptions,
                        (opt) => opt.value,
                      );
                      setSeniorLivingFields((f) => ({
                        ...f,
                        amenities: options,
                      }));
                    }}
                  >
                    <option value="On-site Medical Staff">
                      On-site Medical Staff
                    </option>
                    <option value="Private Rooms">Private Rooms</option>
                    <option value="Fitness/Recreation">
                      Fitness/Recreation
                    </option>
                    <option value="Meal Plans">Meal Plans</option>
                    <option value="Transportation">Transportation</option>
                    <option value="Pet-Friendly">Pet-Friendly</option>
                    <option value="Social Activities">Social Activities</option>
                  </select>
                </div>
                {/* Request Type, Priority, Subject, Description */}
                <div>
                  <label className="block font-medium mb-1">Request Type</label>
                  <select
                    className="w-full border p-2 rounded"
                    value={seniorLivingFields.requestType}
                    onChange={(e) =>
                      setSeniorLivingFields((f) => ({
                        ...f,
                        requestType: e.target.value,
                      }))
                    }
                  >
                    <option value="">-- Choose --</option>
                    <option value="General">General</option>
                    <option value="Urgent">Urgent</option>
                  </select>
                </div>
                <div>
                  <label className="block font-medium mb-1">Priority</label>
                  <select
                    className="w-full border p-2 rounded"
                    value={seniorLivingFields.priority}
                    onChange={(e) =>
                      setSeniorLivingFields((f) => ({
                        ...f,
                        priority: e.target.value,
                      }))
                    }
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                  </select>
                </div>
                <div>
                  <label className="block font-medium mb-1">Subject</label>
                  <input
                    type="text"
                    className="w-full border p-2 rounded"
                    value={seniorLivingFields.subject}
                    onChange={(e) =>
                      setSeniorLivingFields((f) => ({
                        ...f,
                        subject: e.target.value,
                      }))
                    }
                    maxLength={70}
                    placeholder="Brief subject of request"
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1">Description</label>
                  <textarea
                    className="w-full border p-2 rounded"
                    value={seniorLivingFields.description}
                    onChange={(e) =>
                      setSeniorLivingFields((f) => ({
                        ...f,
                        description: e.target.value,
                      }))
                    }
                    rows={3}
                    maxLength={500}
                    placeholder="Detailed description of request"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Render dynamic form for Digital Support for Seniors */}
          {formData.category === "DIGITAL_SUPPORT_FOR_SENIORS" && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">
                Digital Support for Seniors
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Help using mobile or computer apps */}
                <div>
                  <label className="block font-medium mb-1">Type of Help</label>
                  <select className="w-full border p-2 rounded">
                    <option value="">-- Choose --</option>
                    <option value="app_help">
                      Help using mobile or computer apps
                    </option>
                  </select>
                </div>
                {/* App Name(s) */}
                <div>
                  <label className="block font-medium mb-1">App Name(s)</label>
                  <input
                    type="text"
                    className="w-full border p-2 rounded"
                    placeholder="Enter app names (e.g. WhatsApp, Zoom)"
                  />
                </div>
                {/* Device Type */}
                <div>
                  <label className="block font-medium mb-1">Device Type</label>
                  <select className="w-full border p-2 rounded">
                    <option value="">-- Choose --</option>
                    <option value="Phone">Phone</option>
                    <option value="Tablet">Tablet</option>
                    <option value="Computer">Computer</option>
                  </select>
                </div>
                {/* Operating System */}
                <div>
                  <label className="block font-medium mb-1">
                    Operating System
                  </label>
                  <select className="w-full border p-2 rounded">
                    <option value="">-- Choose --</option>
                    <option value="Android">Android</option>
                    <option value="iOS">iOS</option>
                    <option value="Windows">Windows</option>
                    <option value="MacOS">MacOS</option>
                  </select>
                </div>
                {/* Issue Description */}
                <div>
                  <label className="block font-medium mb-1">
                    Issue Description
                  </label>
                  <textarea
                    className="w-full border p-2 rounded"
                    rows={3}
                    maxLength={500}
                    placeholder="Describe the issue"
                  />
                </div>
                {/* Request Type, Priority, Subject, Description */}
                <div>
                  <label className="block font-medium mb-1">Request Type</label>
                  <select className="w-full border p-2 rounded">
                    <option value="">-- Choose --</option>
                    <option value="General">General</option>
                    <option value="Urgent">Urgent</option>
                  </select>
                </div>
                <div>
                  <label className="block font-medium mb-1">Priority</label>
                  <select className="w-full border p-2 rounded">
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                  </select>
                </div>
                <div>
                  <label className="block font-medium mb-1">Subject</label>
                  <input
                    type="text"
                    className="w-full border p-2 rounded"
                    maxLength={70}
                    placeholder="Brief subject of request"
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1">Description</label>
                  <textarea
                    className="w-full border p-2 rounded"
                    rows={3}
                    maxLength={500}
                    placeholder="Detailed description of request"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Render dynamic form for Medical Help subcategory under Elderly Help */}
          {formData.category === "MEDICAL_HELP" && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Medical Help</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Sub-option: Help Managing Medication Schedules */}
                <div>
                  <label className="block font-medium mb-1">
                    Type of Medical Help
                  </label>
                  <select className="w-full border p-2 rounded">
                    <option value="">-- Choose --</option>
                    <option value="medication_schedule">
                      Help Managing Medication Schedules
                    </option>
                    <option value="device_setup">
                      Help Setting Up Health Monitoring Devices
                    </option>
                  </select>
                </div>
                {/* Medication Schedules Fields */}
                {/* These would be conditionally rendered based on sub-option selection */}
                <div>
                  <label className="block font-medium mb-1">
                    Number of Medications
                  </label>
                  <input
                    type="number"
                    className="w-full border p-2 rounded"
                    min={0}
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1">
                    Timing Per Day
                  </label>
                  <input
                    type="text"
                    className="w-full border p-2 rounded"
                    placeholder="e.g. Morning, Evening"
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1">
                    Doctor's Prescription Available?
                  </label>
                  <select className="w-full border p-2 rounded">
                    <option value="">-- Choose --</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                </div>
                <div>
                  <label className="block font-medium mb-1">
                    Reminder Type
                  </label>
                  <select className="w-full border p-2 rounded">
                    <option value="">-- Choose --</option>
                    <option value="phone_call">Phone Call</option>
                    <option value="app_setup">App Setup Help</option>
                    <option value="physical_visit">Physical Visit</option>
                  </select>
                </div>
                <div>
                  <label className="block font-medium mb-1">
                    Preferred Language
                  </label>
                  <input type="text" className="w-full border p-2 rounded" />
                </div>
                <div>
                  <label className="block font-medium mb-1">
                    Preferred Time Slots
                  </label>
                  <input
                    type="text"
                    className="w-full border p-2 rounded"
                    placeholder="e.g. 9am-11am"
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1">Priority</label>
                  <select className="w-full border p-2 rounded">
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                  </select>
                </div>
                <div>
                  <label className="block font-medium mb-1">Description</label>
                  <textarea
                    className="w-full border p-2 rounded"
                    rows={3}
                    maxLength={500}
                    placeholder="Detailed description of request"
                  />
                </div>
                {/* Device Setup Fields (shown if sub-option is device_setup) */}
                <div>
                  <label className="block font-medium mb-1">Device Type</label>
                  <select className="w-full border p-2 rounded">
                    <option value="">-- Choose --</option>
                    <option value="blood_pressure_monitor">
                      Blood Pressure Monitor
                    </option>
                    <option value="glucose_meter">Glucose Meter</option>
                    <option value="pulse_oximeter">Pulse Oximeter</option>
                    <option value="smartwatch">Smartwatch / Wearable</option>
                  </select>
                </div>
                <div>
                  <label className="block font-medium mb-1">Setup Mode</label>
                  <select className="w-full border p-2 rounded">
                    <option value="">-- Choose --</option>
                    <option value="video_call">Video Call</option>
                    <option value="home_visit">Home Visit</option>
                    <option value="remote_guide">
                      Remote Step-by-Step Guide
                    </option>
                  </select>
                </div>
                <div>
                  <label className="block font-medium mb-1">
                    Device Brand (optional)
                  </label>
                  <input type="text" className="w-full border p-2 rounded" />
                </div>
                <div>
                  <label className="block font-medium mb-1">Language</label>
                  <input type="text" className="w-full border p-2 rounded" />
                </div>
                <div>
                  <label className="block font-medium mb-1">Time Slot</label>
                  <input type="text" className="w-full border p-2 rounded" />
                </div>
                <div>
                  <label className="block font-medium mb-1">Priority</label>
                  <select className="w-full border p-2 rounded">
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                  </select>
                </div>
                <div>
                  <label className="block font-medium mb-1">Description</label>
                  <textarea
                    className="w-full border p-2 rounded"
                    rows={3}
                    maxLength={500}
                    placeholder="Detailed description of request"
                  />
                </div>
              </div>
            </div>
          )}
          {formData.category === "ERRANDS_TRANSPORTATION" && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">
                Errands, Events & Transportation
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Errand Type */}
                <div>
                  <label className="block font-medium mb-1">Errand Type</label>
                  <select className="w-full border p-2 rounded">
                    <option value="">-- Choose --</option>
                    <option value="grocery">Grocery shopping</option>
                    <option value="pharmacy">Pharmacy pickup</option>
                    <option value="bill">Bill payment</option>
                    <option value="general_store">General store</option>
                  </select>
                </div>
                {/* List of Items / Location */}
                <div>
                  <label className="block font-medium mb-1">
                    List of Items / Location
                  </label>
                  <input
                    type="text"
                    className="w-full border p-2 rounded"
                    placeholder="Enter items or location for pick-up/drop-off"
                  />
                </div>
                {/* Frequency */}
                <div>
                  <label className="block font-medium mb-1">Frequency</label>
                  <select className="w-full border p-2 rounded">
                    <option value="">-- Choose --</option>
                    <option value="one_time">One-time</option>
                    <option value="weekly">Weekly/Monthly</option>
                    <option value="emergency">Emergency</option>
                  </select>
                </div>
                {/* Preferred Time Slot & Urgency */}
                <div>
                  <label className="block font-medium mb-1">
                    Preferred Time Slot & Urgency
                  </label>
                  <input
                    type="text"
                    className="w-full border p-2 rounded"
                    placeholder="Enter preferred time slot and urgency"
                  />
                </div>
                {/* Description & Priority */}
                <div>
                  <label className="block font-medium mb-1">Description</label>
                  <textarea
                    className="w-full border p-2 rounded"
                    rows={3}
                    maxLength={500}
                    placeholder="Detailed description of request"
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1">Priority</label>
                  <select className="w-full border p-2 rounded">
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                  </select>
                </div>
              </div>
            </div>
          )}
          {formData.category === "SOCIAL_CONNECTION" && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Social Connection</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Activity */}
                <div>
                  <label className="block font-medium mb-1">Activity</label>
                  <select className="w-full border p-2 rounded">
                    <option value="">-- Choose --</option>
                    <option value="phone_chat">Phone call / chat</option>
                    <option value="walk">Walk in the park</option>
                    <option value="games">Board/card games</option>
                    <option value="reading">Reading together</option>
                  </select>
                </div>
                {/* Frequency */}
                <div>
                  <label className="block font-medium mb-1">Frequency</label>
                  <select className="w-full border p-2 rounded">
                    <option value="">-- Choose --</option>
                    <option value="one_time">One-time</option>
                    <option value="weekly">Weekly/Monthly</option>
                    <option value="specific_dates">Specific dates</option>
                  </select>
                </div>
                {/* Preferred Times, Language, Location */}
                <div>
                  <label className="block font-medium mb-1">
                    Preferred Times
                  </label>
                  <input
                    type="text"
                    className="w-full border p-2 rounded"
                    placeholder="Enter preferred times"
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1">
                    Preferred Language
                  </label>
                  <input
                    type="text"
                    className="w-full border p-2 rounded"
                    placeholder="Enter preferred language"
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1">
                    Location (if applicable)
                  </label>
                  <input
                    type="text"
                    className="w-full border p-2 rounded"
                    placeholder="Enter location"
                  />
                </div>
                {/* Description & Priority */}
                <div>
                  <label className="block font-medium mb-1">Description</label>
                  <textarea
                    className="w-full border p-2 rounded"
                    rows={3}
                    maxLength={500}
                    placeholder="Detailed description of request"
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1">Priority</label>
                  <select className="w-full border p-2 rounded">
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                  </select>
                </div>
              </div>
            </div>
          )}
          {formData.category === "MEAL_SUPPORT" && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Meal Support</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Type of Help Needed */}
                <div>
                  <label className="block font-medium mb-1">
                    Type of Help Needed
                  </label>
                  <select className="w-full border p-2 rounded">
                    <option value="">-- Choose --</option>
                    <option value="meal_prep">Meal prep assistance</option>
                    <option value="cooking_together">Cooking together</option>
                    <option value="supervision">
                      Supervision while cooking
                    </option>
                  </select>
                </div>
                {/* Location */}
                <div>
                  <label className="block font-medium mb-1">Location</label>
                  <select className="w-full border p-2 rounded">
                    <option value="">-- Choose --</option>
                    <option value="volunteer_home">Volunteer's home</option>
                    <option value="elder_home">Elder's home</option>
                    <option value="community_kitchen">Community kitchen</option>
                  </select>
                </div>
                {/* Dietary Preferences */}
                <div>
                  <label className="block font-medium mb-1">
                    Dietary Preferences
                  </label>
                  <select className="w-full border p-2 rounded">
                    <option value="">-- Choose --</option>
                    <option value="vegetarian">Vegetarian</option>
                    <option value="diabetic">Diabetic-friendly</option>
                    <option value="low_sodium">Low-sodium</option>
                    <option value="no_preference">No preference</option>
                  </select>
                </div>
                {/* Schedule: Frequency & Time of Day */}
                <div>
                  <label className="block font-medium mb-1">Schedule</label>
                  <input
                    type="text"
                    className="w-full border p-2 rounded"
                    placeholder="Frequency (e.g., once/week, daily), Time of day"
                  />
                </div>
                {/* Subject, Description, Priority, Language */}
                <div>
                  <label className="block font-medium mb-1">Subject</label>
                  <input
                    type="text"
                    className="w-full border p-2 rounded"
                    maxLength={70}
                    placeholder="Brief subject of request"
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1">Description</label>
                  <textarea
                    className="w-full border p-2 rounded"
                    rows={3}
                    maxLength={500}
                    placeholder="Detailed description of request"
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1">Priority</label>
                  <select className="w-full border p-2 rounded">
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                  </select>
                </div>
                <div>
                  <label className="block font-medium mb-1">Language</label>
                  <input
                    type="text"
                    className="w-full border p-2 rounded"
                    placeholder="Preferred language"
                  />
                </div>
              </div>
            </div>
          )}

          <div className="mt-3" data-testid="parentDivSix">
            <label
              htmlFor="subject"
              className="block text-gray-700 font-medium mb-2"
            >
              {t("SUBJECT")}
              <span className="text-red-500 m-1">*</span>(
              {t("MAX_CHARACTERS", { count: 70 })})
            </label>
            <input
              type="text"
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              className="border p-2 w-full rounded-lg"
              maxLength={70}
              required
              placeholder="Please give a brief description of the request"
            />
          </div>
          {formData.category !== "Senior Living Relocation" && (
            <div className="mt-3" data-testid="parentDivSeven">
              <label
                htmlFor="description"
                className="block text-gray-700 font-medium mb-2"
              >
                {t("DESCRIPTION")}
                <span className="text-red-500 m-1">*</span>(
                {t("MAX_CHARACTERS", { count: 500 })})
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="border p-2 w-full rounded-lg"
                rows="5"
                maxLength={500}
                required
                placeholder="Please give a detailed description of the request"
              ></textarea>
            </div>
          )}
          <div className="mt-8 flex justify-end gap-2">
            <button
              type="submit"
              className="py-2 px-4 bg-blue-500 text-white rounded-md mr-2 hover:bg-blue-600"
            >
              {isEdit ? t("SAVE") : t("SUBMIT")}
            </button>
            <button
              onClick={isEdit ? onClose : closeForm}
              type="button"
              className="py-2 px-4 bg-gray-500 text-white rounded-md hover:bg-gray-600"
            >
              {t("CANCEL")}
            </button>
          </div>
        </div>
      </form>
      {/* Modal Component */}
      <Dialog open={showModal} onClose={() => setShowModal(false)}>
        <DialogTitle>Select a Category</DialogTitle>
        <DialogContent>
          <Typography className="mb-4">
            Select an appropriate help category so we can match the right
            volunteers for your request.
          </Typography>

          <RadioGroup
            value={formData.category}
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
          >
            {suggestedCategories.map((category, index) => (
              <FormControlLabel
                key={index}
                value={category.name}
                control={<Radio />}
                label={category.name}
              />
            ))}
          </RadioGroup>
        </DialogContent>

        <DialogActions>
          <Button
            onClick={handleConfirmCategorySelection}
            variant="contained"
            color="primary"
          >
            Select
          </Button>
          <Button
            onClick={() => setShowModal(false)}
            color="primary"
            variant="contained"
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default HelpRequestForm;
