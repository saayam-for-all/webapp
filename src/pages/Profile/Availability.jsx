import React, { useState, useEffect, useRef, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { FaPlus, FaTrashAlt } from "react-icons/fa";
import { FiClock } from "react-icons/fi";
import LoadingIndicator from "../../common/components/Loading/Loading";

const getTimezoneDetails = (timezoneValue, locale = "en-US") => {
  try {
    const now = new Date();

    const offsetFormatter = new Intl.DateTimeFormat(locale, {
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
    const offsetMatch = formattedOffsetDate.match(
      /GMT([+-]\d{2}:\d{2})|UTC([+-]\d{2}:\d{2})/,
    );
    const utcOffset = offsetMatch
      ? `UTC${offsetMatch[1] || offsetMatch[2]}`
      : "";
    const userFriendlyNameFormatter = new Intl.DateTimeFormat(locale, {
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
    return date.toLocaleTimeString(currentLocale, {
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
  const { t, i18n } = useTranslation();
  const { t: tAvailability } = useTranslation("availability");
  const [isEditing, setIsEditing] = useState(false);
  const [availabilitySlots, setAvailabilitySlots] = useState([]);
  const [loading, setLoading] = useState(false);

  const [vacationMode, setVacationMode] = useState(false);
  const [vacationStartDate, setVacationStartDate] = useState("");
  const [vacationEndDate, setVacationEndDate] = useState("");
  const [timezone, setTimezone] = useState("UTC");

  const currentLocale = i18n.language || "en-US";

  const titleRef = useRef(null);
  const frequencyOptions = [
    { value: "Everyday", label: tAvailability("EVERYDAY") },
    { value: "Weekdays", label: tAvailability("WEEKDAYS") },
    { value: "Weekends", label: tAvailability("WEEKENDS") },
    { value: "Monday", label: tAvailability("MONDAY") },
    { value: "Tuesday", label: tAvailability("TUESDAY") },
    { value: "Wednesday", label: tAvailability("WEDNESDAY") },
    { value: "Thursday", label: tAvailability("THURSDAY") },
    { value: "Friday", label: tAvailability("FRIDAY") },
    { value: "Saturday", label: tAvailability("SATURDAY") },
    { value: "Sunday", label: tAvailability("SUNDAY") },
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

    return commonTimezones.map((tz) => getTimezoneDetails(tz, currentLocale));
  }, [currentLocale]);
  const getCurrentTimezoneInfo = () => {
    const detectedTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    return getTimezoneDetails(detectedTimezone, currentLocale);
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
        setCurrentTimezoneInfo(
          getTimezoneDetails(detectedTimezone, currentLocale),
        );
      } else {
        setTimezone("UTC");
        setCurrentTimezoneInfo(getTimezoneDetails("UTC", currentLocale));
      }
    }
  }, [allAvailableTimezones, currentLocale]);

  useEffect(() => {
    const detectedTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    setCurrentTimezoneInfo(getTimezoneDetails(detectedTimezone, currentLocale));
  }, [currentLocale]);

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
        return {
          isValid: false,
          message: tAvailability("AVAILABILITY_VALIDATION_ERROR"),
        };
      }
      if (slot.startTime === slot.endTime) {
        return {
          isValid: false,
          message: tAvailability("START_END_TIMES_MUST_BE_DIFFERENT"),
        };
      }
    }
    return { isValid: true };
  };

  const validateVacationDates = () => {
    if (vacationMode && vacationStartDate && vacationEndDate) {
      if (new Date(vacationStartDate) >= new Date(vacationEndDate)) {
        return {
          isValid: false,
          message: tAvailability("VACATION_START_BEFORE_END"),
        };
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
          tAvailability("AVAILABILITY_UPDATED_SUCCESS") ||
            "Availability successfully changed",
        );
      }, 500);
    } catch (error) {
      console.error("Error saving availability:", error);
      alert(tAvailability("SAVE_ERROR"));
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
    getTimezoneDetails(timezone, currentLocale).label;

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="space-y-1">
        <h2 className="text-xl font-semibold text-gray-900">
          {tAvailability("AVAILABILITY")}
        </h2>
        <p className="text-sm text-gray-500">
          {tAvailability("AVAILABILITY_DESCRIPTION")}
        </p>
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        {isEditing ? (
          <div className="space-y-6">
            {/* Timezone Selection */}
            <div className="space-y-2">
              <label
                htmlFor="timezone-select"
                className="text-sm font-semibold text-gray-700"
              >
                {tAvailability("TIMEZONE")}
              </label>
              <div className="flex items-center gap-3">
                <select
                  id="timezone-select"
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                  className="flex-1 max-w-lg bg-gray-50 text-gray-700 border border-gray-200 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
                >
                  {allAvailableTimezones.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <button
                  onClick={handleUseCurrentTimezone}
                  className="py-2.5 px-4 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm font-medium whitespace-nowrap transition-all duration-200"
                  aria-label={tAvailability("USE_CURRENT_TIMEZONE")}
                >
                  {tAvailability("USE_CURRENT_TIMEZONE")}
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {tAvailability("CURRENT_DETECTED_TIMEZONE")}:{" "}
                <span className="font-medium text-gray-700">
                  {currentTimezoneInfo.userFriendlyName ||
                    currentTimezoneInfo.value}{" "}
                  {currentTimezoneInfo.displayOffset
                    ? `(${currentTimezoneInfo.displayOffset})`
                    : ""}
                </span>
              </p>
            </div>

            {/* Vacation Mode */}
            <div className="bg-amber-50 rounded-lg p-4 border border-amber-100">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={vacationMode}
                  onChange={(e) => setVacationMode(e.target.checked)}
                  className="mr-3 h-4 w-4 rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                />
                <span className="text-sm font-semibold text-amber-800">
                  {tAvailability("VACATION_MODE")}
                </span>
              </label>
              <p className="text-xs text-amber-700 mt-2 ml-7">
                {tAvailability("VACATION_MODE_DESCRIPTION")}
              </p>

              {/* Vacation Dates */}
              {vacationMode && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 ml-7">
                  <div className="space-y-2">
                    <label
                      htmlFor="vacation-start-date"
                      className="text-sm font-medium text-amber-800"
                    >
                      {tAvailability("VACATION_START_DATE")}
                    </label>
                    <input
                      id="vacation-start-date"
                      type="date"
                      value={vacationStartDate}
                      onChange={(e) => setVacationStartDate(e.target.value)}
                      className="w-full bg-white text-gray-700 border border-amber-200 rounded-lg py-2.5 px-4 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all duration-200"
                    />
                  </div>
                  <div className="space-y-2">
                    <label
                      htmlFor="vacation-end-date"
                      className="text-sm font-medium text-amber-800"
                    >
                      {tAvailability("VACATION_END_DATE")}
                    </label>
                    <input
                      id="vacation-end-date"
                      type="date"
                      value={vacationEndDate}
                      onChange={(e) => setVacationEndDate(e.target.value)}
                      className="w-full bg-white text-gray-700 border border-amber-200 rounded-lg py-2.5 px-4 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all duration-200"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Availability Slots */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-gray-700">
                {tAvailability("YOUR_AVAILABLE_TIME_SLOTS")}
              </h4>

              <div className="space-y-3">
                {availabilitySlots.map((slot) => (
                  <div
                    key={slot.id}
                    className="flex flex-col sm:flex-row items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-100"
                  >
                    <select
                      value={slot.frequency}
                      onChange={(e) =>
                        handleSlotChange(slot.id, "frequency", e.target.value)
                      }
                      className="w-full sm:w-40 bg-white text-gray-700 border border-gray-200 rounded-lg py-2.5 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
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
                        className="w-full bg-white text-gray-700 border border-gray-200 rounded-lg py-2.5 px-4 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
                      />
                      <FiClock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    </div>

                    <span className="text-gray-400 hidden sm:block">—</span>

                    <div className="relative w-full sm:w-auto">
                      <input
                        type="time"
                        value={slot.endTime}
                        onChange={(e) =>
                          handleSlotChange(slot.id, "endTime", e.target.value)
                        }
                        className="w-full bg-white text-gray-700 border border-gray-200 rounded-lg py-2.5 px-4 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
                      />
                      <FiClock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    </div>

                    <button
                      onClick={() => handleRemoveSlot(slot.id)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-colors"
                      aria-label={tAvailability("REMOVE_TIME_SLOT")}
                    >
                      <FaTrashAlt />
                    </button>
                  </div>
                ))}
              </div>

              <button
                onClick={handleAddSlot}
                className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 py-2.5 px-4 rounded-lg font-medium transition-all duration-200"
              >
                <FaPlus className="w-3 h-3" />
                <span>{tAvailability("ADD_TIME_SLOT")}</span>
              </button>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end pt-4 border-t border-gray-100">
              <div className="flex gap-3">
                <button
                  disabled={loading}
                  className="inline-flex items-center gap-2 py-2.5 px-6 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-all duration-200 disabled:opacity-50"
                  onClick={handleCancelClick}
                >
                  {t("CANCEL")}
                </button>
                <button
                  disabled={loading}
                  className="inline-flex items-center gap-2 py-2.5 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-200 disabled:opacity-50"
                  onClick={handleSaveClick}
                >
                  <span>{t("SAVE")}</span>
                  {loading && <LoadingIndicator size="20px" />}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Timezone Display */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">
                {tAvailability("TIMEZONE")}
              </label>
              <p className="text-base text-gray-900 py-3 px-4 bg-gray-50 rounded-lg border border-gray-100">
                {selectedTimezoneDisplay}
              </p>
            </div>

            {/* Vacation Mode Display */}
            {vacationMode && (
              <div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
                <p className="text-amber-800 font-semibold flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                  {tAvailability("VACATION_MODE_ACTIVE")}
                </p>
                {vacationStartDate && vacationEndDate && (
                  <p className="text-amber-700 text-sm mt-1 ml-4">
                    {new Date(vacationStartDate).toLocaleDateString()} -{" "}
                    {new Date(vacationEndDate).toLocaleDateString()}
                  </p>
                )}
              </div>
            )}

            {/* Availability Slots Display */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-gray-700">
                {tAvailability("YOUR_AVAILABLE_TIME_SLOTS")}
              </h4>
              {availabilitySlots.length > 0 ? (
                <div className="space-y-2">
                  {availabilitySlots.map((slot) => (
                    <div
                      key={slot.id}
                      className="bg-gray-50 p-4 rounded-lg border border-gray-100"
                    >
                      <p className="text-gray-900">
                        <span className="font-medium text-blue-700">
                          {frequencyOptions.find(
                            (opt) => opt.value === slot.frequency,
                          )?.label || slot.frequency}
                          :
                        </span>{" "}
                        {convertTo12HourFormat(slot.startTime)} —{" "}
                        {convertTo12HourFormat(slot.endTime)}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-100">
                  <FiClock className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                  <p className="text-gray-500">
                    {tAvailability("NO_AVAILABILITY_SLOTS")}
                  </p>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end pt-4 border-t border-gray-100">
              <button
                className="inline-flex items-center gap-2 py-2.5 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-200"
                onClick={handleEditClick}
              >
                {t("EDIT")}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Availability;
