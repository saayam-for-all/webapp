import React, { useState, useEffect } from "react";
import { IoMdInformationCircle } from "react-icons/io";
import { HiChevronDown } from "react-icons/hi";

// Popup modal for subcategory - ElderlySupport Component
const ElderlySupport = ({
  isOpen,
  onClose,
  onSave,
  onDelete,
  selectedSubcategory,
  initialData = null,
  existingSubcategoryId = null,
  languages = [],
  genderOptions = [],
}) => {
  // Popup modal for subcategory - Track if data has been saved before
  const [hasBeenSaved, setHasBeenSaved] = useState(false);
  // Popup modal for subcategory - Track Medical Help type selection
  const [medicalHelpType, setMedicalHelpType] = useState("");
  // Popup modal for subcategory - Track Errands & Transportation type selection
  const [errandsTransportationType, setErrandsTransportationType] =
    useState("");

  // Popup modal for subcategory - Initialize form data based on subcategory type
  const getInitialFormData = () => {
    if (!selectedSubcategory) return {};

    const subcategoryName = selectedSubcategory.name || "";

    // Popup modal for subcategory - Senior Living Relocation
    if (
      subcategoryName.includes("SENIOR_LIVING_RELOCATION") ||
      subcategoryName.includes("Senior Living")
    ) {
      return {
        moveOutStreet: "",
        moveOutCity: "",
        moveOutZip: "",
        moveOutAccessInfo: "",
        destinationStreet: "",
        destinationCity: "",
        destinationZip: "",
        destinationAccessInfo: "",
        primarySlotDate: "",
        primarySlotTime: "",
        alternateSlotDate: "",
        alternateSlotTime: "",
        numberOfBoxes: "",
        furnitureChecklist: "",
        fragileItems: "",
        specialHandlingNeeds: "",
        assistanceNeeded: [],
        photos: null,
        specialNotes: "",
      };
    }

    // Popup modal for subcategory - Digital Support for Seniors
    if (
      subcategoryName.includes("DIGITAL_SUPPORT") ||
      subcategoryName.includes("Digital Support")
    ) {
      return {
        appNames: "",
        deviceType: "",
        operatingSystem: "",
        descriptionOfIssue: "",
        screenshots: null,
      };
    }

    // Popup modal for subcategory - Medical Help
    if (
      subcategoryName.includes("MEDICAL_HELP") ||
      subcategoryName.includes("Medical Help")
    ) {
      return {
        numberOfMedications: "",
        timesPerDay: "",
        hasPrescription: "",
        reminderType: "",
        reminderTimes: [],
        deviceType: [],
        setupMode: "",
        deviceBrand: "",
        preferredLanguage: "",
        preferredTimeSlotDate: "",
        preferredTimeSlotTime: "",
      };
    }

    // Popup modal for subcategory - Errands & Transportation
    if (
      subcategoryName.includes("ERRANDS") ||
      subcategoryName.includes("Errands")
    ) {
      return {
        errandType: [],
        listOfItems: "",
        pickupDropoffLocation: "",
        frequency: "",
        preferredTimeSlotDate: "",
        preferredTimeSlotTime: "",
        pickupDropLocation: "",
        appointmentEventType: "",
        appointmentDate: "",
        appointmentTime: "",
        tripType: "",
        accessibilityNeeds: [],
        transportMode: "",
        appointmentType: [],
        bookingMode: [],
        timingPreferencesDate: "",
        timingPreferencesTime: "",
      };
    }

    // Popup modal for subcategory - Social Connection
    if (
      subcategoryName.includes("SOCIAL_CONNECTION") ||
      subcategoryName.includes("Social Connection")
    ) {
      return {
        activity: [],
        frequency: "",
        preferredTimeDate: "",
        preferredTimeTime: "",
        preferredLanguage: "",
        location: "",
      };
    }

    // Popup modal for subcategory - Meal Support
    if (
      subcategoryName.includes("MEAL_SUPPORT") ||
      subcategoryName.includes("Meal Support")
    ) {
      return {
        typeOfHelp: [],
        location: "",
        dietaryPreferences: [],
        scheduleFrequency: "",
        timeOfDay: "",
        preferredLanguage: "",
      };
    }

    return {};
  };

  // Popup modal for subcategory - Form data state
  const [formData, setFormData] = useState(getInitialFormData());

  // Popup modal for subcategory - Initialize form data when modal opens or initialData changes
  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData(initialData);
        setHasBeenSaved(true); // Data exists, so it's been saved before
        // Popup modal for subcategory - Set medical help type if data exists
        if (initialData.medicalHelpType) {
          setMedicalHelpType(initialData.medicalHelpType);
        }
        // Popup modal for subcategory - Set errands transportation type if data exists
        if (initialData.errandsTransportationType) {
          setErrandsTransportationType(initialData.errandsTransportationType);
        }
      } else {
        setFormData(getInitialFormData());
        setHasBeenSaved(false); // No initial data, first time
        setMedicalHelpType(""); // Reset medical help type
        setErrandsTransportationType(""); // Reset errands transportation type
      }
    }
  }, [isOpen, initialData, selectedSubcategory]);

  // Popup modal for subcategory - Check if form has any data
  const hasFormData = () => {
    return Object.values(formData).some((value) => {
      if (Array.isArray(value)) {
        return value.length > 0;
      }
      if (value === null || value === undefined) {
        return false;
      }
      return String(value).trim() !== "";
    });
  };

  // Popup modal for subcategory - Handle input changes
  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      setFormData((prev) => ({ ...prev, [name]: files[0] || null }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Popup modal for subcategory - Handle checkbox changes for multi-select
  const handleCheckboxChange = (name, value) => {
    setFormData((prev) => {
      const currentArray = prev[name] || [];
      const isChecked = currentArray.includes(value);
      return {
        ...prev,
        [name]: isChecked
          ? currentArray.filter((item) => item !== value)
          : [...currentArray, value],
      };
    });
  };

  // Popup modal for subcategory - Handle save
  const handleSave = () => {
    // Popup modal for subcategory - Check if another subcategory is already saved
    if (
      existingSubcategoryId &&
      existingSubcategoryId !== selectedSubcategory?.id
    ) {
      // This will be handled by parent component
      return;
    }
    // Popup modal for subcategory - Include medical help type and errands transportation type in form data
    const dataToSave = {
      ...formData,
      medicalHelpType: medicalHelpType,
      errandsTransportationType: errandsTransportationType,
    };
    onSave(dataToSave, selectedSubcategory);
    setHasBeenSaved(true);
    onClose();
  };

  // Popup modal for subcategory - Handle delete
  const handleDelete = () => {
    if (onDelete && selectedSubcategory) {
      onDelete(selectedSubcategory.id);
      setFormData(getInitialFormData());
      setHasBeenSaved(false);
    }
  };

  // Popup modal for subcategory - Don't render if not open
  if (!isOpen || !selectedSubcategory) return null;

  const subcategoryName = selectedSubcategory.name || "";
  const isSaveDisabled = !hasBeenSaved && !hasFormData();

  // Popup modal for subcategory - Render form based on subcategory
  const renderFormFields = () => {
    // Popup modal for subcategory - Senior Living Relocation
    if (
      subcategoryName.includes("SENIOR_LIVING_RELOCATION") ||
      subcategoryName.includes("Senior Living")
    ) {
      return (
        <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
          <h3 className="text-lg font-semibold mb-3">Move-Out Address</h3>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-gray-700 mb-1 font-medium">
                Street
              </label>
              <input
                type="text"
                name="moveOutStreet"
                value={formData.moveOutStreet || ""}
                onChange={handleInputChange}
                className="w-full rounded-lg border border-gray-300 py-2 px-3"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-1 font-medium">
                City
              </label>
              <input
                type="text"
                name="moveOutCity"
                value={formData.moveOutCity || ""}
                onChange={handleInputChange}
                className="w-full rounded-lg border border-gray-300 py-2 px-3"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-1 font-medium">
                ZIP
              </label>
              <input
                type="text"
                name="moveOutZip"
                value={formData.moveOutZip || ""}
                onChange={handleInputChange}
                className="w-full rounded-lg border border-gray-300 py-2 px-3"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-1 font-medium">
                Access Info
              </label>
              <input
                type="text"
                name="moveOutAccessInfo"
                value={formData.moveOutAccessInfo || ""}
                onChange={handleInputChange}
                className="w-full rounded-lg border border-gray-300 py-2 px-3"
              />
            </div>
          </div>

          <h3 className="text-lg font-semibold mb-2 mt-3">
            Destination Address (optional)
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-gray-700 mb-1 font-medium">
                Street
              </label>
              <input
                type="text"
                name="destinationStreet"
                value={formData.destinationStreet || ""}
                onChange={handleInputChange}
                className="w-full rounded-lg border border-gray-300 py-2 px-3"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-1 font-medium">
                City
              </label>
              <input
                type="text"
                name="destinationCity"
                value={formData.destinationCity || ""}
                onChange={handleInputChange}
                className="w-full rounded-lg border border-gray-300 py-2 px-3"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-1 font-medium">
                ZIP
              </label>
              <input
                type="text"
                name="destinationZip"
                value={formData.destinationZip || ""}
                onChange={handleInputChange}
                className="w-full rounded-lg border border-gray-300 py-2 px-3"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-1 font-medium">
                Access Info
              </label>
              <input
                type="text"
                name="destinationAccessInfo"
                value={formData.destinationAccessInfo || ""}
                onChange={handleInputChange}
                className="w-full rounded-lg border border-gray-300 py-2 px-3"
              />
            </div>
          </div>

          <h3 className="text-lg font-semibold mb-2 mt-3">
            Preferred Move-Out Date & Time Slot
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-gray-700 mb-1 font-medium">
                Primary Slot (Date)
              </label>
              <input
                type="date"
                name="primarySlotDate"
                value={formData.primarySlotDate || ""}
                onChange={handleInputChange}
                className="w-full rounded-lg border border-gray-300 py-2 px-3"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-1 font-medium">
                Primary Slot (Time)
              </label>
              <input
                type="time"
                name="primarySlotTime"
                value={formData.primarySlotTime || ""}
                onChange={handleInputChange}
                className="w-full rounded-lg border border-gray-300 py-2 px-3"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-1 font-medium">
                Alternate Slot (Date) - Optional
              </label>
              <input
                type="date"
                name="alternateSlotDate"
                value={formData.alternateSlotDate || ""}
                onChange={handleInputChange}
                className="w-full rounded-lg border border-gray-300 py-2 px-3"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-1 font-medium">
                Alternate Slot (Time) - Optional
              </label>
              <input
                type="time"
                name="alternateSlotTime"
                value={formData.alternateSlotTime || ""}
                onChange={handleInputChange}
                className="w-full rounded-lg border border-gray-300 py-2 px-3"
              />
            </div>
          </div>

          <h3 className="text-lg font-semibold mb-2 mt-3">Items to Be Moved</h3>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-gray-700 mb-1 font-medium">
                Number of Boxes
              </label>
              <input
                type="number"
                name="numberOfBoxes"
                value={formData.numberOfBoxes || ""}
                onChange={handleInputChange}
                className="w-full rounded-lg border border-gray-300 py-2 px-3"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-1 font-medium">
                Furniture Checklist
              </label>
              <input
                type="text"
                name="furnitureChecklist"
                value={formData.furnitureChecklist || ""}
                onChange={handleInputChange}
                className="w-full rounded-lg border border-gray-300 py-2 px-3"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-1 font-medium">
                Fragile Items
              </label>
              <input
                type="text"
                name="fragileItems"
                value={formData.fragileItems || ""}
                onChange={handleInputChange}
                className="w-full rounded-lg border border-gray-300 py-2 px-3"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-1 font-medium">
                Special Handling Needs
              </label>
              <input
                type="text"
                name="specialHandlingNeeds"
                value={formData.specialHandlingNeeds || ""}
                onChange={handleInputChange}
                className="w-full rounded-lg border border-gray-300 py-2 px-3"
              />
            </div>
          </div>

          <div className="mt-2">
            <label className="block text-gray-700 mb-2 font-medium">
              Type of Assistance Needed (multi-select)
            </label>
            <div className="flex flex-wrap gap-3">
              {["Packing", "Transport", "Unpacking", "Loading / Unloading"].map(
                (option) => (
                  <label key={option} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={(formData.assistanceNeeded || []).includes(
                        option,
                      )}
                      onChange={() =>
                        handleCheckboxChange("assistanceNeeded", option)
                      }
                      className="rounded"
                    />
                    <span>{option}</span>
                  </label>
                ),
              )}
            </div>
          </div>

          <div className="mt-2">
            <label className="block text-gray-700 mb-1 font-medium">
              Upload Photos (optional)
            </label>
            <input
              type="file"
              name="photos"
              accept="image/*"
              multiple
              onChange={handleInputChange}
              className="w-full rounded-lg border border-gray-300 py-2 px-3"
            />
          </div>

          <div className="mt-2">
            <label className="block text-gray-700 mb-1 font-medium">
              Special Notes / Instructions
            </label>
            <textarea
              name="specialNotes"
              value={formData.specialNotes || ""}
              onChange={handleInputChange}
              rows="3"
              className="w-full rounded-lg border border-gray-300 py-2 px-3"
            />
          </div>
        </div>
      );
    }

    // Popup modal for subcategory - Digital Support for Seniors
    if (
      subcategoryName.includes("DIGITAL_SUPPORT") ||
      subcategoryName.includes("Digital Support")
    ) {
      return (
        <div className="space-y-3">
          <div>
            <label className="block text-gray-700 mb-1 font-medium">
              App Name(s)
            </label>
            <input
              type="text"
              name="appNames"
              value={formData.appNames || ""}
              onChange={handleInputChange}
              className="w-full rounded-lg border border-gray-300 py-2 px-3"
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-1 font-medium">
              Type of Device
            </label>
            <select
              name="deviceType"
              value={formData.deviceType || ""}
              onChange={handleInputChange}
              className="w-full rounded-lg border border-gray-300 py-2 px-3"
            >
              <option value="">Select</option>
              <option value="Phone">Phone</option>
              <option value="Tablet">Tablet</option>
              <option value="Computer">Computer</option>
            </select>
          </div>
          <div>
            <label className="block text-gray-700 mb-1 font-medium">
              Operating System
            </label>
            <select
              name="operatingSystem"
              value={formData.operatingSystem || ""}
              onChange={handleInputChange}
              className="w-full rounded-lg border border-gray-300 py-2 px-3"
            >
              <option value="">Select</option>
              <option value="iOS">iOS</option>
              <option value="Android">Android</option>
              <option value="Windows">Windows</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-gray-700 mb-1 font-medium">
              Description of Issue
            </label>
            <textarea
              name="descriptionOfIssue"
              value={formData.descriptionOfIssue || ""}
              onChange={handleInputChange}
              rows="4"
              className="w-full rounded-lg border border-gray-300 py-2 px-3"
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-1 font-medium">
              Upload Screenshots / Images (optional)
            </label>
            <input
              type="file"
              name="screenshots"
              accept="image/*"
              multiple
              onChange={handleInputChange}
              className="w-full rounded-lg border border-gray-300 py-2 px-3"
            />
          </div>
        </div>
      );
    }

    // Popup modal for subcategory - Medical Help
    if (
      subcategoryName.includes("MEDICAL_HELP") ||
      subcategoryName.includes("Medical Help")
    ) {
      return (
        <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
          {/* Popup modal for subcategory - Medical Help Type Dropdown */}
          <div>
            <label className="block text-gray-700 mb-1 font-medium">
              Select Medical Help Type
            </label>
            <div className="relative">
              <select
                value={medicalHelpType}
                onChange={(e) => setMedicalHelpType(e.target.value)}
                className="block w-full appearance-none bg-white border border-gray-300 rounded-lg py-2 px-3 pr-8 text-gray-700 focus:outline-none"
              >
                <option value="">Select...</option>
                <option value="medication">
                  Medication Management & Schedule
                </option>
                <option value="device">Medical Devices Setup</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                <HiChevronDown className="h-5 w-5 text-gray-600" />
              </div>
            </div>
          </div>

          {/* Popup modal for subcategory - Medication Management & Schedule Fields */}
          {medicalHelpType === "medication" && (
            <div className="mt-4 w-full border border-gray-200 rounded-lg p-4 bg-gray-50">
              <h3 className="text-lg font-semibold mb-3">
                Medication Management & Schedule
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 mb-1 font-medium">
                    Number of Medications
                  </label>
                  <input
                    type="number"
                    name="numberOfMedications"
                    value={formData.numberOfMedications || ""}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border border-gray-300 py-2 px-3"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-1 font-medium">
                    Times per Day
                  </label>
                  <input
                    type="number"
                    name="timesPerDay"
                    value={formData.timesPerDay || ""}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border border-gray-300 py-2 px-3"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-1 font-medium">
                    Has a Doctor's Prescription?
                  </label>
                  <select
                    name="hasPrescription"
                    value={formData.hasPrescription || ""}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border border-gray-300 py-2 px-3"
                  >
                    <option value="">Select</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 mb-1 font-medium">
                    Reminder Type
                  </label>
                  <select
                    name="reminderType"
                    value={formData.reminderType || ""}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border border-gray-300 py-2 px-3"
                  >
                    <option value="">Select</option>
                    <option value="Phone Call">Phone Call</option>
                    <option value="App Setup Help">App Setup Help</option>
                    <option value="Physical Visit">Physical Visit</option>
                  </select>
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-gray-700 mb-2 font-medium">
                  Reminder Times (multi-select hourly slots: 6 AM – 9 PM)
                </label>
                <div className="grid grid-cols-4 gap-2 max-h-40 overflow-y-auto">
                  {Array.from({ length: 16 }, (_, i) => {
                    const hour = 6 + i;
                    const timeLabel =
                      hour <= 12 ? `${hour} AM` : `${hour - 12} PM`;
                    return (
                      <label key={hour} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={(formData.reminderTimes || []).includes(
                            timeLabel,
                          )}
                          onChange={() =>
                            handleCheckboxChange("reminderTimes", timeLabel)
                          }
                          className="rounded"
                        />
                        <span className="text-sm">{timeLabel}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Popup modal for subcategory - Medical Devices Setup Fields */}
          {medicalHelpType === "device" && (
            <div className="mt-4 w-full border border-gray-200 rounded-lg p-4 bg-gray-50">
              <h3 className="text-lg font-semibold mb-3">
                Medical Devices Setup
              </h3>
              <div className="mt-3">
                <label className="block text-gray-700 mb-2 font-medium">
                  Device Type (multi-select)
                </label>
                <div className="flex flex-wrap gap-3">
                  {[
                    "Blood Pressure Monitor",
                    "Glucose Meter",
                    "Pulse Oximeter",
                    "Smartwatch / Wearable",
                  ].map((option) => (
                    <label key={option} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={(formData.deviceType || []).includes(option)}
                        onChange={() =>
                          handleCheckboxChange("deviceType", option)
                        }
                        className="rounded"
                      />
                      <span>{option}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-gray-700 mb-1 font-medium">
                    Setup Mode
                  </label>
                  <select
                    name="setupMode"
                    value={formData.setupMode || ""}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border border-gray-300 py-2 px-3"
                  >
                    <option value="">Select</option>
                    <option value="Video Call">Video Call</option>
                    <option value="Home Visit">Home Visit</option>
                    <option value="Remote Guide">Remote Guide</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 mb-1 font-medium">
                    Device Brand (optional)
                  </label>
                  <input
                    type="text"
                    name="deviceBrand"
                    value={formData.deviceBrand || ""}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border border-gray-300 py-2 px-3"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-1 font-medium">
                    Preferred Language
                  </label>
                  <select
                    name="preferredLanguage"
                    value={formData.preferredLanguage || ""}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border border-gray-300 py-2 px-3"
                  >
                    <option value="">Select Language</option>
                    {languages.map((lang) => (
                      <option key={lang.value} value={lang.value}>
                        {lang.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 mb-1 font-medium">
                    Preferred Time Slot (Date)
                  </label>
                  <input
                    type="date"
                    name="preferredTimeSlotDate"
                    value={formData.preferredTimeSlotDate || ""}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border border-gray-300 py-2 px-3"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-1 font-medium">
                    Preferred Time Slot (Time)
                  </label>
                  <input
                    type="time"
                    name="preferredTimeSlotTime"
                    value={formData.preferredTimeSlotTime || ""}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border border-gray-300 py-2 px-3"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      );
    }

    // Popup modal for subcategory - Errands & Transportation
    if (
      subcategoryName.includes("ERRANDS") ||
      subcategoryName.includes("Errands")
    ) {
      return (
        <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
          {/* Popup modal for subcategory - Errands & Transportation Type Dropdown */}
          <div>
            <label className="block text-gray-700 mb-1 font-medium">
              Select Errands & Transportation Type
            </label>
            <div className="relative">
              <select
                value={errandsTransportationType}
                onChange={(e) => setErrandsTransportationType(e.target.value)}
                className="block w-full appearance-none bg-white border border-gray-300 rounded-lg py-2 px-3 pr-8 text-gray-700 focus:outline-none"
              >
                <option value="">Select...</option>
                <option value="errands">Help Running Errands</option>
                <option value="transportation">
                  Transportation for Appointments / Events
                </option>
                <option value="scheduling">
                  Scheduling Appointments / Tasks
                </option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                <HiChevronDown className="h-5 w-5 text-gray-600" />
              </div>
            </div>
          </div>

          {/* Popup modal for subcategory - Help Running Errands Fields */}
          {errandsTransportationType === "errands" && (
            <div className="mt-4 w-full border border-gray-200 rounded-lg p-4 bg-gray-50">
              <h3 className="text-lg font-semibold mb-3">
                Help Running Errands
              </h3>
              <div className="mt-3">
                <label className="block text-gray-700 mb-2 font-medium">
                  Errand Type (multi-select)
                </label>
                <div className="flex flex-wrap gap-3">
                  {[
                    "Grocery Shopping",
                    "Pharmacy Pickup",
                    "Bill Payment",
                    "General Store",
                  ].map((option) => (
                    <label key={option} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={(formData.errandType || []).includes(option)}
                        onChange={() =>
                          handleCheckboxChange("errandType", option)
                        }
                        className="rounded"
                      />
                      <span>{option}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-gray-700 mb-1 font-medium">
                  List of Items
                </label>
                <textarea
                  name="listOfItems"
                  value={formData.listOfItems || ""}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full rounded-lg border border-gray-300 py-2 px-3"
                />
              </div>
              <div className="mt-4">
                <label className="block text-gray-700 mb-1 font-medium">
                  Pick-Up / Drop-Off Location
                </label>
                <input
                  type="text"
                  name="pickupDropoffLocation"
                  value={formData.pickupDropoffLocation || ""}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border border-gray-300 py-2 px-3"
                />
              </div>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-gray-700 mb-1 font-medium">
                    Frequency
                  </label>
                  <select
                    name="frequency"
                    value={formData.frequency || ""}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border border-gray-300 py-2 px-3"
                  >
                    <option value="">Select</option>
                    <option value="One-time">One-time</option>
                    <option value="Weekly–Monthly">Weekly–Monthly</option>
                    <option value="Emergency">Emergency</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 mb-1 font-medium">
                    Preferred Time Slot (Date)
                  </label>
                  <input
                    type="date"
                    name="preferredTimeSlotDate"
                    value={formData.preferredTimeSlotDate || ""}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border border-gray-300 py-2 px-3"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-1 font-medium">
                    Preferred Time Slot (Time)
                  </label>
                  <input
                    type="time"
                    name="preferredTimeSlotTime"
                    value={formData.preferredTimeSlotTime || ""}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border border-gray-300 py-2 px-3"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Popup modal for subcategory - Transportation for Appointments / Events Fields */}
          {errandsTransportationType === "transportation" && (
            <div className="mt-4 w-full border border-gray-200 rounded-lg p-4 bg-gray-50">
              <h3 className="text-lg font-semibold mb-3">
                Transportation for Appointments / Events
              </h3>
              <div className="mt-3">
                <label className="block text-gray-700 mb-1 font-medium">
                  Pickup & Drop Location
                </label>
                <input
                  type="text"
                  name="pickupDropLocation"
                  value={formData.pickupDropLocation || ""}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border border-gray-300 py-2 px-3"
                />
              </div>
              <div className="mt-4">
                <label className="block text-gray-700 mb-1 font-medium">
                  Appointment / Event Type
                </label>
                <input
                  type="text"
                  name="appointmentEventType"
                  value={formData.appointmentEventType || ""}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border border-gray-300 py-2 px-3"
                />
              </div>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-gray-700 mb-1 font-medium">
                    Date
                  </label>
                  <input
                    type="date"
                    name="appointmentDate"
                    value={formData.appointmentDate || ""}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border border-gray-300 py-2 px-3"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-1 font-medium">
                    Time
                  </label>
                  <input
                    type="time"
                    name="appointmentTime"
                    value={formData.appointmentTime || ""}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border border-gray-300 py-2 px-3"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-1 font-medium">
                    Trip Type
                  </label>
                  <select
                    name="tripType"
                    value={formData.tripType || ""}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border border-gray-300 py-2 px-3"
                  >
                    <option value="">Select</option>
                    <option value="Round Trip">Round Trip</option>
                    <option value="One-way">One-way</option>
                    <option value="Wait & Return">Wait & Return</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 mb-1 font-medium">
                    Transport Mode
                  </label>
                  <select
                    name="transportMode"
                    value={formData.transportMode || ""}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border border-gray-300 py-2 px-3"
                  >
                    <option value="">Select</option>
                    <option value="Volunteer Car">Volunteer Car</option>
                    <option value="Escort in Public Transit">
                      Escort in Public Transit
                    </option>
                    <option value="Ride Booking Assistance">
                      Ride Booking Assistance
                    </option>
                  </select>
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-gray-700 mb-2 font-medium">
                  Accessibility Needs (multi-select)
                </label>
                <div className="flex flex-wrap gap-3">
                  {[
                    "Wheelchair Accessible Vehicle",
                    "Needs Help Entering / Exiting",
                    "Uses Walker / Cane",
                    "None",
                  ].map((option) => (
                    <label key={option} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={(formData.accessibilityNeeds || []).includes(
                          option,
                        )}
                        onChange={() =>
                          handleCheckboxChange("accessibilityNeeds", option)
                        }
                        className="rounded"
                      />
                      <span>{option}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Popup modal for subcategory - Scheduling Appointments / Tasks Fields */}
          {errandsTransportationType === "scheduling" && (
            <div className="mt-4 w-full border border-gray-200 rounded-lg p-4 bg-gray-50">
              <h3 className="text-lg font-semibold mb-3">
                Scheduling Appointments / Tasks
              </h3>
              <div className="mt-3">
                <label className="block text-gray-700 mb-2 font-medium">
                  Appointment Type (multi-select)
                </label>
                <div className="flex flex-wrap gap-3">
                  {["Doctor", "Social Service", "Bank", "Utility"].map(
                    (option) => (
                      <label
                        key={option}
                        className="flex items-center space-x-2"
                      >
                        <input
                          type="checkbox"
                          checked={(formData.appointmentType || []).includes(
                            option,
                          )}
                          onChange={() =>
                            handleCheckboxChange("appointmentType", option)
                          }
                          className="rounded"
                        />
                        <span>{option}</span>
                      </label>
                    ),
                  )}
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-gray-700 mb-2 font-medium">
                  Mode (multi-select)
                </label>
                <div className="flex flex-wrap gap-3">
                  {["Booking Online", "Calling", "In-Person Help"].map(
                    (option) => (
                      <label
                        key={option}
                        className="flex items-center space-x-2"
                      >
                        <input
                          type="checkbox"
                          checked={(formData.bookingMode || []).includes(
                            option,
                          )}
                          onChange={() =>
                            handleCheckboxChange("bookingMode", option)
                          }
                          className="rounded"
                        />
                        <span>{option}</span>
                      </label>
                    ),
                  )}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-gray-700 mb-1 font-medium">
                    Timing Preferences (Date)
                  </label>
                  <input
                    type="date"
                    name="timingPreferencesDate"
                    value={formData.timingPreferencesDate || ""}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border border-gray-300 py-2 px-3"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-1 font-medium">
                    Timing Preferences (Time)
                  </label>
                  <input
                    type="time"
                    name="timingPreferencesTime"
                    value={formData.timingPreferencesTime || ""}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border border-gray-300 py-2 px-3"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      );
    }

    // Popup modal for subcategory - Social Connection
    if (
      subcategoryName.includes("SOCIAL_CONNECTION") ||
      subcategoryName.includes("Social Connection")
    ) {
      return (
        <div className="space-y-3">
          <div className="mt-2">
            <label className="block text-gray-700 mb-2 font-medium">
              Activity (multi-select)
            </label>
            <div className="flex flex-wrap gap-3">
              {[
                "Phone Call / Chat",
                "Walk in the Park",
                "Board Games / Card Games",
                "Reading Together",
              ].map((option) => (
                <label key={option} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={(formData.activity || []).includes(option)}
                    onChange={() => handleCheckboxChange("activity", option)}
                    className="rounded"
                  />
                  <span>{option}</span>
                </label>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-gray-700 mb-1 font-medium">
                Frequency
              </label>
              <select
                name="frequency"
                value={formData.frequency || ""}
                onChange={handleInputChange}
                className="w-full rounded-lg border border-gray-300 py-2 px-3"
              >
                <option value="">Select</option>
                <option value="One-time">One-time</option>
                <option value="Weekly–Monthly">Weekly–Monthly</option>
                <option value="Specific Dates">Specific Dates</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-700 mb-1 font-medium">
                Preferred Time (Date)
              </label>
              <input
                type="date"
                name="preferredTimeDate"
                value={formData.preferredTimeDate || ""}
                onChange={handleInputChange}
                className="w-full rounded-lg border border-gray-300 py-2 px-3"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-1 font-medium">
                Preferred Time (Time)
              </label>
              <input
                type="time"
                name="preferredTimeTime"
                value={formData.preferredTimeTime || ""}
                onChange={handleInputChange}
                className="w-full rounded-lg border border-gray-300 py-2 px-3"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-1 font-medium">
                Preferred Language
              </label>
              <select
                name="preferredLanguage"
                value={formData.preferredLanguage || ""}
                onChange={handleInputChange}
                className="w-full rounded-lg border border-gray-300 py-2 px-3"
              >
                <option value="">Select Language</option>
                {languages.map((lang) => (
                  <option key={lang.value} value={lang.value}>
                    {lang.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-gray-700 mb-1 font-medium">
                Location (if applicable)
              </label>
              <input
                type="text"
                name="location"
                value={formData.location || ""}
                onChange={handleInputChange}
                className="w-full rounded-lg border border-gray-300 py-2 px-3"
              />
            </div>
          </div>
        </div>
      );
    }

    // Popup modal for subcategory - Meal Support
    if (
      subcategoryName.includes("MEAL_SUPPORT") ||
      subcategoryName.includes("Meal Support")
    ) {
      return (
        <div className="space-y-3">
          <div className="mt-2">
            <label className="block text-gray-700 mb-2 font-medium">
              Type of Help (multi-select)
            </label>
            <div className="flex flex-wrap gap-3">
              {[
                "Meal Prep Assistance",
                "Cooking Together",
                "Supervision While Cooking",
              ].map((option) => (
                <label key={option} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={(formData.typeOfHelp || []).includes(option)}
                    onChange={() => handleCheckboxChange("typeOfHelp", option)}
                    className="rounded"
                  />
                  <span>{option}</span>
                </label>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-gray-700 mb-1 font-medium">
              Location
            </label>
            <select
              name="location"
              value={formData.location || ""}
              onChange={handleInputChange}
              className="w-full rounded-lg border border-gray-300 py-2 px-3"
            >
              <option value="">Select</option>
              <option value="Volunteer's Home">Volunteer's Home</option>
              <option value="Elder's Home">Elder's Home</option>
              <option value="Community Kitchen">Community Kitchen</option>
            </select>
          </div>
          <div className="mt-2">
            <label className="block text-gray-700 mb-2 font-medium">
              Dietary Preferences (multi-select)
            </label>
            <div className="flex flex-wrap gap-3">
              {[
                "Vegetarian",
                "Diabetic-Friendly",
                "Low-Sodium",
                "No Preference",
              ].map((option) => (
                <label key={option} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={(formData.dietaryPreferences || []).includes(
                      option,
                    )}
                    onChange={() =>
                      handleCheckboxChange("dietaryPreferences", option)
                    }
                    className="rounded"
                  />
                  <span>{option}</span>
                </label>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-gray-700 mb-1 font-medium">
                Schedule - Frequency
              </label>
              <input
                type="text"
                name="scheduleFrequency"
                value={formData.scheduleFrequency || ""}
                onChange={handleInputChange}
                placeholder="e.g., Once/Week, Daily"
                className="w-full rounded-lg border border-gray-300 py-2 px-3"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-1 font-medium">
                Time of Day
              </label>
              <input
                type="time"
                name="timeOfDay"
                value={formData.timeOfDay || ""}
                onChange={handleInputChange}
                className="w-full rounded-lg border border-gray-300 py-2 px-3"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-1 font-medium">
                Preferred Language
              </label>
              <select
                name="preferredLanguage"
                value={formData.preferredLanguage || ""}
                onChange={handleInputChange}
                className="w-full rounded-lg border border-gray-300 py-2 px-3"
              >
                <option value="">Select Language</option>
                {languages.map((lang) => (
                  <option key={lang.value} value={lang.value}>
                    {lang.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      );
    }

    return <div>Unknown subcategory</div>;
  };

  return (
    <>
      {/* Popup modal for subcategory - Background overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50"
        onClick={onClose}
      >
        {/* Popup modal for subcategory - Modal container */}
        <div
          className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-3xl relative mx-4 max-h-[90vh] overflow-hidden flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Popup modal for subcategory - Close button (X) in top-right corner */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-2xl font-bold leading-none z-10 w-8 h-8 flex items-center justify-center"
            aria-label="Close"
          >
            ×
          </button>

          {/* Popup modal for subcategory - Information message about saving (yellow tooltip) */}
          <div className="flex items-start gap-2 mb-3 mt-2 pr-12">
            <IoMdInformationCircle className="text-yellow-600 text-base mt-0.5 flex-shrink-0" />
            <p className="text-sm text-yellow-800 leading-relaxed">
              Click Save to store your data. Changes aren't saved automatically.
              To update later, edit the fields and click Save again.
            </p>
          </div>

          {/* Popup modal for subcategory - Form Fields */}
          <div className="flex-1 overflow-y-auto">{renderFormFields()}</div>

          {/* Popup modal for subcategory - Save and Delete Buttons */}
          <div className="flex justify-between items-center mt-4 pt-3 border-t">
            {/* Popup modal for subcategory - Delete Button (only show if data exists) */}
            {hasBeenSaved && onDelete && (
              <button
                onClick={handleDelete}
                className="px-4 py-2 rounded-lg font-medium transition-colors bg-red-600 text-white hover:bg-red-700"
              >
                Delete
              </button>
            )}
            {!hasBeenSaved && <div></div>}

            {/* Popup modal for subcategory - Save Button */}
            <button
              onClick={handleSave}
              disabled={isSaveDisabled}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                isSaveDisabled
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ElderlySupport;
