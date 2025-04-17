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
        toast.error(
          "Profanity detected. Please remove these word(s) : " +
            res.profanity +
            "  from Subject/Description and submit request again!",
          {
            position: "top-center", // You can customize the position
            autoClose: 2000, // Toast auto-closes after 2 seconds
            hideProgressBar: true, // Optional: Hide progress bar
          },
        );
      } else {
        // Proceed with submitting the request if no profanity is found

        await fetchPredictedCategories();
        if (formData.category == "General") {
          setShowModal(true);
        }
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
          toast.success(
            "Request submitted successfully! You will now be redirected to the dashboard.",
            {
              position: "top-center", // You can customize the position
              autoClose: 2000, // Toast auto-closes after 2 seconds
              hideProgressBar: true, // Optional: Hide progress bar
            },
          );

          // Redirect to the dashboard after a short delay
          setTimeout(() => {
            navigate("/dashboard");
          }, 2000);
        }
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
      setFilteredCategories(categories);
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
      setFilteredCategories(categories);
    } else {
      const filtered = categories.filter((category) =>
        category.name.toLowerCase().startsWith(searchTerm.toLowerCase()),
      );
      setFilteredCategories(filtered);
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

  const handleConfirmCategorySelection = async () => {
    const submissionData = {
      ...formData,
    };

    try {
      const response = await createRequest(submissionData);

      setShowModal(false);
      // Show the alert
      toast.success(
        "Request submitted successfully! You will now be redirected to the dashboard.",
        {
          position: "top-center", // You can customize the position
          autoClose: 2000, // Toast auto-closes after 2 seconds
          hideProgressBar: true, // Optional: Hide progress bar
        },
      );

      // Redirect to the dashboard after a short delay
      setTimeout(() => {
        navigate("/dashboard");
      }, 2000); // Wait 2 seconds before redirecting
    } catch (error) {
      console.error("Failed to submit request:", error);
      alert("Failed to submit request!");
    }
  };

  if (isLoading) return <div>Loading...</div>;
  return (
    <div className="">
      <ToastContainer />
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
              <label
                htmlFor="self"
                className="block mb-1 text-gray-700 font-medium"
              >
                {t("FOR_SELF")}
              </label>
              <select
                id="self"
                data-testid="dropdown"
                className="border border-gray-300 text-gray-700 rounded-lg p-2 w-full"
                onChange={(e) => setSelfFlag(e.target.value === "yes")}
                disabled
              >
                <option value="yes">{t("YES")}</option>
              </select>
            </div>

            {/* Lead Volunteer */}
            <div className="flex-1">
              <label
                htmlFor="lead_volunteer"
                className="block mb-1 text-gray-700 font-medium"
              >
                {t("Lead Volunteer")}
              </label>
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
                className="border p-2 w-full rounded-lg disabled:text-gray-400"
              />
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
            <div className="relative">
              <label
                htmlFor="category"
                className="block mb-2 font-medium text-gray-700"
              >
                {t("REQUEST_CATEGORY")}
              </label>
              <input
                type="text"
                id="category"
                value={formData.category}
                onChange={handleSearchInput}
                className="border border-gray-300 text-gray-700 rounded-lg p-2.5 w-full"
                onFocus={() => setShowDropdown(true)}
                onBlur={(e) => {
                  if (!dropdownRef.current?.contains(e.relatedTarget)) {
                    setShowDropdown(false);
                  }
                }}
              />
              {showDropdown && (
                <div
                  className="absolute z-10 bg-white border mt-1 rounded shadow-lg w-full overflow-y-auto"
                  style={{ maxHeight: "200px" }}
                  ref={dropdownRef}
                  tabIndex={0}
                >
                  {filteredCategories.map((category) => (
                    <div
                      key={category.id}
                      className="p-2 border-b cursor-pointer hover:bg-gray-100 relative"
                      onClick={() =>
                        !category.subcategories &&
                        handleCategoryClick(category.name)
                      }
                      onMouseEnter={() => setHoveredCategory(category)}
                      onMouseLeave={() => setHoveredCategory(null)}
                    >
                      {category.name}

                      {/* Show subcategories if the category is hovered and it has subcategories */}
                      {hoveredCategory === category &&
                        category.subcategories && (
                          <div className="bg-white border rounded shadow-lg p-2 z-20 mt-2">
                            {category.subcategories.map(
                              (subcategory, index) => (
                                <div
                                  key={index}
                                  className="cursor-pointer hover:bg-gray-200"
                                  onClick={() =>
                                    handleSubcategoryClick(subcategory)
                                  }
                                >
                                  {subcategory}
                                </div>
                              ),
                            )}
                          </div>
                        )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label
                htmlFor="requestType"
                className="block mb-2 font-medium text-gray-700"
              >
                {t("REQUEST_TYPE")}
              </label>
              <select
                id="requestType"
                className="border border-gray-300 text-gray-700 rounded-lg block w-full p-2.5"
                value={formData.request_type || "Remote"}
                onChange={(e) =>
                  setFormData({ ...formData, request_type: e.target.value })
                }
              >
                <option value="Remote">{t("REMOTE")}</option>
                <option value="In Person">{t("IN_PERSON")}</option>
              </select>
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
            <div>
              <label
                htmlFor="requestPriority"
                className="block mb-2 font-medium text-gray-700"
              >
                {t("Request Priority")}
              </label>
              <select
                id="requestPriority"
                className="border border-gray-300 text-gray-700 rounded-lg block w-full p-2.5"
                value={formData.priority || "MEDIUM"}
                onChange={(e) =>
                  setFormData({ ...formData, priority: e.target.value })
                }
              >
                <option value="LOW">{t("Low")}</option>
                <option value="MEDIUM">{t("Medium")}</option>
                <option value="HIGH">{t("High")}</option>
              </select>
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
      <Modal
        show={showModal}
        onSubmit={handleConfirmCategorySelection}
        onClose={() => setShowModal(false)}
      >
        <h2 className="text-xl font-bold mb-4">Select a Category</h2>

        {/* Message to the user */}
        <p className="mb-4 text-gray-700">
          Dear User, please fill in the category or select one of the
          recommended categories.
        </p>

        {/* Dropdown for selecting a category */}
        <select
          value={formData.category}
          onChange={(e) =>
            setFormData({ ...formData, category: e.target.value })
          }
          className="p-2 border rounded w-full"
        >
          {suggestedCategories.map((category, index) => (
            <option key={index} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </Modal>
    </div>
  );
};

export default HelpRequestForm;
