import React, { useState, useEffect, useRef, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { FaPlus, FaTrashAlt } from "react-icons/fa";
import { FiClock } from "react-icons/fi";
import LoadingIndicator from "../../common/components/Loading/Loading";

const getTimezoneDetails = (timezoneValue) => {
  try {
    const now = new Date();

    const offsetFormatter = new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      timeZone: timezoneValue,
      timeZoneName: "longOffset",
      hourCycle: "h23",
    });

    const formattedOffsetDate = offsetFormatter.format(now);
    const offsetMatch = formattedOffsetDate.match(/GMT([+-]\d{2}:\d{2})/);
    const utcOffset = offsetMatch ? `UTC${offsetMatch[1]}` : "";
    const userFriendlyNameFormatter = new Intl.DateTimeFormat("en-US", {
      timeZone: timezoneValue,
      timeZoneName: "long",
    });
    const userFriendlyNameParts = userFriendlyNameFormatter
      .format(now)
      .split(", ");
    const userFriendlyName =
      userFriendlyNameParts[userFriendlyNameParts.length - 1];

    return {
      value: timezoneValue,
      label: `${timezoneValue} ${utcOffset ? `(${utcOffset})` : ""} ${userFriendlyName ? `(${userFriendlyName})` : ""}`,
      displayOffset: utcOffset,
      userFriendlyName: userFriendlyName,
    };
  } catch (error) {
    return {
      value: timezoneValue,
      label: timezoneValue,
      displayOffset: "",
      userFriendlyName: "",
    };
  }
};

const convertTo12HourFormat = (time24h) => {
  if (!time24h) return "";
  try {
    const [hours, minutes] = time24h.split(":").map(Number);
    const date = new Date();
    date.setHours(hours, minutes, 0, 0);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  } catch (e) {
    console.error("Error converting time to 12-hour format:", time24h, e);
    return time24h;
  }
};

function Availability({ setHasUnsavedChanges }) {
  const { t } = useTranslation();
  const [isEditing, setIsEditing] = useState(false);
  const [availabilitySlots, setAvailabilitySlots] = useState([]);
  const [loading, setLoading] = useState(false);

  const [vacationMode, setVacationMode] = useState(false);
  const [vacationStartDate, setVacationStartDate] = useState("");
  const [vacationEndDate, setVacationEndDate] = useState("");
  const [timezone, setTimezone] = useState("UTC");

  const titleRef = useRef(null);
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

  const allAvailableTimezones = useMemo(() => {
    const commonTimezones = [
      "Africa/Algiers",
      "Africa/Cairo",
      "Africa/Casablanca",
      "Africa/Johannesburg",
      "Africa/Lagos",
      "America/Anchorage",
      "America/Argentina/Buenos_Aires",
      "America/Bogota",
      "America/Caracas",
      "America/Chicago",
      "America/Denver",
      "America/Halifax",
      "America/Los_Angeles",
      "America/Mexico_City",
      "America/New_York",
      "America/Noronha",
      "America/Phoenix",
      "America/Sao_Paulo",
      "America/St_Johns",
      "Asia/Baghdad",
      "Asia/Bangkok",
      "Asia/Beirut",
      "Asia/Colombo",
      "Asia/Dhaka",
      "Asia/Dubai",
      "Asia/Hong_Kong",
      "Asia/Jakarta",
      "Asia/Jerusalem",
      "Asia/Kabul",
      "Asia/Karachi",
      "Asia/Kathmandu",
      "Asia/Kolkata",
      "Asia/Kuala_Lumpur",
      "Asia/Manila",
      "Asia/Riyadh",
      "Asia/Seoul",
      "Asia/Shanghai",
      "Asia/Singapore",
      "Asia/Tehran",
      "Asia/Tokyo",
      "Asia/Vladivostok",
      "Atlantic/Azores",
      "Atlantic/Cape_Verde",
      "Australia/Adelaide",
      "Australia/Brisbane",
      "Australia/Darwin",
      "Australia/Eucla",
      "Australia/Lord_Howe",
      "Australia/Perth",
      "Australia/Sydney",
      "Europe/Amsterdam",
      "Europe/Athens",
      "Europe/Berlin",
      "Europe/Brussels",
      "Europe/Helsinki",
      "Europe/Istanbul",
      "Europe/Lisbon",
      "Europe/London",
      "Europe/Madrid",
      "Europe/Moscow",
      "Europe/Paris",
      "Europe/Rome",
      "Europe/Warsaw",
      "Pacific/Auckland",
      "Pacific/Chatham",
      "Pacific/Easter",
      "Pacific/Fiji",
      "Pacific/Honolulu",
      "Pacific/Kiritimati",
      "Pacific/Majuro",
      "Pacific/Midway",
      "Pacific/Noumea",
      "Pacific/Pago_Pago",
      "Pacific/Port_Moresby",
      "Pacific/Tongatapu",
      "UTC",
    ];

    return commonTimezones.map(getTimezoneDetails);
  }, []);
  const getCurrentTimezoneInfo = () => {
    const detectedTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    return getTimezoneDetails(detectedTimezone);
  };

  const [currentTimezoneInfo, setCurrentTimezoneInfo] = useState(
    getCurrentTimezoneInfo(),
  );

  useEffect(() => {
    const savedAvailability = JSON.parse(
      localStorage.getItem("availabilityData") || "null",
    );
    if (savedAvailability) {
      setAvailabilitySlots(savedAvailability.slots || []);
      setVacationMode(savedAvailability.vacationMode || false);
      setVacationStartDate(savedAvailability.vacationStartDate || "");
      setVacationEndDate(savedAvailability.vacationEndDate || "");
      setTimezone(savedAvailability.timezone || "UTC");
    }

    if (!savedAvailability?.timezone || savedAvailability.timezone === "UTC") {
      const detectedTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const isValidDetected =
        allAvailableTimezones.some((tz) => tz.value === detectedTimezone) ||
        detectedTimezone.includes("/");

      if (isValidDetected) {
        setTimezone(detectedTimezone);
        setCurrentTimezoneInfo(getTimezoneDetails(detectedTimezone));
      } else {
        setTimezone("UTC");
        setCurrentTimezoneInfo(getTimezoneDetails("UTC"));
      }
    }
  }, [allAvailableTimezones]);

  useEffect(() => {
    if (isEditing && titleRef.current) {
      titleRef.current.focus();
    }
  }, [isEditing]);

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

  const validateTimeSlots = () => {
    for (const slot of availabilitySlots) {
      if (!slot.frequency || !slot.startTime || !slot.endTime) {
        return { isValid: false, message: t("AVAILABILITY_VALIDATION_ERROR") };
      }
      if (slot.startTime === slot.endTime) {
        return {
          isValid: false,
          message: t("START_END_TIMES_MUST_BE_DIFFERENT"),
        };
      }
    }
    return { isValid: true };
  };

  const validateVacationDates = () => {
    if (vacationMode && vacationStartDate && vacationEndDate) {
      if (new Date(vacationStartDate) >= new Date(vacationEndDate)) {
        return { isValid: false, message: t("VACATION_START_BEFORE_END") };
      }
    }
    return { isValid: true };
  };

  const handleSaveClick = async () => {
    setLoading(true);

    try {
      const slotsValidation = validateTimeSlots();
      if (!slotsValidation.isValid) {
        alert(slotsValidation.message);
        setLoading(false);
        return;
      }

      const vacationValidation = validateVacationDates();
      if (!vacationValidation.isValid) {
        alert(vacationValidation.message);
        setLoading(false);
        return;
      }

      const availabilityData = {
        slots: availabilitySlots,
        vacationMode,
        vacationStartDate,
        vacationEndDate,
        timezone,
        lastUpdated: new Date().toISOString(),
      };

      localStorage.setItem(
        "availabilityData",
        JSON.stringify(availabilityData),
      );

      // TODO: Replace with actual API call when backend is ready
      // await updateUserAvailability(availabilityData);

      setTimeout(() => {
        setIsEditing(false);
        setHasUnsavedChanges(false);
        setLoading(false);
        alert(
          t("AVAILABILITY_UPDATED_SUCCESS") ||
            "Availability successfully changed",
        );
      }, 500);
    } catch (error) {
      console.error("Error saving availability:", error);
      alert(t("SAVE_ERROR"));
      setLoading(false);
    }
  };

  const handleCancelClick = () => {
    const savedAvailability = JSON.parse(
      localStorage.getItem("availabilityData") || "null",
    );
    if (savedAvailability) {
      setAvailabilitySlots(savedAvailability.slots || []);
      setVacationMode(savedAvailability.vacationMode || false);
      setVacationStartDate(savedAvailability.vacationStartDate || "");
      setVacationEndDate(savedAvailability.vacationEndDate || "");
      setTimezone(savedAvailability.timezone || "UTC");
    } else {
      setAvailabilitySlots([]);
      setVacationMode(false);
      setVacationStartDate("");
      setVacationEndDate("");
      setTimezone("UTC");
    }

    setIsEditing(false);
    setHasUnsavedChanges(false);
  };

  const handleUseCurrentTimezone = () => {
    const detected = getCurrentTimezoneInfo();
    setTimezone(detected.value);
    setCurrentTimezoneInfo(detected);
  };

  const selectedTimezoneDisplay =
    allAvailableTimezones.find((tz) => tz.value === timezone)?.label ||
    timezone;

  return (
    <div className="flex flex-col border p-6 rounded-lg w-full">
      {isEditing ? (
        <div className="mb-6">
          {/* Timezone Selection */}
          <div className="mb-6">
            <label
              htmlFor="timezone-select"
              className="block tracking-wide text-gray-700 text-xs font-bold mb-2"
            >
              {t("TIMEZONE")}
            </label>
            <div className="flex items-center gap-2">
              <select
                id="timezone-select"
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                className="appearance-none block w-full max-w-lg bg-white text-gray-700 border border-gray-300 rounded py-2 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              >
                {/* Grouping by UTC offset for better readability */}
                {/* This is a more advanced grouping, for simplicity, mapping directly */}
                {allAvailableTimezones.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <button
                onClick={handleUseCurrentTimezone}
                className="py-2 px-4 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 text-sm whitespace-nowrap"
                aria-label={t("Use my current timezone")}
              >
                {t("Use My Current")}
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {t("CURRENT_DETECTED_TIMEZONE")}:{" "}
              <span className="font-semibold">
                {currentTimezoneInfo.userFriendlyName ||
                  currentTimezoneInfo.value}{" "}
                {currentTimezoneInfo.displayOffset
                  ? `(${currentTimezoneInfo.displayOffset})`
                  : ""}
              </span>
            </p>
          </div>

          {/* Vacation Mode */}
          <div className="mb-6">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={vacationMode}
                onChange={(e) => setVacationMode(e.target.checked)}
                className="mr-2 h-4 w-4"
              />
              <span className="tracking-wide text-gray-700 text-xs font-bold">
                {t("VACATION_MODE")}
              </span>
            </label>
            <p className="text-xs text-gray-500 mt-1 ml-6">
              {t("VACATION_MODE_DESCRIPTION")}
            </p>
          </div>

          {/* Vacation Dates */}
          {vacationMode && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 ml-6">
              <div>
                <label
                  htmlFor="vacation-start-date"
                  className="block tracking-wide text-gray-700 text-xs font-bold mb-2"
                >
                  {t("VACATION_START_DATE")}
                </label>
                <input
                  id="vacation-start-date"
                  type="date"
                  value={vacationStartDate}
                  onChange={(e) => setVacationStartDate(e.target.value)}
                  className="appearance-none block w-full bg-white text-gray-700 border border-gray-300 rounded py-2 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                />
              </div>
              <div>
                <label
                  htmlFor="vacation-end-date"
                  className="block tracking-wide text-gray-700 text-xs font-bold mb-2"
                >
                  {t("VACATION_END_DATE")}
                </label>
                <input
                  id="vacation-end-date"
                  type="date"
                  value={vacationEndDate}
                  onChange={(e) => setVacationEndDate(e.target.value)}
                  className="appearance-none block w-full bg-white text-gray-700 border border-gray-300 rounded py-2 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                />
              </div>
            </div>
          )}

          {/* Availability Slots */}
          <div className="mb-6">
            <h4 className="text-lg font-medium mb-2">
              {t("Your available time slots")}
            </h4>

            {availabilitySlots.map((slot) => (
              <div
                key={slot.id}
                className="flex flex-col sm:flex-row items-center gap-3 mb-3"
              >
                <select
                  value={slot.frequency}
                  onChange={(e) =>
                    handleSlotChange(slot.id, "frequency", e.target.value)
                  }
                  className="appearance-none block w-full sm:w-auto bg-white text-gray-700 border border-gray-300 rounded py-2 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                >
                  {frequencyOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>

                <div className="relative w-full sm:w-auto">
                  <input
                    type="time"
                    value={slot.startTime}
                    onChange={(e) =>
                      handleSlotChange(slot.id, "startTime", e.target.value)
                    }
                    className="appearance-none block w-full bg-white text-gray-700 border border-gray-300 rounded py-2 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500 pl-8"
                  />
                  <FiClock className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500" />
                </div>

                <div className="relative w-full sm:w-auto">
                  <input
                    type="time"
                    value={slot.endTime}
                    onChange={(e) =>
                      handleSlotChange(slot.id, "endTime", e.target.value)
                    }
                    className="appearance-none block w-full bg-white text-gray-700 border border-gray-300 rounded py-2 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500 pl-8"
                  />
                  <FiClock className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500" />
                </div>

                <button
                  onClick={() => handleRemoveSlot(slot.id)}
                  className="text-red-500 hover:text-red-700 p-2"
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

          {/* Action Buttons */}
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
          {/* Display Mode */}

          {/* Timezone Display */}
          <div className="mb-4">
            <label className="block tracking-wide text-gray-700 text-xs font-bold mb-2">
              {t("TIMEZONE")}
            </label>
            <p className="text-lg text-gray-900">{selectedTimezoneDisplay}</p>
          </div>

          {/* Vacation Mode Display */}
          {vacationMode && (
            <div className="bg-yellow-50 border border-yellow-200 rounded p-4 mb-4">
              <p className="text-yellow-800 font-bold">
                {t("VACATION_MODE_ACTIVE")}
              </p>
              {vacationStartDate && vacationEndDate && (
                <p className="text-yellow-700 text-sm">
                  {new Date(vacationStartDate).toLocaleDateString()} -{" "}
                  {new Date(vacationEndDate).toLocaleDateString()}
                </p>
              )}
            </div>
          )}

          {/* Availability Slots Display */}
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
                      {/* APPLY THE NEW HELPER FUNCTION HERE */}
                      {convertTo12HourFormat(slot.startTime)} -{" "}
                      {convertTo12HourFormat(slot.endTime)}
                    </p>
                  </div>
                ))}
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
