import { useState, useEffect, useRef, useMemo } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { FaPlus, FaTrashAlt } from "react-icons/fa";
import { FiClock } from "react-icons/fi";
import { useSelector } from "react-redux";
import {
  fetchAvailability,
  saveAvailability,
} from "../../services/availabilityService";
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

const convertTo12HourFormat = (time24h, currentLocale) => {
  if (!time24h) return "";
  try {
    const [hours, minutes] = time24h.split(":").map(Number);
    const date = new Date(Date.UTC(2000, 0, 1, hours, minutes));
    return date.toLocaleTimeString(currentLocale, {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
      timeZone: "UTC",
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
  const userId = useSelector((state) => state.auth?.user?.userDbId);
  const currentUser = useRef(userId);
  currentUser.current = userId;
  const [loadedUser, setLoadedUser] = useState(null);
  const [saved, setSaved] = useState(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [retry, setRetry] = useState(0);
  const nextSlotId = useRef(0);
  const requestEpoch = useRef(0);

  const restore = (data) => {
    setAvailabilitySlots(
      data.slots.map((slot) => ({ ...slot, id: ++nextSlotId.current })),
    );
    setVacationMode(false);
    setVacationStartDate("");
    setVacationEndDate("");
    setTimezone(
      data.timezone ||
        Intl.DateTimeFormat().resolvedOptions().timeZone ||
        "UTC",
    );
  };

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
    let active = true;
    requestEpoch.current += 1;
    setLoadedUser(null);
    setSaved(null);
    setIsEditing(false);
    setError("");
    setNotice("");
    if (!userId) return;
    setLoading(true);
    fetchAvailability(userId)
      .then((data) => {
        if (!active) return;
        setSaved(data);
        restore(data);
        setLoadedUser(userId);
      })
      .catch(() => {
        if (active) setError("load");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [userId, retry]);

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
      {
        id: ++nextSlotId.current,
        frequency: "Everyday",
        startTime: "",
        endTime: "",
      },
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
    setError("");
    setNotice("");
    setIsEditing(true);
  };

  const validateTimeSlots = () => {
    if (availabilitySlots.length > 20)
      return {
        isValid: false,
        message: tAvailability("MAX_SLOTS", {
          defaultValue: "You can save up to 20 time slots.",
        }),
      };
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

  const handleSaveClick = async () => {
    const savingUser = userId;
    const epoch = requestEpoch.current;
    setLoading(true);
    setError("");

    try {
      const slotsValidation = validateTimeSlots();
      if (!slotsValidation.isValid) {
        setError(slotsValidation.message);
        setLoading(false);
        return;
      }

      const availabilityData = {
        slots: availabilitySlots,
        vacationMode,
        vacationStartDate,
        vacationEndDate,
        timezone,
      };

      const data = await saveAvailability(savingUser, availabilityData);
      if (currentUser.current !== savingUser || requestEpoch.current !== epoch)
        return;
      setSaved(data);
      restore(data);
      setIsEditing(false);
      setHasUnsavedChanges(false);
      setNotice(tAvailability("AVAILABILITY_UPDATED_SUCCESS"));
    } catch (error) {
      if (
        currentUser.current === savingUser &&
        requestEpoch.current === epoch
      ) {
        const status = error?.response?.status;
        const message = error?.response?.data?.message;
        setError(
          status === 400 && typeof message === "string" && message.length < 500
            ? message
            : status === 409
              ? "conflict"
              : "save",
        );
      }
    } finally {
      if (currentUser.current === savingUser && requestEpoch.current === epoch)
        setLoading(false);
    }
  };

  const handleCancelClick = () => {
    if (
      !window.confirm(
        tAvailability("DISCARD_CHANGES", {
          defaultValue: "Discard unsaved changes?",
        }),
      )
    )
      return;
    restore(saved);
    setError("");

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

  if (!userId)
    return (
      <p role="status">
        {tAvailability("SIGN_IN_REQUIRED", {
          defaultValue: "Sign in to view availability.",
        })}
      </p>
    );
  if (loadedUser !== userId)
    return error === "load" ? (
      <div role="alert">
        <p>
          {tAvailability("LOAD_ERROR", {
            defaultValue: "Availability could not be loaded.",
          })}
        </p>
        <button onClick={() => setRetry((value) => value + 1)}>
          {tAvailability("RETRY", { defaultValue: "Retry" })}
        </button>
      </div>
    ) : (
      <div role="status">
        <LoadingIndicator size="24px" />
        {tAvailability("LOADING", { defaultValue: "Loading availability..." })}
      </div>
    );

  return (
    <div className="flex flex-col border p-6 rounded-lg w-full">
      {notice && (
        <p role="status" className="mb-3 text-green-700">
          {notice}
        </p>
      )}
      {error && (
        <div role="alert" className="mb-3 text-red-700">
          {error === "save"
            ? tAvailability("SAVE_ERROR", {
                defaultValue:
                  "Availability could not be saved. Please try again.",
              })
            : error === "conflict"
              ? tAvailability("CONFLICT", {
                  defaultValue:
                    "Availability changed elsewhere. Reload before saving again.",
                })
              : error}
          {error === "conflict" && (
            <button
              disabled={loading}
              onClick={() => {
                if (
                  window.confirm(
                    tAvailability("DISCARD_CHANGES", {
                      defaultValue: "Discard unsaved changes?",
                    }),
                  )
                )
                  setRetry((value) => value + 1);
              }}
            >
              {tAvailability("RELOAD", { defaultValue: "Reload" })}
            </button>
          )}
        </div>
      )}
      {isEditing ? (
        <fieldset disabled={loading} className="mb-6 min-w-0">
          {/* Timezone Selection */}
          <div className="mb-6">
            <label
              htmlFor="timezone-select"
              className="block tracking-wide text-gray-700 text-xs font-bold mb-2"
            >
              {tAvailability("TIMEZONE")}
            </label>
            <div className="flex flex-wrap items-center gap-2">
              <select
                id="timezone-select"
                ref={titleRef}
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                className="appearance-none block w-full max-w-lg bg-white text-gray-700 border border-gray-300 rounded py-2 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              >
                {!allAvailableTimezones.some(
                  (option) => option.value === timezone,
                ) && (
                  <option value={timezone}>{selectedTimezoneDisplay}</option>
                )}
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
                className="py-2 px-4 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 text-sm"
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
                disabled
                checked={vacationMode}
                onChange={(e) => setVacationMode(e.target.checked)}
                className="mr-2 h-4 w-4"
              />
              <span className="tracking-wide text-gray-700 text-xs font-bold">
                {tAvailability("VACATION_MODE")}
              </span>
            </label>
            <p className="text-xs text-gray-500 mt-1 ml-6">
              {tAvailability("VACATION_UNAVAILABLE", {
                defaultValue:
                  "Vacation settings are not available yet and are not saved.",
              })}
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
            </div>
          )}

          {/* Availability Slots */}
          <div className="mb-6">
            <h4 className="text-lg font-medium mb-2">
              {tAvailability("YOUR_AVAILABLE_TIME_SLOTS")}
            </h4>

            {availabilitySlots.map((slot, index) => (
              <div
                key={slot.id}
                className="flex flex-col sm:flex-row items-center gap-3 mb-3"
              >
                <select
                  aria-label={tAvailability("SLOT_FREQUENCY", {
                    defaultValue: "Slot {{number}} frequency",
                    number: index + 1,
                  })}
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
                    aria-label={tAvailability("SLOT_START", {
                      defaultValue: "Slot {{number}} start time",
                      number: index + 1,
                    })}
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
                    aria-label={tAvailability("SLOT_END", {
                      defaultValue: "Slot {{number}} end time",
                      number: index + 1,
                    })}
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
            ))}

            <button
              onClick={handleAddSlot}
              className="flex items-center gap-2 text-blue-500 hover:text-blue-700 mt-2 bg-blue-100 py-2 px-4 rounded-md"
            >
              <FaPlus />
              <span>{tAvailability("ADD_TIME_SLOT")}</span>
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
        </fieldset>
      ) : (
        <div>
          {/* Display Mode */}

          {/* Timezone Display */}
          <div className="mb-4">
            <label className="block tracking-wide text-gray-700 text-xs font-bold mb-2">
              {tAvailability("TIMEZONE")}
            </label>
            <p className="text-lg text-gray-900">{selectedTimezoneDisplay}</p>
            {saved?.lastUpdatedAt && (
              <p className="text-sm text-gray-600">
                {tAvailability("LAST_UPDATED", {
                  defaultValue: "Last updated",
                })}
                : {new Date(saved.lastUpdatedAt).toLocaleString(currentLocale)}
              </p>
            )}
            {timezone !== currentTimezoneInfo.value && (
              <p className="text-sm text-gray-600">
                {tAvailability("TIMEZONE_DIFFERS", {
                  defaultValue:
                    "Your saved timezone differs from your device timezone.",
                })}
              </p>
            )}
          </div>

          {/* Vacation Mode Display */}
          {vacationMode && (
            <div className="bg-yellow-50 border border-yellow-200 rounded p-4 mb-4">
              <p className="text-yellow-800 font-bold">
                {tAvailability("VACATION_MODE_ACTIVE")}
              </p>
              {vacationStartDate && vacationEndDate && (
                <p className="text-yellow-700 text-sm">
                  {new Date(`${vacationStartDate}T12:00:00`).toLocaleDateString(
                    currentLocale,
                  )}{" "}
                  -{" "}
                  {new Date(`${vacationEndDate}T12:00:00`).toLocaleDateString(
                    currentLocale,
                  )}
                </p>
              )}
            </div>
          )}

          {/* Availability Slots Display */}
          {availabilitySlots.length > 0 ? (
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
                      {/* APPLY THE NEW HELPER FUNCTION HERE */}
                      {convertTo12HourFormat(
                        slot.startTime,
                        currentLocale,
                      )} - {convertTo12HourFormat(slot.endTime, currentLocale)}{" "}
                      ({timezone})
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

Availability.propTypes = {
  setHasUnsavedChanges: PropTypes.func.isRequired,
};
