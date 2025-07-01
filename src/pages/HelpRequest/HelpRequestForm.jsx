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
} from "../../services/requestServices";
import HousingCategory from "./Categories/HousingCategory";
import JobsCategory from "./Categories/JobCategory";
import usePlacesSearchBox from "./location/usePlacesSearchBox";
import { HiChevronDown } from "react-icons/hi";
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
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { categories } = useSelector((state) => state.request);
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

        // toast.error(
        //   "Profanity detected. Please remove these word(s) : " +
        //     res.profanity +
        //     "  from Subject/Description and submit request again!",
        //   {
        //     position: "top-center", // You can customize the position
        //     autoClose: 2000, // Toast auto-closes after 2 seconds
        //     hideProgressBar: true, // Optional: Hide progress bar
        //   },
        // );
      }
      // Proceed with submitting the request if no profanity is found

      // const response = await axios.post(
      //   "https://a9g3p46u59.execute-api.us-east-1.amazonaws.com/saayam/dev/requests/v0.0.1/help-request",
      //   submissionData,
      //   {
      //     headers: {
      //       "Content-Type": "application/json",
      //       Authorization: `Bearer ${token}`,
      //     },
      //   }
      // );
      else {
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

        const response = await createRequest(submissionData);

        setTimeout(() => {
          navigate("/dashboard", {
            state: {
              successMessage:
                "New Request #REQ-00-000-000-00011 submitted successfully!",
            },
          });
        }, 2000);
      }
    } catch (error) {
      console.error("Failed to process request:", error);
      alert("Failed to submit request!");
    }
  };
  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        const response = await fetch("https://restcountries.com/v3.1/all");
        const data = await response.json();
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
        console.error("Error fetching languages:", error);
      }
    };
    dispatch(loadCategories());
    fetchLanguages();
  }, [dispatch]);

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

  useEffect(() => {
    if (categories && categories.length > 0) {
      // Sort categories alphabetically by name, but keep 'General' last
      const general = categories.find((cat) => cat.name === "General");
      const others = categories.filter((cat) => cat.name !== "General");
      const sorted = others.sort((a, b) => a.name.localeCompare(b.name));
      if (general) sorted.push(general);
      setFilteredCategories(sorted);
    }
  }, [categories]);

  const handleSearchInput = (e) => {
    const searchTerm = e.target.value;
    setSearchInput(searchTerm);
    setFormData({
      ...formData,
      category: searchTerm,
    });

    if (searchTerm.trim() === "") {
      // Sort categories alphabetically by name, keep 'General' last
      const general = categories.find((cat) => cat.name === "General");
      const others = categories.filter((cat) => cat.name !== "General");
      const sorted = others.sort((a, b) => a.name.localeCompare(b.name));
      if (general) sorted.push(general);
      setFilteredCategories(sorted);
    } else {
      const filtered = categories.filter((category) =>
        category.name.toLowerCase().startsWith(searchTerm.toLowerCase()),
      );
      // Sort filtered categories alphabetically, keep 'General' last if present
      const general = filtered.find((cat) => cat.name === "General");
      const others = filtered.filter((cat) => cat.name !== "General");
      const sorted = others.sort((a, b) => a.name.localeCompare(b.name));
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

  const handleCategoryClick = (categoryName) => {
    // setSelectedCategory(categoryName);
    //setSearchInput(categoryName);
    setFormData({
      ...formData,
      category: categoryName,
    });
    setShowDropdown(false);
    setHoveredCategory(null);
  };

  const handleSubcategoryClick = (subcategoryName) => {
    // setSelectedCategory(subcategoryName);
    //setSearchInput(subcategoryName);
    setFormData({
      ...formData,
      category: subcategoryName,
    });
    setShowDropdown(false);
    setHoveredCategory(null);
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
            onClick={() => navigate("/")}
            className="text-blue-600 hover:text-blue-800 font-semibold text-lg flex items-center"
          >
            <span className="text-2xl mr-2">&lt;</span> Back to Home
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
              <select
                id="self"
                data-testid="dropdown"
                className="appearance-none bg-white border p-2 w-full rounded-lg text-gray-700"
                onChange={(e) => setSelfFlag(e.target.value === "yes")}
                disabled
              >
                <option value="yes">{t("YES")}</option>
              </select>
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
          {/*
         Temporarily commented out as MVP only allows for self requests
         {!selfFlag && (
           <div className="mt-3" data-testid="parentDivTwo">
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
                   className="border border-gray-300 text-gray-700 rounded-lg p-2 w-full"
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
                   id="language"
                   value={formData.language}
                   onChange={handleChange}
                   className="border border-gray-300 text-gray-700 rounded-lg p-2 w-full"
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
         )} */}
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
                  value={
                    filteredCategories.find(
                      (cat) => cat.id === formData.category,
                    )?.name || formData.category
                  }
                  onChange={handleSearchInput}
                  className="border border-gray-300 text-gray-700 rounded-lg p-2.5 w-full appearance-none"
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
                    hoveredCategory.subcategories &&
                    hoveredCategory.subcategories.length > 0
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
                      hoveredCategory.subcategories &&
                      hoveredCategory.subcategories.length > 0
                        ? "w-1/2 overflow-y-auto"
                        : "w-full overflow-y-auto"
                    }
                    style={{ maxHeight: "240px" }}
                  >
                    {filteredCategories.map((category) => (
                      <div
                        key={category.id}
                        className={`p-2 cursor-pointer hover:bg-gray-100 bg-white flex items-center justify-between ${
                          hoveredCategory?.id === category.id
                            ? "font-semibold bg-gray-50"
                            : ""
                        }`}
                        style={{ background: "#fff" }}
                        onClick={(e) => {
                          if (
                            !category.subcategories ||
                            category.subcategories.length === 0
                          ) {
                            handleCategoryClick(category.name);
                          }
                        }}
                        onMouseEnter={() => setHoveredCategory(category)}
                      >
                        <span>{category.name}</span>
                        {/* Show chevron if subcategories exist */}
                        {category.subcategories &&
                          category.subcategories.length > 0 && (
                            <span className="ml-2 text-gray-400">&gt;</span>
                          )}
                      </div>
                    ))}
                  </div>
                  {/* Only show subcategories column if there are subcategories */}
                  {hoveredCategory &&
                    hoveredCategory.subcategories &&
                    hoveredCategory.subcategories.length > 0 && (
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
                          {hoveredCategory.subcategories.map(
                            (subcategory, index) => (
                              <div
                                key={index}
                                className={`cursor-pointer hover:bg-gray-200 p-2 bg-white${
                                  index !==
                                  hoveredCategory.subcategories.length - 1
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
                                  handleSubcategoryClick(subcategory);
                                }}
                              >
                                {subcategory}
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
            </div>

            <div className="flex-1">
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

            {formData.request_type === "In Person" && (
              <div>
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
