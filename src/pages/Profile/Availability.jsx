import React, { useState, useEffect, useRef, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { FaPlus, FaTrashAlt } from "react-icons/fa";
import { FiClock } from "react-icons/fi";
import LoadingIndicator from "../../common/components/Loading/Loading";
import { useSelector } from "react-redux";
import {
  fetchUserAvailability,
  updateUserAvailability,
  convertUserAvailabilityTimezone,
} from "../../services/volunteerServices";

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
      label: userFriendlyName || timezoneValue,
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

// The locale is passed in: it used to read a `currentLocale` that does not
// exist in this scope, which threw, logged a console error and fell back to
// 24-hour time for every slot.
const convertTo12HourFormat = (time24h, locale = "en-US") => {
  if (!time24h) return "";
  try {
    const [hours, minutes] = time24h.split(":").map(Number);
    const date = new Date();
    date.setHours(hours, minutes, 0, 0);
    return date.toLocaleTimeString(locale, {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  } catch (e) {
    console.error("Error converting time to 12-hour format:", time24h, e);
    return time24h;
  }
};

// Slots as the API returns them -> slots the form uses.
const mapApiSlots = (slots) =>
  (slots || []).map((slot, index) => ({
    id: slot.id ?? Date.now() + index,
    frequency: slot.frequency,
    startTime: (slot.startTime || "").slice(0, 5),
    endTime: (slot.endTime || "").slice(0, 5),
  }));

// Only frequency and times are sent to the API (no ids).
const slotsForApi = (slots) =>
  slots.map(({ frequency, startTime, endTime }) => ({
    frequency,
    startTime,
    endTime,
  }));

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
  // Issue #2020: availability is now loaded from and saved to the API.
  const userDbId = useSelector((state) => state.auth?.user?.userDbId);
  const [fetching, setFetching] = useState(false);
  // Issue #51 (BRD Profile > Availability)
  const [lastUpdatedAt, setLastUpdatedAt] = useState(null); // FR-17
  const [savedTimezone, setSavedTimezone] = useState(null); // FR-19
  const [slotErrors, setSlotErrors] = useState({}); // FR-13
  const [vacationError, setVacationError] = useState(""); // FR-13
  const [saveError, setSaveError] = useState(null); // FR-14: { message, canRetry }
  const [showConversionDialog, setShowConversionDialog] = useState(false);
  // Timezone and slot count as last saved on the server (ba #51 / volunteer #235)
  const serverStateRef = useRef({ timezone: null, slotCount: 0 });
  // Values as they were when edit mode opened, to detect unsaved changes (FR-12)
  const editSnapshotRef = useRef(null);

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

  // Issue #2020: load saved availability from the API when the tab opens.
  useEffect(() => {
    if (!userDbId) return;
    let cancelled = false;
    const loadAvailability = async () => {
      setFetching(true);
      try {
        const response = await fetchUserAvailability(userDbId);
        if (cancelled) return;
        const data = response?.data || {};
        const apiSlots = mapApiSlots(data.slots);
        setAvailabilitySlots(apiSlots);
        serverStateRef.current = {
          timezone: data.timezone || null,
          slotCount: apiSlots.length,
        };
        // "UTC" means no timezone saved yet: keep the detected timezone.
        if (data.timezone && data.timezone !== "UTC") {
          setTimezone(data.timezone);
          setSavedTimezone(data.timezone);
        }
        setLastUpdatedAt(data.lastUpdatedAt || null);
        // Keep the existing localStorage copy in step with the API so that
        // Cancel restores the saved values. Vacation mode is not in the API
        // yet, so the vacation values already stored are kept.
        const stored = JSON.parse(
          localStorage.getItem("availabilityData") || "null",
        );
        localStorage.setItem(
          "availabilityData",
          JSON.stringify({
            ...(stored || {}),
            slots: apiSlots,
            timezone: data.timezone || "UTC",
          }),
        );
      } catch (error) {
        console.error("Failed to fetch availability from API:", error);
      } finally {
        if (!cancelled) setFetching(false);
      }
    };
    loadAvailability();
    return () => {
      cancelled = true;
    };
  }, [userDbId]);

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

  const takeSnapshot = (overrides = {}) =>
    JSON.stringify({
      slots: slotsForApi(availabilitySlots),
      vacationMode,
      vacationStartDate,
      vacationEndDate,
      timezone,
      ...overrides,
    });

  const openEditMode = (overrides = {}) => {
    editSnapshotRef.current = takeSnapshot();
    setSlotErrors({});
    setVacationError("");
    setSaveError(null);
    setShowConversionDialog(false);
    if (overrides.timezone) setTimezone(overrides.timezone);
    setIsEditing(true);
  };

  const handleEditClick = () => {
    openEditMode();
  };

  // FR-13: each slot is checked on its own so the message can be shown
  // next to the slot it belongs to. Overnight slots are not allowed
  // (product decision on ba #51): the end time must be after the start
  // time on the same day. Times are "HH:MM", so string comparison gives
  // the right order.
  const validateTimeSlots = () => {
    const errors = {};
    for (const slot of availabilitySlots) {
      if (!slot.frequency || !slot.startTime || !slot.endTime) {
        errors[slot.id] = tAvailability("AVAILABILITY_VALIDATION_ERROR");
      } else if (slot.startTime === slot.endTime) {
        errors[slot.id] = tAvailability("START_END_TIMES_MUST_BE_DIFFERENT");
      } else if (slot.endTime < slot.startTime) {
        errors[slot.id] = tAvailability("END_TIME_MUST_BE_AFTER_START_TIME");
      }
    }
    return errors;
  };

  const validateVacationDates = () => {
    if (vacationMode && vacationStartDate && vacationEndDate) {
      if (new Date(vacationStartDate) >= new Date(vacationEndDate)) {
        return tAvailability("VACATION_START_BEFORE_END");
      }
    }
    return "";
  };

  // FR-14: show the backend's own validation message when there is one.
  // Retrying only helps for network or server errors, not for a 400.
  const showSaveError = (error) => {
    const status = error?.response?.status;
    setSaveError({
      message: error?.response?.data?.message || tAvailability("SAVE_ERROR"),
      canRetry: !status || status >= 500,
    });
  };

  // ba #51 / volunteer #235: changing the timezone of a saved schedule is
  // its own request (userId + timezone, no slots). The backend converts the
  // saved days and hours and returns them, so they are not converted twice.
  const handleTimezoneConversion = async () => {
    setLoading(true);
    try {
      const response = await convertUserAvailabilityTimezone(
        userDbId,
        timezone,
      );
      const data = response?.data || {};
      const convertedSlots = mapApiSlots(data.slots);
      const newTimezone = data.timezone || timezone;
      setAvailabilitySlots(convertedSlots);
      setTimezone(newTimezone);
      setSavedTimezone(newTimezone);
      setLastUpdatedAt(data.lastUpdatedAt || new Date().toISOString());
      serverStateRef.current = {
        timezone: newTimezone,
        slotCount: convertedSlots.length,
      };
      const stored = JSON.parse(
        localStorage.getItem("availabilityData") || "null",
      );
      localStorage.setItem(
        "availabilityData",
        JSON.stringify({
          ...(stored || {}),
          slots: convertedSlots,
          timezone: newTimezone,
        }),
      );
      setIsEditing(false);
      setHasUnsavedChanges(false);
      setLoading(false);
      alert(tAvailability("TIMEZONE_CONVERTED_SUCCESS"));
    } catch (error) {
      console.error("Error changing availability timezone:", error);
      setLoading(false);
      const message = error?.response?.data?.message || "";
      // A converted slot would cross midnight: the saved schedule is kept
      // and the volunteer has to review the slots first.
      if (
        error?.response?.status === 400 &&
        /midnight|reverses clock/i.test(message)
      ) {
        setShowConversionDialog(true);
      } else {
        showSaveError(error);
      }
    }
  };

  const handleSaveClick = async () => {
    setSaveError(null);

    const errors = validateTimeSlots();
    const vacationMessage = validateVacationDates();
    setSlotErrors(errors);
    setVacationError(vacationMessage);
    if (Object.keys(errors).length > 0 || vacationMessage) {
      return;
    }
    if (!userDbId) {
      showSaveError(new Error("No user id available to save availability"));
      return;
    }

    const server = serverStateRef.current;
    const timezoneChanged =
      Boolean(server.timezone) && timezone !== server.timezone;
    const slotsChanged =
      JSON.stringify(slotsForApi(availabilitySlots)) !==
      JSON.stringify(JSON.parse(editSnapshotRef.current || "{}").slots || []);

    if (timezoneChanged && server.slotCount > 0) {
      if (!slotsChanged) {
        await handleTimezoneConversion();
        return;
      }
      // Clearing every slot may set a new timezone in the same request.
      // Otherwise the backend refuses a new timezone together with edited
      // slots, so ask for the two changes to be saved one after the other.
      if (availabilitySlots.length > 0) {
        setSaveError({
          message: tAvailability("TIMEZONE_CHANGE_SAVE_SEPARATELY"),
          canRetry: false,
        });
        return;
      }
    }

    setLoading(true);
    try {
      const availabilityData = {
        slots: availabilitySlots,
        vacationMode,
        vacationStartDate,
        vacationEndDate,
        timezone,
        lastUpdated: new Date().toISOString(),
      };

      // Issue #2020: save to the API. Only frequency and times are sent for
      // each slot, with an IANA timezone. Vacation mode is not in the API
      // yet, so the service always sends it empty.
      const response = await updateUserAvailability(
        userDbId,
        timezone,
        slotsForApi(availabilitySlots),
      );
      serverStateRef.current = {
        timezone,
        slotCount: availabilitySlots.length,
      };

      localStorage.setItem(
        "availabilityData",
        JSON.stringify(availabilityData),
      );
      setSavedTimezone(timezone);
      setLastUpdatedAt(
        response?.data?.lastUpdatedAt || availabilityData.lastUpdated,
      );

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
      // FR-14: the message is shown in the form and the edits are kept.
      showSaveError(error);
      setLoading(false);
    }
  };

  // Dialog for a conversion that would cross midnight: go back to the saved
  // timezone so the volunteer can change the slots, then change timezone.
  const handleConversionDialogEdit = () => {
    setTimezone(serverStateRef.current.timezone);
    setShowConversionDialog(false);
  };

  const handleCancelClick = () => {
    // FR-12: warn before throwing away changes the volunteer has made.
    if (
      editSnapshotRef.current &&
      takeSnapshot() !== editSnapshotRef.current &&
      !window.confirm(tAvailability("DISCARD_CHANGES_CONFIRM"))
    ) {
      return;
    }

    const savedAvailability = JSON.parse(
      localStorage.getItem("availabilityData") || "null",
    );
    // FR-07: "UTC" or nothing stored means no timezone was saved yet, so
    // fall back to the detected timezone instead of UTC.
    const detectedTimezone = getCurrentTimezoneInfo().value;
    const restoredTimezone =
      savedAvailability?.timezone && savedAvailability.timezone !== "UTC"
        ? savedAvailability.timezone
        : detectedTimezone;
    if (savedAvailability) {
      setAvailabilitySlots(savedAvailability.slots || []);
      setVacationMode(savedAvailability.vacationMode || false);
      setVacationStartDate(savedAvailability.vacationStartDate || "");
      setVacationEndDate(savedAvailability.vacationEndDate || "");
    } else {
      setAvailabilitySlots([]);
      setVacationMode(false);
      setVacationStartDate("");
      setVacationEndDate("");
    }
    setTimezone(restoredTimezone);

    setSlotErrors({});
    setVacationError("");
    setSaveError(null);
    setShowConversionDialog(false);
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

  // FR-19: only when a timezone was actually saved and it is not the
  // browser's current one.
  const timezoneMismatch =
    Boolean(savedTimezone) &&
    timezone === savedTimezone &&
    savedTimezone !== currentTimezoneInfo.value;

  const formattedLastUpdated = (() => {
    if (!lastUpdatedAt) return "";
    const date = new Date(lastUpdatedAt);
    if (Number.isNaN(date.getTime())) return "";
    try {
      return date.toLocaleString(currentLocale, {
        dateStyle: "medium",
        timeStyle: "short",
      });
    } catch (e) {
      return date.toLocaleString();
    }
  })();

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
              {tAvailability("TIMEZONE")}
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
                aria-label={tAvailability("USE_CURRENT_TIMEZONE")}
              >
                {tAvailability("USE_CURRENT_TIMEZONE")}
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {tAvailability("CURRENT_DETECTED_TIMEZONE")}:{" "}
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
                {tAvailability("VACATION_MODE")}
              </span>
            </label>
            <p className="text-xs text-gray-500 mt-1 ml-6">
              {tAvailability("VACATION_MODE_DESCRIPTION")}
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
                  {tAvailability("VACATION_START_DATE")}
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
                  {tAvailability("VACATION_END_DATE")}
                </label>
                <input
                  id="vacation-end-date"
                  type="date"
                  value={vacationEndDate}
                  onChange={(e) => setVacationEndDate(e.target.value)}
                  className="appearance-none block w-full bg-white text-gray-700 border border-gray-300 rounded py-2 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                />
              </div>
              {vacationError && (
                <p role="alert" className="text-red-600 text-sm md:col-span-2">
                  {vacationError}
                </p>
              )}
            </div>
          )}

          {/* Availability Slots */}
          <div className="mb-6">
            <h4 className="text-lg font-medium mb-2">
              {tAvailability("YOUR_AVAILABLE_TIME_SLOTS")}
            </h4>

            {availabilitySlots.map((slot) => (
              <div key={slot.id} className="mb-3">
                <div className="flex flex-col sm:flex-row items-center gap-3">
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
                    aria-label={tAvailability("REMOVE_TIME_SLOT")}
                  >
                    <FaTrashAlt />
                  </button>
                </div>
                {slotErrors[slot.id] && (
                  <p role="alert" className="text-red-600 text-sm mt-1">
                    {slotErrors[slot.id]}
                  </p>
                )}
              </div>
            ))}

            <button
              onClick={handleAddSlot}
              className="flex items-center gap-2 text-blue-500 hover:text-blue-700 mt-2 bg-blue-100 py-2 px-4 rounded-md"
            >
              <FaPlus />
              <span>{tAvailability("ADD_TIME_SLOT")}</span>
            </button>
          </div>

          {/* FR-14: failed save, with a retry */}
          {saveError && (
            <div
              role="alert"
              className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-red-50 border border-red-200 rounded p-4 mb-4"
            >
              <p className="text-red-700">{saveError.message}</p>
              {saveError.canRetry && (
                <button
                  onClick={handleSaveClick}
                  disabled={loading}
                  className="py-2 px-4 bg-red-600 text-white rounded-md hover:bg-red-700 whitespace-nowrap"
                >
                  {tAvailability("RETRY")}
                </button>
              )}
            </div>
          )}

          {/* A timezone change would make some slots cross midnight */}
          {showConversionDialog && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 p-4">
              <div
                role="alertdialog"
                aria-modal="true"
                aria-labelledby="availability-conversion-title"
                className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full"
              >
                <h3
                  id="availability-conversion-title"
                  className="text-lg font-semibold mb-2"
                >
                  {tAvailability("SLOTS_NEED_ATTENTION_TITLE")}
                </h3>
                <p className="text-gray-700 mb-4">
                  {tAvailability("SLOTS_NEED_ATTENTION_MESSAGE")}
                </p>
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setShowConversionDialog(false)}
                    className="py-2 px-4 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                  >
                    {t("CANCEL")}
                  </button>
                  <button
                    onClick={handleConversionDialogEdit}
                    className="py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                  >
                    {tAvailability("EDIT_SLOTS")}
                  </button>
                </div>
              </div>
            </div>
          )}

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

          {/* FR-16: loading state while availability is fetched */}
          {fetching && (
            <div
              role="status"
              className="flex items-center justify-center gap-2 p-4 mb-4 text-gray-600"
            >
              <LoadingIndicator size="24px" />
              <span>{tAvailability("LOADING_AVAILABILITY")}</span>
            </div>
          )}

          {/* FR-19: saved timezone differs from the browser's timezone */}
          {!fetching && timezoneMismatch && (
            <div
              role="status"
              className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-blue-50 border border-blue-200 rounded p-4 mb-4"
            >
              <p className="text-blue-800 text-sm">
                {tAvailability("TIMEZONE_MISMATCH_NOTICE", {
                  saved: selectedTimezoneDisplay,
                  detected:
                    currentTimezoneInfo.userFriendlyName ||
                    currentTimezoneInfo.value,
                })}
              </p>
              <button
                onClick={() =>
                  openEditMode({ timezone: currentTimezoneInfo.value })
                }
                className="py-2 px-4 bg-white text-blue-700 border border-blue-300 rounded-md hover:bg-blue-100 text-sm whitespace-nowrap"
              >
                {tAvailability("USE_CURRENT_TIMEZONE")}
              </button>
            </div>
          )}

          {/* Timezone Display */}
          <div className="mb-4">
            <label className="block tracking-wide text-gray-700 text-xs font-bold mb-2">
              {tAvailability("TIMEZONE")}
            </label>
            <p className="text-lg text-gray-900">{selectedTimezoneDisplay}</p>
          </div>

          {/* Vacation Mode Display */}
          {vacationMode && (
            <div className="bg-yellow-50 border border-yellow-200 rounded p-4 mb-4">
              <p className="text-yellow-800 font-bold">
                {tAvailability("VACATION_MODE_ACTIVE")}
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
          {fetching ? null : availabilitySlots.length > 0 ? (
            <div className="mb-6">
              <h4 className="text-lg font-medium mb-2">
                {tAvailability("YOUR_AVAILABLE_TIME_SLOTS")}
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
                      {convertTo12HourFormat(slot.startTime, currentLocale)} -{" "}
                      {convertTo12HourFormat(slot.endTime, currentLocale)}{" "}
                      {/* FR-18: never show a bare time without its timezone */}
                      <span className="text-gray-500 text-sm">
                        ({selectedTimezoneDisplay})
                      </span>
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center p-6 bg-gray-50 rounded-lg mb-6">
              <p className="text-gray-500">
                {tAvailability("NO_AVAILABILITY_SLOTS")}
              </p>
            </div>
          )}

          {/* FR-17: when availability was last saved */}
          {!fetching && formattedLastUpdated && (
            <p className="text-xs text-gray-500 text-center mb-4">
              {tAvailability("LAST_UPDATED")}: {formattedLastUpdated}
            </p>
          )}

          <div className="flex justify-center">
            <button
              className="py-2 px-6 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              onClick={handleEditClick}
              disabled={fetching}
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
