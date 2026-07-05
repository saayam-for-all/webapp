import { StandaloneSearchBox } from "@react-google-maps/api";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { IoMdInformationCircle } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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

// Country -> states/provinces map
const countryStatesMap = {
  "United States": [
    "Alabama",
    "Alaska",
    "Arizona",
    "Arkansas",
    "California",
    "Colorado",
    "Connecticut",
    "Delaware",
    "Florida",
    "Georgia",
    "Hawaii",
    "Idaho",
    "Illinois",
    "Indiana",
    "Iowa",
    "Kansas",
    "Kentucky",
    "Louisiana",
    "Maine",
    "Maryland",
    "Massachusetts",
    "Michigan",
    "Minnesota",
    "Mississippi",
    "Missouri",
    "Montana",
    "Nebraska",
    "Nevada",
    "New Hampshire",
    "New Jersey",
    "New Mexico",
    "New York",
    "North Carolina",
    "North Dakota",
    "Ohio",
    "Oklahoma",
    "Oregon",
    "Pennsylvania",
    "Rhode Island",
    "South Carolina",
    "South Dakota",
    "Tennessee",
    "Texas",
    "Utah",
    "Vermont",
    "Virginia",
    "Washington",
    "West Virginia",
    "Wisconsin",
    "Wyoming",
  ],
  India: [
    "Andhra Pradesh",
    "Arunachal Pradesh",
    "Assam",
    "Bihar",
    "Chhattisgarh",
    "Goa",
    "Gujarat",
    "Haryana",
    "Himachal Pradesh",
    "Jharkhand",
    "Karnataka",
    "Kerala",
    "Madhya Pradesh",
    "Maharashtra",
    "Manipur",
    "Meghalaya",
    "Mizoram",
    "Nagaland",
    "Odisha",
    "Punjab",
    "Rajasthan",
    "Sikkim",
    "Tamil Nadu",
    "Telangana",
    "Tripura",
    "Uttar Pradesh",
    "Uttarakhand",
    "West Bengal",
  ],
  Canada: [
    "Alberta",
    "British Columbia",
    "Manitoba",
    "New Brunswick",
    "Newfoundland and Labrador",
    "Northwest Territories",
    "Nova Scotia",
    "Nunavut",
    "Ontario",
    "Prince Edward Island",
    "Quebec",
    "Saskatchewan",
    "Yukon",
  ],
  Australia: [
    "Australian Capital Territory",
    "New South Wales",
    "Northern Territory",
    "Queensland",
    "South Australia",
    "Tasmania",
    "Victoria",
    "Western Australia",
  ],
  "United Kingdom": ["England", "Northern Ireland", "Scotland", "Wales"],
  Germany: [
    "Baden-Württemberg",
    "Bavaria",
    "Berlin",
    "Brandenburg",
    "Bremen",
    "Hamburg",
    "Hesse",
    "Lower Saxony",
    "Mecklenburg-Vorpommern",
    "North Rhine-Westphalia",
    "Rhineland-Palatinate",
    "Saarland",
    "Saxony",
    "Saxony-Anhalt",
    "Schleswig-Holstein",
    "Thuringia",
  ],
  Brazil: [
    "Acre",
    "Alagoas",
    "Amapá",
    "Amazonas",
    "Bahia",
    "Ceará",
    "Distrito Federal",
    "Espírito Santo",
    "Goiás",
    "Maranhão",
    "Mato Grosso",
    "Mato Grosso do Sul",
    "Minas Gerais",
    "Pará",
    "Paraíba",
    "Paraná",
    "Pernambuco",
    "Piauí",
    "Rio de Janeiro",
    "Rio Grande do Norte",
    "Rio Grande do Sul",
    "Rondônia",
    "Roraima",
    "Santa Catarina",
    "São Paulo",
    "Sergipe",
    "Tocantins",
  ],
  China: [
    "Anhui",
    "Beijing",
    "Chongqing",
    "Fujian",
    "Gansu",
    "Guangdong",
    "Guangxi",
    "Guizhou",
    "Hainan",
    "Hebei",
    "Heilongjiang",
    "Henan",
    "Hong Kong",
    "Hubei",
    "Hunan",
    "Inner Mongolia",
    "Jiangsu",
    "Jiangxi",
    "Jilin",
    "Liaoning",
    "Macau",
    "Ningxia",
    "Qinghai",
    "Shaanxi",
    "Shandong",
    "Shanghai",
    "Shanxi",
    "Sichuan",
    "Tianjin",
    "Tibet",
    "Xinjiang",
    "Yunnan",
    "Zhejiang",
  ],
  Mexico: [
    "Aguascalientes",
    "Baja California",
    "Baja California Sur",
    "Campeche",
    "Chiapas",
    "Chihuahua",
    "Ciudad de México",
    "Coahuila",
    "Colima",
    "Durango",
    "Guanajuato",
    "Guerrero",
    "Hidalgo",
    "Jalisco",
    "México",
    "Michoacán",
    "Morelos",
    "Nayarit",
    "Nuevo León",
    "Oaxaca",
    "Puebla",
    "Querétaro",
    "Quintana Roo",
    "San Luis Potosí",
    "Sinaloa",
    "Sonora",
    "Tabasco",
    "Tamaulipas",
    "Tlaxcala",
    "Veracruz",
    "Yucatán",
    "Zacatecas",
  ],
  France: [
    "Auvergne-Rhône-Alpes",
    "Bourgogne-Franche-Comté",
    "Bretagne",
    "Centre-Val de Loire",
    "Corse",
    "Grand Est",
    "Hauts-de-France",
    "Île-de-France",
    "Normandie",
    "Nouvelle-Aquitaine",
    "Occitanie",
    "Pays de la Loire",
    "Provence-Alpes-Côte d'Azur",
  ],
  Pakistan: [
    "Azad Kashmir",
    "Balochistan",
    "Gilgit-Baltistan",
    "Islamabad",
    "Khyber Pakhtunkhwa",
    "Punjab",
    "Sindh",
  ],
  Nigeria: [
    "Abia",
    "Adamawa",
    "Akwa Ibom",
    "Anambra",
    "Bauchi",
    "Bayelsa",
    "Benue",
    "Borno",
    "Cross River",
    "Delta",
    "Ebonyi",
    "Edo",
    "Ekiti",
    "Enugu",
    "FCT",
    "Gombe",
    "Imo",
    "Jigawa",
    "Kaduna",
    "Kano",
    "Katsina",
    "Kebbi",
    "Kogi",
    "Kwara",
    "Lagos",
    "Nasarawa",
    "Niger",
    "Ogun",
    "Ondo",
    "Osun",
    "Oyo",
    "Plateau",
    "Rivers",
    "Sokoto",
    "Taraba",
    "Yobe",
    "Zamfara",
  ],
};

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
  const [countryList, setCountryList] = useState([]);
  const [stateList, setStateList] = useState([]);
  const [activeTab, setActiveTab] = useState("details");

  const [showModal, setShowModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("General");
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [suggestedCategories, setSuggestedCategories] = useState([]);
  const [categoryConfirmed, setCategoryConfirmed] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
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
    lead_volunteer: "No",
    preferred_language: "English",
    category: "General",
    request_type: "Remote",
    is_calamity: false,
    location: "",
    subject: "",
    description: "",
    priority: "MEDIUM",
    // Address fields
    address_gender: "Select",
    address_line1: "",
    address_line2: "",
    zip_code: "",
    country: "",
    state: "",
  });

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: type === "checkbox" ? checked : value,
    }));
  };

  // Update state list when country changes
  useEffect(() => {
    if (formData.country) {
      setStateList(
        countryStatesMap[formData.country] || ["Province/State not listed"],
      );
      setFormData((prev) => ({ ...prev, state: "" }));
    } else {
      setStateList([]);
    }
  }, [formData.country]);

  const closeForm = () => {
    navigate("/dashboard");
  };

  const fetchPredictedCategories = async () => {
    if (formData.category !== "General") return;
    if (!formData.subject || !formData.description) return;
    try {
      const requestBody = {
        subject: formData.subject,
        description: formData.description,
      };
      const response = await predictCategories(requestBody);
      const formattedCategories = (response || []).map((category) => ({
        id: category.toLowerCase(),
        name: category,
      }));
      if (formattedCategories.length > 0) {
        setSuggestedCategories([
          { id: "general", name: "General" },
          ...formattedCategories,
        ]);
      } else {
        setSuggestedCategories([{ id: "general", name: "General" }]);
      }
    } catch (error) {
      console.error("Error fetching predicted categories:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const submissionData = { ...formData, location };
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
      } else {
        if (
          formData.category === "General" &&
          formData.subject.trim() !== "" &&
          formData.description.trim() !== "" &&
          !categoryConfirmed
        ) {
          await fetchPredictedCategories();
          setShowModal(true);
          return;
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
    const fetchLanguagesAndCountries = async () => {
      try {
        const response = await fetch("https://restcountries.com/v3.1/all");
        const data = await response.json();
        const languageSet = new Set();
        const countriesArr = [];
        data.forEach((country) => {
          if (country.languages) {
            Object.values(country.languages).forEach((lang) =>
              languageSet.add(lang),
            );
          }
          if (country.name?.common) {
            countriesArr.push(country.name.common);
          }
        });
        setLanguages(
          [...languageSet].sort().map((lang) => ({ value: lang, label: lang })),
        );
        setCountryList(countriesArr.sort());
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    dispatch(loadCategories());
    fetchLanguagesAndCountries();
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
    setFormData({ ...formData, category: searchTerm });
    if (searchTerm.trim() === "") {
      const general = categories.find((cat) => cat.name === "General");
      const others = categories.filter((cat) => cat.name !== "General");
      const sorted = others.sort((a, b) => a.name.localeCompare(b.name));
      if (general) sorted.push(general);
      setFilteredCategories(sorted);
    } else {
      const filtered = categories.filter((category) =>
        category.name.toLowerCase().startsWith(searchTerm.toLowerCase()),
      );
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
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCategoryClick = (categoryName) => {
    setFormData({ ...formData, category: categoryName });
    setShowDropdown(false);
    setHoveredCategory(null);
  };

  const handleSubcategoryClick = (subcategoryName) => {
    setFormData({ ...formData, category: subcategoryName });
    setShowDropdown(false);
    setHoveredCategory(null);
  };

  const handleConfirmCategorySelection = () => {
    const oldCategory = "General";
    const newCategory = formData.category;
    setCategoryConfirmed(true);
    setShowModal(false);
    if (oldCategory !== newCategory) {
      setSnackbar({
        open: true,
        message: `Category updated from "${oldCategory}" to "${newCategory}". Click Submit to continue.`,
        severity: "info",
      });
    }
  };

  // Tooltip component
  const Tooltip = ({ text }) => (
    <div className="relative group cursor-pointer">
      <div className="w-4 h-4 flex items-center justify-center rounded-full bg-gray-400 text-white text-xs font-bold">
        ?
      </div>
      <div className="absolute left-5 top-0 w-52 bg-gray-700 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10 pointer-events-none">
        {text}
      </div>
    </div>
  );

  const typeTooltipText =
    'Indicate how you\'d like help delivered: "Remote" for virtual support or "In Person" for onsite assistance.';
  const forSelfTooltipText =
    "Choose 'Yes' if you're submitting this request on your own behalf, or 'No' if you're requesting for someone else.";
  const leadVolunteerTooltipText =
    'Select "Yes" if you\'re the main volunteer coordinating this request.';
  const categoryTooltipText =
    "Choose the category that best describes your need (e.g., Medical, Food, Jobs). If you select General, please describe your need fully in the Description field.";
  const priorityTooltipText =
    "How urgent is this request? Low: Not time sensitive. Medium: Within a few days. High: Immediate support needed.";
  const calamityTooltipText =
    "Check this box if the request is related to a calamity or disaster.";

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
            type="button"
            className="text-blue-600 hover:text-blue-800 font-semibold text-lg flex items-center"
          >
            <span className="text-2xl mr-2">&lt;</span> Back to Home
          </button>
        </div>

        <div className="bg-white p-8 rounded-lg shadow-md border">
          <h1 className="text-2xl font-bold text-gray-800">
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

          {/* Tabs */}
          <div className="flex border-b border-gray-200 mb-6">
            <button
              type="button"
              onClick={() => setActiveTab("description")}
              className={`py-2 px-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === "description"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              {t("Description") || "Description"}{" "}
              <span className="text-red-500">*</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("details")}
              className={`py-2 px-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === "details"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              {t("Details") || "Details"}
            </button>
          </div>

          {/* Description Tab */}
          {activeTab === "description" && (
            <div>
              <div className="mt-3 grid grid-cols-2 gap-4">
                {/* Category */}
                <div className="flex-1 relative">
                  <div className="flex items-center gap-2 mb-1">
                    <label
                      htmlFor="category"
                      className="font-medium text-gray-700"
                    >
                      {t("REQUEST_CATEGORY")}
                    </label>
                    <Tooltip text={categoryTooltipText} />
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
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                      <HiChevronDown className="h-5 w-5 text-gray-600" />
                    </div>
                  </div>
                  {showDropdown && (
                    <div
                      className={`absolute z-30 bg-white border mt-1 rounded shadow-lg w-full flex${
                        hoveredCategory?.subcategories?.length > 0
                          ? ""
                          : " flex-col"
                      }`}
                      style={{
                        maxHeight: "240px",
                        minHeight: "120px",
                        overflow: "hidden",
                        zIndex: 30,
                      }}
                      ref={dropdownRef}
                      tabIndex={0}
                    >
                      <div
                        className={
                          hoveredCategory?.subcategories?.length > 0
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
                            onClick={() => {
                              if (!category.subcategories?.length) {
                                handleCategoryClick(category.name);
                              }
                            }}
                            onMouseEnter={() => setHoveredCategory(category)}
                          >
                            <span>{category.name}</span>
                            {category.subcategories?.length > 0 && (
                              <span className="ml-2 text-gray-400">{">"}</span>
                            )}
                          </div>
                        ))}
                      </div>
                      {hoveredCategory?.subcategories?.length > 0 && (
                        <>
                          <div className="w-px bg-gray-300 mx-1" />
                          <div
                            className="w-1/2 overflow-y-auto"
                            style={{ maxHeight: "240px" }}
                          >
                            {hoveredCategory.subcategories.map(
                              (subcategory, index) => (
                                <div
                                  key={index}
                                  className="cursor-pointer hover:bg-gray-200 p-2 bg-white"
                                  style={{
                                    borderTop:
                                      index !== 0
                                        ? "1px solid #e5e7eb"
                                        : "none",
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

                {/* Request Type */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <label
                      htmlFor="requestType"
                      className="font-medium text-gray-700"
                    >
                      {t("REQUEST_TYPE")}
                    </label>
                    <Tooltip text={typeTooltipText} />
                  </div>
                  <div className="relative">
                    <select
                      id="requestType"
                      value={formData.request_type}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          request_type: e.target.value,
                        })
                      }
                      className="block w-full appearance-none bg-white border border-gray-300 rounded-lg py-2 px-3 pr-8 text-gray-700 focus:outline-none"
                    >
                      <option value="Remote">{t("REMOTE")}</option>
                      <option value="In Person">{t("IN_PERSON")}</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                      <HiChevronDown className="h-5 w-5 text-gray-600" />
                    </div>
                  </div>
                </div>

                {/* Priority */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <label
                      htmlFor="requestPriority"
                      className="font-medium text-gray-700"
                    >
                      {t("Request Priority")}
                    </label>
                    <Tooltip text={priorityTooltipText} />
                  </div>
                  <div className="relative">
                    <select
                      id="requestPriority"
                      value={formData.priority || "MEDIUM"}
                      onChange={(e) =>
                        setFormData({ ...formData, priority: e.target.value })
                      }
                      className="block w-full appearance-none bg-white border border-gray-300 rounded-lg px-3 py-2 pr-8 text-gray-700 focus:outline-none"
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
            </div>
          )}

          {/* Details Tab */}
          {activeTab === "details" && (
            <div>
              {/* For Self + Lead Volunteer */}
              <div className="flex gap-4 mb-4" data-testid="parentDivOne">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <label
                      htmlFor="is_self"
                      className="text-gray-700 font-medium"
                    >
                      {t("FOR_SELF")}
                    </label>
                    <Tooltip text={forSelfTooltipText} />
                  </div>
                  <div className="relative">
                    <select
                      id="is_self"
                      value={formData.is_self}
                      onChange={handleChange}
                      className="block w-full appearance-none bg-white border border-gray-300 rounded-lg py-2 px-3 pr-8 text-gray-700 focus:outline-none"
                    >
                      <option value="yes">{t("YES") || "Yes"}</option>
                      <option value="other">Other</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                      <HiChevronDown className="h-5 w-5 text-gray-600" />
                    </div>
                  </div>
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <label
                      htmlFor="lead_volunteer"
                      className="text-gray-700 font-medium"
                    >
                      {t("Lead Volunteer")}
                    </label>
                    <Tooltip text={leadVolunteerTooltipText} />
                  </div>
                  {isEdit ? (
                    <input
                      type="text"
                      id="lead_volunteer"
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
                        value={formData.lead_volunteer}
                        onChange={handleChange}
                        className="block w-full appearance-none bg-white border border-gray-300 rounded-lg py-2 px-3 pr-8 text-gray-700 focus:outline-none"
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

              {/* Info box — shown when "Other" is selected */}
              {formData.is_self === "other" && (
                <div
                  className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4"
                  data-testid="parentDivTwo"
                >
                  <div className="flex items-center gap-2 mb-3 text-sm text-gray-600">
                    <IoMdInformationCircle
                      size={18}
                      className="text-blue-500 flex-shrink-0"
                    />
                    <span>
                      Please fill the details of the person you are submitting
                      the request for.
                    </span>
                  </div>

                  {/* First Name + Last Name */}
                  <div className="grid grid-cols-2 gap-4 mb-3">
                    <div>
                      <label
                        htmlFor="requester_first_name"
                        className="block text-gray-700 mb-1 font-medium text-sm"
                      >
                        {t("FIRST_NAME") || "First Name"}
                      </label>
                      <input
                        type="text"
                        id="requester_first_name"
                        value={formData.requester_first_name}
                        onChange={handleChange}
                        className="w-full rounded-lg border border-gray-300 py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="requester_last_name"
                        className="block text-gray-700 mb-1 font-medium text-sm"
                      >
                        {t("LAST_NAME") || "Last Name"}
                      </label>
                      <input
                        type="text"
                        id="requester_last_name"
                        value={formData.requester_last_name}
                        onChange={handleChange}
                        className="w-full rounded-lg border border-gray-300 py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div className="mb-3" data-testid="parentDivThree">
                    <label
                      htmlFor="email"
                      className="block text-gray-700 mb-1 font-medium text-sm"
                    >
                      {t("EMAIL") || "Email"}
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-gray-300 py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* Phone + Age */}
                  <div
                    className="grid grid-cols-2 gap-4 mb-3"
                    data-testid="parentDivFour"
                  >
                    <div>
                      <label
                        htmlFor="phone"
                        className="block text-gray-700 mb-1 font-medium text-sm"
                      >
                        {t("PHONE") || "Phone"}
                      </label>
                      <input
                        type="text"
                        id="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full rounded-lg border border-gray-300 py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="age"
                        className="block text-gray-700 mb-1 font-medium text-sm"
                      >
                        {t("AGE") || "Age"}
                      </label>
                      <input
                        type="number"
                        id="age"
                        value={formData.age}
                        onChange={handleChange}
                        className="w-full rounded-lg border border-gray-300 py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  {/* Gender + Preferred Language */}
                  <div
                    className="grid grid-cols-2 gap-4 mb-4"
                    data-testid="parentDivFive"
                  >
                    <div>
                      <label
                        htmlFor="gender"
                        className="block text-gray-700 mb-1 font-medium text-sm"
                      >
                        {t("GENDER") || "Gender"}
                      </label>
                      <select
                        id="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        className="block w-full appearance-none bg-white border border-gray-300 text-gray-700 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        {genderOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label
                        htmlFor="preferred_language"
                        className="block text-gray-700 mb-1 font-medium text-sm"
                      >
                        {t("PREFERRED_LANGUAGE") || "Preferred Language"}
                      </label>
                      <select
                        id="preferred_language"
                        value={formData.preferred_language}
                        onChange={handleChange}
                        className="block w-full appearance-none bg-white border border-gray-300 text-gray-700 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="English">English</option>
                        {languages.map((language) => (
                          <option key={language.value} value={language.value}>
                            {language.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* ── Address Section ── */}
                  <div className="border-t border-gray-200 pt-4">
                    <h3 className="text-gray-700 font-semibold text-sm mb-3">
                      Address Details
                    </h3>

                    {/* Address Line 1 */}
                    <div className="mb-3">
                      <label
                        htmlFor="address_line1"
                        className="block text-gray-700 mb-1 font-medium text-sm"
                      >
                        Address Line 1 <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="address_line1"
                        value={formData.address_line1}
                        onChange={handleChange}
                        placeholder="Street Name"
                        required
                        className="w-full rounded-lg border border-gray-300 py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    {/* Address Line 2 */}
                    <div className="mb-3">
                      <label
                        htmlFor="address_line2"
                        className="block text-gray-700 mb-1 font-medium text-sm"
                      >
                        Address Line 2
                      </label>
                      <input
                        type="text"
                        id="address_line2"
                        value={formData.address_line2}
                        onChange={handleChange}
                        placeholder="APT No."
                        className="w-full rounded-lg border border-gray-300 py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    {/* Zip Code + Country */}
                    <div className="grid grid-cols-2 gap-4 mb-3">
                      <div>
                        <label
                          htmlFor="zip_code"
                          className="block text-gray-700 mb-1 font-medium text-sm"
                        >
                          Zip Code <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          id="zip_code"
                          value={formData.zip_code}
                          onChange={handleChange}
                          placeholder="Enter the Zip Code"
                          required
                          className="w-full rounded-lg border border-gray-300 py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="country"
                          className="block text-gray-700 mb-1 font-medium text-sm"
                        >
                          Country <span className="text-red-500">*</span>
                        </label>
                        <select
                          id="country"
                          value={formData.country}
                          onChange={handleChange}
                          required
                          className="block w-full appearance-none bg-white border border-gray-300 text-gray-700 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">Select Country</option>
                          {countryList.map((c) => (
                            <option key={c} value={c}>
                              {c}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* State / Province */}
                    <div>
                      <label
                        htmlFor="state"
                        className="block text-gray-700 mb-1 font-medium text-sm"
                      >
                        State / Province <span className="text-red-500">*</span>
                      </label>
                      <select
                        id="state"
                        value={formData.state}
                        onChange={handleChange}
                        required
                        disabled={!formData.country}
                        className="block w-full appearance-none bg-white border border-gray-300 text-gray-700 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <option value="">
                          {formData.country
                            ? "Select State / Province"
                            : "Select a country first"}
                        </option>
                        {stateList.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  {/* ── End Address Section ── */}
                </div>
              )}

              {/* Type + Is Calamity */}
              <div className="flex items-start gap-6 mt-2">
                <div className="flex-1 max-w-xs">
                  <div className="flex items-center gap-2 mb-1">
                    <label
                      htmlFor="request_type"
                      className="text-gray-700 font-medium"
                    >
                      {t("Type") || "Type"}
                    </label>
                    <Tooltip text={typeTooltipText} />
                  </div>
                  <div className="relative">
                    <select
                      id="request_type"
                      value={formData.request_type}
                      onChange={handleChange}
                      className="block w-full appearance-none bg-white border border-gray-300 rounded-lg py-2 px-3 pr-8 text-gray-700 focus:outline-none"
                    >
                      <option value="Remote">{t("REMOTE") || "Remote"}</option>
                      <option value="In Person">
                        {t("IN_PERSON") || "In Person"}
                      </option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                      <HiChevronDown className="h-5 w-5 text-gray-600" />
                    </div>
                  </div>
                </div>

                <div className="mt-1">
                  <div className="flex items-center gap-2 mb-1">
                    <label className="text-gray-700 font-medium">
                      {t("Is Calamity?") || "Is Calamity?"}
                    </label>
                    <Tooltip text={calamityTooltipText} />
                  </div>
                  <input
                    type="checkbox"
                    id="is_calamity"
                    checked={formData.is_calamity}
                    onChange={handleChange}
                    className="w-4 h-4 mt-1 cursor-pointer border-gray-300 rounded"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Submit / Cancel */}
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

      {/* Category Modal */}
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
