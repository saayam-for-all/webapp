import { StandaloneSearchBox } from "@react-google-maps/api";
import React, { useEffect, useRef, useState } from "react"; //added for testing
import { useTranslation } from "react-i18next";
import { IoMdInformationCircle } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { useParams } from "react-router-dom";
import { loadCategories } from "../../redux/features/help_request/requestActions";
import {
  useAddRequestMutation,
  useGetAllRequestQuery,
} from "../../services/requestApi";
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
  const [location, setLocation] = useState("");
  const { inputRef, isLoaded, handleOnPlacesChanged } =
    usePlacesSearchBox(setLocation);

  const [languages, setLanguages] = useState([]);

  const [selectedCategory, setSelectedCategory] = useState("General");
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [requestType, setRequestType] = useState("");
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);

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
    preferred_language: "",
    category: "General",
    request_type: "remote",
    location: "",
    subject: "",
    description: "",
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const closeForm = () => {
    navigate("/dashboard");
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    const submissionData = {
      ...formData,
      location,
    };

    try {
      const response = await addRequest(submissionData);
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

      alert(
        "Request submitted successfully! Request ID: " +
          response.data.requestId,
      );
      // console.log(response);
    } catch (error) {
      console.error("Failed to submit request:", error);
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

  if (isLoading) return <div>Loading...</div>;
  return (
    <div className="">
      <form className="w-full max-w-3xl mx-auto p-8" onSubmit={handleSubmit}>
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

          <div className="mt-3" data-testid="parentDivOne">
            <label
              htmlFor="self"
              className="block mb-1 text-gray-700 font-medium"
            >
              {t("FOR_SELF")}
            </label>
            <select
              id="self"
              data-testid="dropdown"
              className="border border-gray-300 text-gray-700 rounded-lg p-2 w-24"
              onChange={(e) => setSelfFlag(e.target.value === "yes")}
              disabled
            >
              <option value="yes">{t("YES")}</option>
            </select>
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
                value={formData.request_type}
                onChange={(e) =>
                  setFormData({ ...formData, request_type: e.target.value })
                }
              >
                <option value="Remote">{t("REMOTE")}</option>
                <option value="In Person">{t("IN_PERSON")}</option>
              </select>
            </div>

            {formData.request_type === "In Person" && (
              <div className="mt-3">
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
    </div>
  );
};

export default HelpRequestForm;
