import { StandaloneSearchBox } from "@react-google-maps/api";
import React, { useEffect, useRef, useState } from "react"; //added for testing
import { useTranslation } from "react-i18next";
import { IoMdInformationCircle } from "react-icons/io";
import { Check, ChevronsUpDown, X, CirclePlus } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { useParams } from "react-router-dom";
import { loadCategories } from "../../redux/features/help_request/requestActions";
import {
  useAddRequestMutation,
  useGetAllRequestQuery,
} from "../../services/requestApi";
import { checkProfanity, createRequest } from "../../services/requestServices";
import HousingCategory from "./Categories/HousingCategory";
import JobsCategory from "./Categories/JobCategory";
import usePlacesSearchBox from "./location/usePlacesSearchBox";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "../../lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../common/components/ui/popover";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from "../../common/components/ui/command";
import { Button } from "../../common/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../common/components/ui/form";
import { Input } from "../../common/components/ui/input";
import { Textarea } from "../../common/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../common/components/ui/select";
import { formDefaultValues, FormSchema } from "./formSchema";

const genderOptions = [
  { value: "Select", label: "Select" },
  { value: "Woman", label: "Woman" },
  { value: "Man", label: "Man" },
  { value: "Non-binary", label: "Non-binary" },
  { value: "Transgender", label: "Transgender" },
  { value: "Intersex", label: "Intersex" },
  { value: "Gender-nonconforming", label: "Gender-nonconforming" },
];

const weekOptions = [
  { value: "Monday", label: "Monday" },
  { value: "Tuesday", label: "Tuesday" },
  { value: "Wednesday", label: "Wednesday" },
  { value: "Thursday", label: "Thursday" },
  { value: "Friday", label: "Friday" },
  { value: "Saturday", label: "Saturday" },
  { value: "Sunday", label: "Sunday" },
];

const mainCategoryValues = [
  {
    value: "counsellingSupport",
    label: "Counselling Support",
    subcategories: [
      { value: "College Applications", label: "College Applications" },
      {
        value: "Statement Of Purpose(SOP) Reviews",
        label: "Statement Of Purpose(SOP) Reviews",
      },
      { value: "College Recommendations", label: "College Recommendations" },
    ],
  },
  {
    value: "elderlySupport",
    label: "Elderly Support",
    subcategories: [
      {
        value: "Remote Computer Assistance",
        label: "Remote Computer Assistance",
      },
      {
        value: "Government Agency Connections",
        label: "Government Agency Connections",
      },
      { value: "Ride Assistance", label: "Ride Assistance" },
      { value: "Shopping Assistance", label: "Shopping Assistance" },
    ],
  },
];

const urgencyLevelValues = [
  {
    value: "high",
    label: "High: Needs response within 24 hours",
  },
  {
    value: "medium",
    label: "Medium: Address within 48-96 hours",
  },
  {
    value: "low",
    label: "Low: Can be resolved beyond 96 hours",
  },
];

const HelpRequestForm = ({ isEdit = false, onClose }) => {
  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: formDefaultValues,
  });
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "availability",
  });

  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { categories } = useSelector((state) => state.request);
  const token = useSelector((state) => state.auth.idToken);
  const [location, setLocation] = useState("");
  const { inputRef, isLoaded, getPlaces } = usePlacesSearchBox();

  const [languages, setLanguages] = useState([]);

  const [selectedCategory, setSelectedCategory] = useState("General");
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [requestType, setRequestType] = useState("");
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);

  const [selectedMainCategory, setSelectedMainCategory] = useState("");
  const [openMainCategory, setOpenMainCategory] = useState(false);

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
  const handleSubmit = async (data) => {
    console.log("submit is clicked!");
    console.log("Form data:", data);

    // const submissionData = {
    //   ...formData,
    //   location,
    // };

    // try {
    //   const res = await checkProfanity({
    //     subject: formData.subject,
    //     description: formData.description,
    //   });

    //   if (res.contains_profanity) {
    //     alert(
    //       "Profanity detected. Please remove these word(s) : " +
    //         res.profanity +
    //         "  from Subject/Description and submit request again!",
    //     );
    //   } else {
    //     // Proceed with submitting the request if no profanity is found
    //     const response = await createRequest(submissionData);
    //     alert(
    //       "Request submitted successfully! You will now be redirected to the dashboard.",
    //     );
    //     navigate("/dashboard");
    //   }
    // } catch (error) {
    //   console.error("Failed to process request:", error);
    //   alert("Failed to submit request!");
    // }
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
    <Form {...form}>
      <form
        className="w-full max-w-2xl mx-auto p-5"
        onSubmit={form.handleSubmit(handleSubmit)}
      >
        <div className="bg-white p-6 rounded-lg shadow-md border flex flex-col gap-7">
          <h1 className="text-xl font-bold text-gray-800 ">
            {isEdit ? t("EDIT_HELP_REQUEST") : t("CREATE_HELP_REQUEST")}
          </h1>
          <div
            className="flex items-start gap-2 p-2 my-2 text-xs text-yellow-800 rounded-lg bg-yellow-50"
            role="alert"
          >
            <IoMdInformationCircle size={22} />
            <div>
              <span className="font-medium mr-1">{t("NOTE")}:</span>
              {t("LIFE_THREATENING_REQUESTS")}
            </div>
          </div>

          <div className="" data-testid="parentDivOne">
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
          <FormField
            control={form.control}
            name="mainCategory"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-800 font-semibold">
                  Select Main Category <span className="text-gray-800">*</span>
                </FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Main Category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {mainCategoryValues.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="subCategory"
            render={({ field }) => {
              const selectedMainCategory = form.watch("mainCategory");
              const subcategories =
                mainCategoryValues.find(
                  (cat) => cat.value === selectedMainCategory,
                )?.subcategories || [];
              return (
                <FormItem>
                  <FormLabel className="text-gray-800 font-semibold">
                    Select Specific Service{" "}
                    <span className="text-gray-800">*</span>
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={!selectedMainCategory}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          placeholder={
                            !selectedMainCategory
                              ? "Select a main category first"
                              : "Choose a service"
                          }
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {subcategories.map((category) => (
                        <SelectItem key={category.value} value={category.value}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              );
            }}
          />

          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel className="text-gray-800 font-semibold">
                  Title of the Request <span className="text-gray-800">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter a title for your request"
                    className="border p-2 w-full rounded-lg"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel className="text-gray-800 font-semibold">
                  Description Your Request{" "}
                  <span className="text-gray-800">*</span>
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Provide details about the help you need"
                    className=""
                    {...field}
                  ></Textarea>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel className="text-gray-800 font-semibold">
                  Location <span className="text-gray-800">*</span>
                </FormLabel>
                <FormControl>
                  {isLoaded && (
                    <StandaloneSearchBox
                      onLoad={(ref) => (inputRef.current = ref)}
                      onPlacesChanged={() => {
                        const place = getPlaces();
                        if (place) {
                          field.onChange(place);
                        }
                      }}
                    >
                      <input
                        type="text"
                        placeholder="Enter your location"
                        className="border p-2 w-full rounded-lg"
                        {...field}
                      />
                    </StandaloneSearchBox>
                  )}
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormLabel className="text-gray-800 font-semibold">
            Availability <span className="text-gray-800">*</span>
          </FormLabel>

          {fields.map((item, index) => (
            <div key={item.id} className="flex flex-row gap-2 w-full flex-wrap">
              <FormField
                control={form.control}
                name={`availability.${index}.day`}
                render={({ field }) => (
                  <FormItem className="flex flex-col ">
                    <FormControl>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            role="combobox"
                            className={cn(
                              "justify-between",
                              !field.value && "text-muted-foreground",
                            )}
                          >
                            {field.value
                              ? weekOptions.find(
                                  (day) => day.value === field.value,
                                )?.label
                              : "Select day"}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="p-0 w-[var(--radix-popover-trigger-width)]">
                          <Command>
                            <CommandList>
                              <CommandGroup>
                                {weekOptions.map((day) => (
                                  <CommandItem
                                    key={day.value}
                                    value={day.value}
                                    onSelect={() => {
                                      form.setValue(
                                        `availability.${index}.day`,
                                        day.value,
                                      );
                                    }}
                                  >
                                    {day.label}
                                    <Check
                                      className={cn(
                                        "mr-2 h-4 w-4",
                                        day.value === field.value
                                          ? "opacity-100"
                                          : "opacity-0",
                                      )}
                                    />
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`availability.${index}.startTime`}
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <span className="text-gray-800 font-semibold self-center">
                to
              </span>
              <FormField
                control={form.control}
                name={`availability.${index}.endTime`}
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <span className="self-center" onClick={() => remove(index)}>
                <X size={15} />
              </span>
            </div>
          ))}

          <Button
            onClick={() =>
              append({
                day: "",
                startTimeHour: "",
                startTimeMinute: "",
                startTimeAMPM: "",
                endTimeHour: "",
                endTimeMinute: "",
                endTimeAMPM: "",
              })
            }
          >
            <CirclePlus /> Add Time Slot
          </Button>
          <FormField
            control={form.control}
            name="urgencyLevel"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-800 font-semibold">
                  Urgency Level <span className="text-gray-800">*</span>
                </FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select urgency level" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {urgencyLevelValues.map((urgencyLevel) => (
                      <SelectItem
                        key={urgencyLevel.value}
                        value={urgencyLevel.value}
                      >
                        {urgencyLevel.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
          <Button type="submit" className="bg-[#008001]">
            Submit Help Request
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default HelpRequestForm;
