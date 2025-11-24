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
// Popup modal for subcategory - Import ElderlySupport component
import ElderlySupport from "./Categories/ElderlySupport";
import usePlacesSearchBox from "./location/usePlacesSearchBox";
import { HiChevronDown } from "react-icons/hi";
import languagesData from "../../common/i18n/languagesData";
import { uploadRequestFile } from "../../services/requestServices";
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
  LinearProgress,
  IconButton,
  Box,
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

const MAX_FILES = 5;
const MAX_FILE_SIZE_BYTES = 2 * 1024 * 1024; // 2 MB
const ALLOWED_MIME_TYPES = ["image/png", "image/jpeg", "application/pdf"];

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
  const [enums, setEnums] = useState(null);
  // Popup modal for subcategory - State for Elderly Support popup modal
  const [showElderlySupportModal, setShowElderlySupportModal] = useState(false);
  const [selectedElderlySubcategory, setSelectedElderlySubcategory] =
    useState(null);
  const [elderlySupportData, setElderlySupportData] = useState({});
  // Popup modal for subcategory - Track which subcategory is currently saved
  const [savedSubcategoryId, setSavedSubcategoryId] = useState(null);
  // stores multiple file errors
  const [fileErrorMessages, setFileErrorMessages] = useState([]);

  // useEffect(() => {
  //   const fetchEnumsData = async () => {
  //     try {
  //       const data = await getEnums();
  //       // console.log("Enums API response:", data);

  //       setEnums(data);
  //     } catch (error) {
  //       console.error("Failed to fetch enums:", error);
  //     }
  //   };

  //   fetchEnumsData();
  // }, []);

  useEffect(() => {
    const storedEnums = localStorage.getItem("enums");
    if (storedEnums) {
      setEnums(JSON.parse(storedEnums));
    } else {
      console.warn("Enums not found in localStorage, please re-login.");
    }
  }, []);

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
  const fileInputRef = useRef(null);

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
    request_type: "REMOTE",
    location: "",
    subject: "",
    description: "",
    priority: "MEDIUM",
  });

  // FILE UPLOAD STATE
  // attachedFiles: array of File objects selected by user (not yet uploaded)
  const [attachedFiles, setAttachedFiles] = useState([]);
  // uploadProgress: { fileId: progressNumber (0-100) }
  const [uploadProgress, setUploadProgress] = useState({});
  // uploadedFilesInfo: [{ name, size, fileUrl }]
  const [uploadedFilesInfo, setUploadedFilesInfo] = useState([]);
  const [showFilesDialog, setShowFilesDialog] = useState(false);
  const [isUploadingFiles, setIsUploadingFiles] = useState(false);

  // Restore request for edit
  useEffect(() => {
    if (id && data) {
      const requestData = data.body?.find((item) => item.id === id);
      setFormData({
        category: requestData.category,
        description: requestData.description,
        subject: requestData.subject,
        ...requestData,
      });

      // If editing and attachments present in requestData, show them as uploadedFilesInfo
      if (requestData.attachments && Array.isArray(requestData.attachments)) {
        setUploadedFilesInfo(
          requestData.attachments.map((url, idx) => ({
            name: `Attachment-${idx + 1}`,
            size: 0,
            fileUrl: url,
          })),
        );
      }
    }
  }, [data, id]);

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

  // handleChange
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const closeForm = () => {
    navigate("/dashboard");
  };

  // Categories fetch & languages logic (kept same as original, slight tweaks)
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

    // Fetch categories from localStorage first, then API if not already fetched
    const fetchCategoriesData = async () => {
      if (!categoriesFetched) {
        // Check localStorage first (similar to enums)
        const storedCategories = localStorage.getItem("categories");
        if (storedCategories) {
          try {
            const validCategories = JSON.parse(storedCategories);
            dispatch(loadCategories(validCategories));
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
          // Store in localStorage for future use
          localStorage.setItem("categories", JSON.stringify(validCategories));
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

  // Resolve category label function
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

  // Sort & filtered categories effect
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

  // Popup modal for subcategory - Handle subcategory click, check if Elderly Support
  const handleSubcategoryClick = (
    subcategoryId,
    subcategoryName,
    parentCategoryName,
  ) => {
    // Popup modal for subcategory - Check if this is an Elderly Support subcategory
    if (
      parentCategoryName === "ELDERLY_SUPPORT" ||
      hoveredCategory?.catName === "ELDERLY_SUPPORT"
    ) {
      // Popup modal for subcategory - Check if another subcategory is already saved
      if (savedSubcategoryId && savedSubcategoryId !== subcategoryId) {
        // Popup modal for subcategory - Show warning snackbar
        setSnackbar({
          open: true,
          message:
            "Only one subcategory can be saved per request. Please delete the existing subcategory data first to select another one.",
          severity: "warning",
        });
        return;
      }

      setSelectedElderlySubcategory({
        id: subcategoryId,
        name: subcategoryName,
      });
      setShowElderlySupportModal(true);
      // Popup modal for subcategory - Don't close dropdown yet, wait for save
    } else {
      // Popup modal for subcategory - For other categories, proceed normally
      setFormData({
        ...formData,
        category: subcategoryId,
      });
      setShowDropdown(false);
      setHoveredCategory(null);
    }
  };

  // Popup modal for subcategory - Handle save from ElderlySupport modal
  const handleElderlySupportSave = (data, subcategory) => {
    // Popup modal for subcategory - Check if another subcategory is already saved
    if (savedSubcategoryId && savedSubcategoryId !== subcategory.id) {
      // Popup modal for subcategory - Show warning snackbar
      setSnackbar({
        open: true,
        message:
          "Only one subcategory can be saved per request. Please delete the existing subcategory data first to select another one.",
        severity: "warning",
      });
      return;
    }

    // Popup modal for subcategory - Store the data with the subcategory ID as key
    setElderlySupportData((prev) => ({
      ...prev,
      [subcategory.id]: data,
    }));

    // Popup modal for subcategory - Track saved subcategory
    setSavedSubcategoryId(subcategory.id);

    // Popup modal for subcategory - Set the category in formData
    setFormData({
      ...formData,
      category: subcategory.id,
    });

    // Popup modal for subcategory - Close dropdown and modal
    setShowDropdown(false);
    setHoveredCategory(null);

    // Popup modal for subcategory - You can also log or send this data to your backend here
    console.log("Elderly Support Data Saved:", {
      subcategory: subcategory.name,
      data: data,
    });
  };

  // Popup modal for subcategory - Handle delete from ElderlySupport modal
  const handleElderlySupportDelete = (subcategoryId) => {
    // Popup modal for subcategory - Remove the data
    setElderlySupportData((prev) => {
      const newData = { ...prev };
      delete newData[subcategoryId];
      return newData;
    });

    // Popup modal for subcategory - Clear saved subcategory if it matches
    if (savedSubcategoryId === subcategoryId) {
      setSavedSubcategoryId(null);
      // Popup modal for subcategory - Reset category in formData
      setFormData({
        ...formData,
        category: "",
      });
    }

    // Popup modal for subcategory - Close modal
    setShowElderlySupportModal(false);
    setSelectedElderlySubcategory(null);
  };

  // Popup modal for subcategory - Handle close from ElderlySupport modal
  const handleElderlySupportClose = () => {
    setShowElderlySupportModal(false);
    setSelectedElderlySubcategory(null);
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

  // ---------- FILE UPLOAD HANDLERS ----------

  // Validate a single file
  const validateFile = (file) => {
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return {
        ok: false,
        code: 2034,
        message: `${file.name} is not an allowed format. Please select PNG, JPG, JPEG, or PDF.`,
      };
    }
    if (file.size > MAX_FILE_SIZE_BYTES) {
      return {
        ok: false,
        code: 2035,
        message: `${file.name} exceeds the 2MB size limit. Please select a smaller file.`,
      };
    }
    return { ok: true };
  };

  // When user picks files from the hidden input (selection only, not uploaded yet)
  const handleFileSelection = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // reset previous file errors
    setFileErrorMessages([]);

    // enforce total count
    if (attachedFiles.length + files.length > MAX_FILES) {
      setFileErrorMessages([
        t(
          "SAAYAM-2036: You can only attach up to {{max}} files (including already attached files). Please try again.",
          { max: MAX_FILES },
        ),
      ]);
      return;
    }

    const validated = [];
    const errors = [];

    for (const file of files) {
      //prevent duplicate attachments
      const isDuplicate = attachedFiles.some(
        (f) =>
          f.name === file.name &&
          f.size === file.size &&
          f.lastModified === file.lastModified,
      );
      //duplicate check
      if (isDuplicate) {
        errors.push(
          t(
            "SAAYAM-2037: The file '{{fileName}}' is already attached. Please choose a different file.",
            { fileName: file.name },
          ),
        );
        continue;
      }

      const v = validateFile(file);
      if (!v.ok) {
        errors.push(t(`SAAYAM-${v.code}: ${v.message}`));
        continue; // skip invalid file
      }

      validated.push(file);
    }

    // show all errors
    if (errors.length > 0) {
      setFileErrorMessages(errors);
    }

    if (validated.length === 0) return;

    setAttachedFiles((prev) => [...prev, ...validated]);
    e.target.value = "";
  };

  const removeAttachedFile = (index) => {
    setAttachedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const removeUploadedFile = (index) => {
    setUploadedFilesInfo((prev) => prev.filter((_, i) => i !== index));
  };

  // Format long file names (keep first 45 chars + extension)
  const formatFileName = (fileName) => {
    const maxLen = 43;
    const dotIndex = fileName.lastIndexOf(".");
    const ext = dotIndex !== -1 ? fileName.slice(dotIndex) : "";
    const base = dotIndex !== -1 ? fileName.slice(0, dotIndex) : fileName;

    if (base.length > maxLen) {
      return base.slice(0, maxLen) + "..." + ext;
    }

    return fileName;
  };

  // Format file size into KB/MB
  const formatFileSize = (bytes) => {
    if (bytes >= 1024 * 1024) {
      return (bytes / (1024 * 1024)).toFixed(2) + " MB";
    }
    return (bytes / 1024).toFixed(2) + " KB";
  };

  // Upload single file to backend and return the file URL
  const uploadSingleFile = async (file, index) => {
    return new Promise(async (resolve, reject) => {
      try {
        // Upload using axios interceptor (requestServices.js)
        const res = await uploadRequestFile(file);

        // assume response contains { fileUrl: "..." } or { url: "..." } - adapt if different
        const fileUrl = res?.fileUrl || res?.url || res?.fileUrl?.[0] || null;

        if (!fileUrl) {
          // Backend didn't return expected URL
          console.warn("Upload response:", res);
          reject(new Error("Upload failed - no file URL returned"));
          return;
        }

        // mark progress as 100%
        setUploadProgress((prev) => ({ ...prev, [file.name || index]: 100 }));

        resolve(fileUrl);
      } catch (err) {
        console.error("Upload error for file:", file.name, err);
        setUploadProgress((prev) => ({ ...prev, [file.name || index]: 0 }));
        reject(err);
      }
    });
  };

  // Upload all attached files (called during submit)
  const uploadAllAttachedFiles = async () => {
    if (!attachedFiles || attachedFiles.length === 0) return [];

    setIsUploadingFiles(true);
    setUploadProgress({});
    const uploadedUrls = [];
    const uploadedInfo = [];

    for (let i = 0; i < attachedFiles.length; i++) {
      const file = attachedFiles[i];
      try {
        const url = await uploadSingleFile(file, i);
        uploadedUrls.push(url);
        uploadedInfo.push({
          name: file.name,
          size: file.size,
          fileUrl: url,
        });
      } catch (err) {
        // If one file fails, show error but continue uploading others (you can change to abort instead)
        setSnackbar({
          open: true,
          message: `Failed to upload ${file.name}. Please try again.`,
          severity: "error",
        });
      }
    }

    setIsUploadingFiles(false);
    // append to uploadedFilesInfo (persist uploaded results)
    setUploadedFilesInfo((prev) => [...prev, ...uploadedInfo]);
    // clear attachedFiles since they are uploaded now (but only if you want to clear them)
    // We will clear them so UI shows uploadedFilesInfo instead
    setAttachedFiles([]);
    return uploadedUrls;
  };

  // ---------- SUBMIT HANDLER (modified to upload files before creating request) ----------
  const handleSubmit = async (e) => {
    e.preventDefault();

    const submissionData = {
      ...formData,
      location,
    };

    try {
      const res = await checkProfanity({
        subject: formData.subject,
        description: formData.description,
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

      if (
        formData.category === "General" &&
        formData.subject.trim() !== "" &&
        formData.description.trim() !== "" &&
        !categoryConfirmed
      ) {
        await fetchPredictedCategories();
        setShowModal(true);
        return; // Don’t submit yet
      }

      // If there are attached files (selected but not yet uploaded), upload them first
      // IMPORTANT: This uploads each file individually so we can show per-file progress bars
      let uploadedFileUrls = [];

      // If user selected new files (attachedFiles) -> upload them
      if (attachedFiles.length > 0) {
        const urls = await uploadAllAttachedFiles();
        uploadedFileUrls = uploadedFileUrls.concat(urls);
      }

      // Also include previously uploaded files (uploadedFilesInfo)
      if (uploadedFilesInfo.length > 0) {
        const prevUrls = uploadedFilesInfo
          .map((f) => f.fileUrl)
          .filter(Boolean);
        uploadedFileUrls = [...uploadedFileUrls, ...prevUrls];
      }

      // include attachments in submission payload (if any)
      if (uploadedFileUrls.length > 0) {
        submissionData.attachments = uploadedFileUrls;
      }

      // Call createRequest with attachments included
      const response = await createRequest(submissionData);

      // success flow (mimic original)
      setSnackbar({
        open: true,
        message: "Help Request submitted successfully!",
        severity: "success",
      });

      setTimeout(() => {
        navigate("/dashboard", {
          state: {
            successMessage:
              "New Request #REQ-00-000-000-00011 submitted successfully!",
          },
        });
      }, 1200);
    } catch (error) {
      console.error("Failed to process request:", error);
      setSnackbar({
        open: true,
        message: "Failed to submit request!",
        severity: "error",
      });
    }
  };

  // ---------- RENDER ----------
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
                  id="request_for"
                  value={formData.request_for || ""}
                  className="appearance-none bg-white border p-2 w-full rounded-lg text-gray-700"
                  onChange={(e) => {
                    const selected = e.target.value;
                    setFormData({ ...formData, request_for: selected });
                    setSelfFlag(selected === enums?.requestFor?.[0]); // "SELF" means true, "OTHER" means false
                  }}
                >
                  {enums?.requestFor &&
                    Object.values(enums.requestFor).map((val) => (
                      <option key={val} value={val}>
                        {t(`enums:requestFor.${val}`, val)}
                      </option>
                    ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                  <HiChevronDown className="h-5 w-5 text-gray-600" />
                </div>
              </div>
            </div>

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

          {/* Category + Request Type + Priority (kept same) */}
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
                                  // Popup modal for subcategory - Pass subcategory details to handler
                                  handleSubcategoryClick(
                                    subcategory.catId,
                                    subcategory.catName,
                                    hoveredCategory.catName,
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
                  value={formData.request_type || "REMOTE"}
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
                  {enums?.requestType &&
                    Object.values(enums.requestType).map((val) => (
                      <option key={val} value={val}>
                        {t(`enums:requestType.${val}`, val)}
                      </option>
                    ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                  <HiChevronDown className="h-5 w-5 text-gray-600" />
                </div>
              </div>
              {formData.request_type === "INPERSON" && (
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
                  value={formData.priority || enums?.requestPriority?.[1]}
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
                  {enums?.requestPriority &&
                    Object.values(enums.requestPriority).map((val) => (
                      <option key={val} value={val}>
                        {t(`enums:requestPriority.${val}`, val)}
                      </option>
                    ))}
                </select>

                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                  <HiChevronDown className="h-5 w-5 text-gray-600" />
                </div>
              </div>
            </div>
          </div>
          <div className="mt-3" data-testid="parentDivSix">
            {formData.category === "Jobs" && <JobsCategory />}
            {formData.category === "Housing" && <HousingCategory />}
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

          {/* Description + Attach files icon */}
          <div className="mt-3" data-testid="parentDivSeven">
            <div className="flex items-center justify-between">
              <label
                htmlFor="description"
                className="block text-gray-700 font-medium mb-2 flex items-center gap-2"
              >
                {t("DESCRIPTION")}
                <span className="text-red-500 m-1">*</span>(
                {t("MAX_CHARACTERS", { count: 500 })})
              </label>

              {/* FILE ICON + COUNT COMBINED (Right-Aligned Box with Tooltip) */}
              <div className="relative group">
                {/* Unified Outline Box */}
                <div
                  className={`flex items-center gap-2 border border-gray-300 rounded-lg bg-white shadow-sm px-1 py-1 cursor-pointer select-none`}
                  onClick={() => {
                    if (
                      attachedFiles.length + uploadedFilesInfo.length >=
                      MAX_FILES
                    )
                      return;
                    document.getElementById("fileInput").click();
                  }}
                >
                  {/* Paperclip Icon */}
                  <div
                    className={`
                          flex items-center justify-center px-1 py-1 rounded-md
                          ${
                            attachedFiles.length + uploadedFilesInfo.length >=
                            MAX_FILES
                              ? "bg-gray-200 opacity-60 cursor-not-allowed"
                              : "bg-gray-100 hover:bg-gray-200"
                          }
                      `}
                  >
                    📎
                  </div>

                  {/* File count text (no inner borders now) */}
                  {(attachedFiles.length > 0 ||
                    uploadedFilesInfo.length > 0) && (
                    <span
                      className="text-sm text-gray-700 hover:bg-gray-200 rounded px-1 py-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowFilesDialog(true);
                      }}
                    >
                      {attachedFiles.length + uploadedFilesInfo.length}{" "}
                      {attachedFiles.length + uploadedFilesInfo.length === 1
                        ? "file attached"
                        : "files attached"}
                    </span>
                  )}
                </div>
                {/* Tooltip for errors */}
                {fileErrorMessages.length > 0 && (
                  <div className="absolute right-0 top-12 w-64 max-w-[16rem] text-red-500 text-xs rounded py-2 px-3 shadow-lg z-50 break-words whitespace-normal overflow-hidden">
                    {fileErrorMessages.map((msg, idx) => (
                      <div key={idx}>{msg}</div>
                    ))}
                  </div>
                )}
                {/* Tooltip */}
                <div className="absolute -top-20 left-1 w-52 bg-gray-700 text-white text-xs rounded py-2 px-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity duration-200 z-10 shadow-lg">
                  {attachedFiles.length + uploadedFilesInfo.length >=
                  MAX_FILES ? (
                    <>
                      <strong>You already attached 5 files.</strong>
                      <br />
                      Please remove a file to attach more.
                    </>
                  ) : (
                    <>
                      <strong>Attach Files</strong>
                      <br />
                      Up to <b>5 files</b> allowed.
                      <br />
                      Accepted: PNG, JPG, JPEG, PDF
                      <br />
                      Max size: <b>2MB each</b>
                    </>
                  )}
                </div>
              </div>
            </div>

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

            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              id="fileInput"
              type="file"
              accept=".png,.jpg,.jpeg,.pdf"
              multiple
              hidden
              onChange={handleFileSelection}
            />

            {/*/!* Show list of newly selected (not uploaded yet) files inline *!/*/}
            {/*{attachedFiles.length > 0 && (*/}
            {/*    <div className="mt-2 border rounded p-2 bg-gray-50">*/}
            {/*      <div className="flex items-center justify-between">*/}
            {/*        <strong>Files to upload:</strong>*/}
            {/*        <span className="text-sm text-gray-600">*/}
            {/*        {attachedFiles.length}/{MAX_FILES}*/}
            {/*      </span>*/}
            {/*      </div>*/}
            {/*      <ul className="mt-2">*/}
            {/*        {attachedFiles.map((file, idx) => (*/}
            {/*            <li*/}
            {/*                key={file.name + idx}*/}
            {/*                className="flex items-center justify-between text-sm py-1"*/}
            {/*            >*/}
            {/*              <div>*/}
            {/*                {file.name} ({(file.size / 1024).toFixed(1)} KB)*/}
            {/*              </div>*/}
            {/*              <div className="flex items-center gap-2">*/}
            {/*                <button*/}
            {/*                    type="button"*/}
            {/*                    className="text-sm text-red-600"*/}
            {/*                    onClick={() => removeAttachedFile(idx)}*/}
            {/*                >*/}
            {/*                  Remove*/}
            {/*                </button>*/}
            {/*              </div>*/}
            {/*            </li>*/}
            {/*        ))}*/}
            {/*      </ul>*/}
            {/*    </div>*/}
            {/*)}*/}

            {/*/!* Show uploaded files (from previous uploads) *!/*/}
            {/*{uploadedFilesInfo.length > 0 && (*/}
            {/*    <div className="mt-2 border rounded p-2 bg-gray-50">*/}
            {/*      <div className="flex items-center justify-between">*/}
            {/*        <strong>Uploaded files:</strong>*/}
            {/*      </div>*/}
            {/*      <ul className="mt-2">*/}
            {/*        {uploadedFilesInfo.map((f, idx) => (*/}
            {/*            <li*/}
            {/*                key={f.fileUrl || f.name + idx}*/}
            {/*                className="flex items-center justify-between text-sm py-1"*/}
            {/*            >*/}
            {/*              <div>*/}
            {/*                <a*/}
            {/*                    href={f.fileUrl}*/}
            {/*                    target="_blank"*/}
            {/*                    rel="noreferrer"*/}
            {/*                    className="underline"*/}
            {/*                >*/}
            {/*                  {f.name}*/}
            {/*                </a>{" "}*/}
            {/*                {f.size ? `(${(f.size / 1024).toFixed(1)} KB)` : ""}*/}
            {/*              </div>*/}
            {/*              <div className="flex items-center gap-2">*/}
            {/*                <button*/}
            {/*                    type="button"*/}
            {/*                    className="text-sm text-red-600"*/}
            {/*                    onClick={() => removeUploadedFile(idx)}*/}
            {/*                >*/}
            {/*                  Remove*/}
            {/*                </button>*/}
            {/*              </div>*/}
            {/*            </li>*/}
            {/*        ))}*/}
            {/*      </ul>*/}
            {/*    </div>*/}
            {/*)}*/}

            {/* Per-file upload progress indicators (when uploading) */}
            {isUploadingFiles && Object.keys(uploadProgress).length > 0 && (
              <div className="mt-3">
                <Typography variant="subtitle2">Uploading files...</Typography>
                <div className="space-y-2 mt-2">
                  {Object.keys(uploadProgress).map((key) => (
                    <Box key={key} sx={{ width: "100%" }}>
                      <Typography variant="body2" sx={{ fontSize: 12 }}>
                        {key}
                      </Typography>
                      <LinearProgress
                        variant="determinate"
                        value={uploadProgress[key] || 0}
                      />
                    </Box>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Submit buttons */}
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
      {/* Popup modal for subcategory - Elderly Support Modal Component */}
      <ElderlySupport
        isOpen={showElderlySupportModal}
        onClose={handleElderlySupportClose}
        onSave={handleElderlySupportSave}
        onDelete={handleElderlySupportDelete}
        selectedSubcategory={selectedElderlySubcategory}
        existingSubcategoryId={savedSubcategoryId}
        initialData={
          selectedElderlySubcategory
            ? elderlySupportData[selectedElderlySubcategory.id] || null
            : null
        }
        languages={languages}
        genderOptions={genderOptions}
      />

      {/* Files dialog - shows both attached (not yet uploaded) & uploaded files */}
      <Dialog
        open={showFilesDialog}
        onClose={() => setShowFilesDialog(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Attached Files</DialogTitle>
        <DialogContent>
          <Typography variant="body2" gutterBottom>
            You can attach up to {MAX_FILES} files (PNG, JPG, JPEG, PDF). Max
            size 2MB each.
          </Typography>

          <div className="mt-2">
            {attachedFiles.length === 0 && uploadedFilesInfo.length === 0 && (
              <Typography variant="body2">No files attached.</Typography>
            )}

            {attachedFiles.length > 0 && (
              <div className="mt-2 border rounded p-2 bg-gray-50">
                <div className="flex items-center justify-between">
                  <strong>Files to be uploaded:</strong>
                  <span className="text-sm text-gray-600">
                    {attachedFiles.length}/{MAX_FILES}
                  </span>
                </div>

                <ul className="mt-2">
                  {attachedFiles.map((f, i) => (
                    <li
                      key={f.name + i}
                      className="flex items-center justify-between text-sm py-1"
                    >
                      <div>
                        <span title={f.name}>{formatFileName(f.name)}</span>
                        {" — "}
                        {formatFileSize(f.size)}
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600"
                          onClick={() => removeAttachedFile(i)}
                        >
                          Remove
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/*{uploadedFilesInfo.length > 0 && (*/}
            {/*    <>*/}
            {/*      <Typography variant="subtitle2" className="mt-2">*/}
            {/*        Uploaded files:*/}
            {/*      </Typography>*/}
            {/*      <ul>*/}
            {/*        {uploadedFilesInfo.map((f, i) => (*/}
            {/*            <li key={f.fileUrl || f.name + i} className="py-1 flex items-center justify-between">*/}
            {/*              <div>*/}
            {/*                <a href={f.fileUrl} target="_blank" rel="noreferrer">*/}
            {/*                  {f.name}*/}
            {/*                </a>{" "}*/}
            {/*                {f.size ? ` — ${formatFileSize(f.size)}` : ""}*/}
            {/*              </div>*/}
            {/*              <div>*/}
            {/*                <Button size="small" onClick={() => removeUploadedFile(i)}>*/}
            {/*                  Remove*/}
            {/*                </Button>*/}
            {/*              </div>*/}
            {/*            </li>*/}
            {/*        ))}*/}
            {/*      </ul>*/}
            {/*    </>*/}
            {/*)}*/}
          </div>
        </DialogContent>
        <div className="flex items-center justify-center mt-4">
          <button
            type="button"
            className="bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600"
            onClick={() => setShowFilesDialog(false)}
          >
            Close
          </button>
        </div>
      </Dialog>
    </div>
  );
};

export default HelpRequestForm;
