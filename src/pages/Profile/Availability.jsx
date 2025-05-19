import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { FaPlus, FaTrashAlt } from "react-icons/fa";
import { FiClock } from "react-icons/fi";
import LoadingIndicator from "../../common/components/Loading/Loading";

function Availability({ setHasUnsavedChanges }) {
  const { t } = useTranslation();
  const [isEditing, setIsEditing] = useState(false);
  const [availabilitySlots, setAvailabilitySlots] = useState([]);
  const [receiveEmergencyNotifications, setReceiveEmergencyNotifications] =
    useState(false);
  const [loading, setLoading] = useState(false);
  const titleRef = useRef(null);

  // Frequency options for dropdown
  const frequencyOptions = [
    { value: "Everyday", label: t("EVERYDAY") },
    { value: "Weekdays", label: t("WEEKDAYS") },
    { value: "Weekends", label: t("WEEKENDS") },
    { value: "Monday", label: t("MONDAY") },
    { value: "Tuesday", label: t("TUESDAY") },
    { value: "Wednesday", label: t("WEDNESDAY") },
    { value: "Thursday", label: t("THURSDAY") },
    { value: "Friday", label: t("FRIDAY") },
    { value: "Saturday", label: t("SATURDAY") },
    { value: "Sunday", label: t("SUNDAY") },
  ];

  // Fetch saved availability data on component mount
  useEffect(() => {
    const savedAvailability = JSON.parse(
      localStorage.getItem("availabilityData") || "null",
    );
    if (savedAvailability) {
      setAvailabilitySlots(savedAvailability.slots || []);
      setReceiveEmergencyNotifications(
        savedAvailability.emergencyNotifications || false,
      );
    }
  }, []);

  // Set focus when editing starts
  useEffect(() => {
    if (isEditing && titleRef.current) {
      titleRef.current.focus();
    }
  }, [isEditing]);

  // Update parent component about unsaved changes
  useEffect(() => {
    if (isEditing) {
      setHasUnsavedChanges(true);
    } else {
      setHasUnsavedChanges(false);
    }
  }, [isEditing, setHasUnsavedChanges]);

  const handleAddSlot = () => {
    setAvailabilitySlots([
      ...availabilitySlots,
      { id: Date.now(), frequency: "Everyday", startTime: "", endTime: "" },
    ]);
  };

  const handleRemoveSlot = (id) => {
    setAvailabilitySlots(availabilitySlots.filter((slot) => slot.id !== id));
  };

  const handleSlotChange = (id, field, value) => {
    setAvailabilitySlots(
      availabilitySlots.map((slot) =>
        slot.id === id ? { ...slot, [field]: value } : slot,
      ),
    );
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = async () => {
    setLoading(true);

    try {
      // Validate all slots have the required fields filled
      const isValid = availabilitySlots.every(
        (slot) => slot.frequency && slot.startTime && slot.endTime,
      );

      if (!isValid) {
        alert(t("AVAILABILITY_VALIDATION_ERROR"));
        setLoading(false);
        return;
      }

      // In a real implementation, you would send this data to the backend
      // For now, just save to localStorage for demo purposes
      const availabilityData = {
        slots: availabilitySlots,
        emergencyNotifications: receiveEmergencyNotifications,
      };

      localStorage.setItem(
        "availabilityData",
        JSON.stringify(availabilityData),
      );

      // Simulate API call delay
      setTimeout(() => {
        setIsEditing(false);
        setHasUnsavedChanges(false);
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error("Error saving availability:", error);
      alert(t("SAVE_ERROR"));
      setLoading(false);
    }
  };

  const handleCancelClick = () => {
    // Revert to saved data
    const savedAvailability = JSON.parse(
      localStorage.getItem("availabilityData") || "null",
    );
    if (savedAvailability) {
      setAvailabilitySlots(savedAvailability.slots || []);
      setReceiveEmergencyNotifications(
        savedAvailability.emergencyNotifications || false,
      );
    } else {
      setAvailabilitySlots([]);
      setReceiveEmergencyNotifications(false);
    }

    setIsEditing(false);
    setHasUnsavedChanges(false);
  };

  return (
    <div className="flex flex-col border p-6 rounded-lg w-full">
      <h3 className="font-bold text-xl mb-4" ref={titleRef} tabIndex="-1">
        {t("Volunteer Availabilty")}
      </h3>

      {isEditing ? (
        <div className="mb-6">
          <div className="mb-6">
            <h4 className="text-lg font-medium mb-2">
              {t("Your available time slots")}
            </h4>

            {availabilitySlots.map((slot, index) => (
              <div key={slot.id} className="flex items-center gap-3 mb-3">
                <select
                  value={slot.frequency}
                  onChange={(e) =>
                    handleSlotChange(slot.id, "frequency", e.target.value)
                  }
                  className="appearance-none block bg-white text-gray-700 border border-gray-300 rounded py-2 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                >
                  {frequencyOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>

                <div className="relative">
                  <input
                    type="time"
                    value={slot.startTime}
                    onChange={(e) =>
                      handleSlotChange(slot.id, "startTime", e.target.value)
                    }
                    className="appearance-none block bg-white text-gray-700 border border-gray-300 rounded py-2 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500 pl-8"
                  />
                  <FiClock className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500" />
                </div>

                <div className="relative">
                  <input
                    type="time"
                    value={slot.endTime}
                    onChange={(e) =>
                      handleSlotChange(slot.id, "endTime", e.target.value)
                    }
                    className="appearance-none block bg-white text-gray-700 border border-gray-300 rounded py-2 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500 pl-8"
                  />
                  <FiClock className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500" />
                </div>

                <button
                  onClick={() => handleRemoveSlot(slot.id)}
                  className="text-red-500 hover:text-red-700"
                  aria-label={t("Remove Time Slot")}
                >
                  <FaTrashAlt />
                </button>
              </div>
            ))}

            <button
              onClick={handleAddSlot}
              className="flex items-center gap-2 text-blue-500 hover:text-blue-700 mt-2 bg-blue-100 py-2 px-4 rounded-md"
            >
              <FaPlus />
              <span>{t("Add Time Slot")}</span>
            </button>
          </div>

          <div className="mb-6 mt-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={receiveEmergencyNotifications}
                onChange={(e) =>
                  setReceiveEmergencyNotifications(e.target.checked)
                }
                className="mr-2 h-4 w-4"
              />
              <span>{t("RECEIVE EMERGENCY NOTIFICATIONS")}</span>
            </label>
            <p className="text-sm text-gray-500 mt-1 ml-6">
              {t("EMERGENCY_NOTIFICATIONS_DESCRIPTION")}
            </p>
          </div>

          <div className="flex justify-center mt-6">
            <button
              disabled={loading}
              className="py-2 px-4 bg-blue-500 text-white rounded-md mr-2 hover:bg-blue-600 flex items-center justify-center"
              onClick={handleSaveClick}
            >
              <span className={loading ? "mr-2" : ""}>{t("SAVE")}</span>
              {loading && <LoadingIndicator size="24px" />}
            </button>
            <button
              disabled={loading}
              className="py-2 px-4 bg-gray-500 text-white rounded-md hover:bg-gray-600"
              onClick={handleCancelClick}
            >
              {t("CANCEL")}
            </button>
          </div>
        </div>
      ) : (
        <div>
          {availabilitySlots.length > 0 ? (
            <div className="mb-6">
              <h4 className="text-lg font-medium mb-2">
                {t("Your available time slots")}
              </h4>
              <div className="space-y-2">
                {availabilitySlots.map((slot) => (
                  <div key={slot.id} className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-gray-900">
                      <span className="font-medium">
                        {frequencyOptions.find(
                          (opt) => opt.value === slot.frequency,
                        )?.label || slot.frequency}
                        :
                      </span>{" "}
                      {slot.startTime} - {slot.endTime}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-4">
                <p className="text-gray-900">
                  <span className="font-medium">
                    {t("EMERGENCY NOTIFICATIONS")}:
                  </span>{" "}
                  {receiveEmergencyNotifications ? t("ENABLED") : t("DISABLED")}
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center p-6 bg-gray-50 rounded-lg mb-6">
              <p className="text-gray-500">{t("NO AVAILABILITY SLOTS")}</p>
            </div>
          )}

          <div className="flex justify-center">
            <button
              className="py-2 px-6 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              onClick={handleEditClick}
            >
              {t("EDIT")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Availability;
