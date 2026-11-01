// src/pages/EmergencyContact/EmergencyContact.jsx
import React, { useEffect, useMemo, useState, useCallback } from "react";
import {
  Box,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getEmergencyContactInfo } from "../../services/requestServices";

// Get browser GPS coords with fresh location (maximumAge: 0)
const getBrowserCoords = () =>
  new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation not supported"));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        resolve({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      },
      (err) => reject(err),
      {
        enableHighAccuracy: false,
        timeout: 8000,
        maximumAge: 0,
      },
    );
  });

const formatLocationLine = (loc, countryCode) => {
  if (!loc && !countryCode) return null;
  const rawCity = loc?.city;
  const rawState = loc?.state;
  const rawCountry = loc?.country || countryCode;

  const validParts = [rawCity, rawState].filter(
    (val) => val && val !== "null" && val !== "undefined",
  );
  const cityState = validParts.join(", ");
  const hasCountry =
    rawCountry && rawCountry !== "null" && rawCountry !== "undefined";

  if (cityState && hasCountry) return `${cityState} (${rawCountry})`;
  if (cityState) return cityState;
  if (hasCountry) return `${rawCountry}`;
  return null;
};

const EmergencyContact = ({ embedded = false }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [apiData, setApiData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [isEstimated, setIsEstimated] = useState(false);

  const normalize = (raw) => {
    if (raw && typeof raw === "object" && typeof raw.body === "string") {
      try {
        return JSON.parse(raw.body);
      } catch (e) {
        console.error("Failed to parse body:", e, raw.body);
        return null;
      }
    }
    return raw;
  };

  const fetchContacts = useCallback(async () => {
    setLoading(true);
    setError(false);

    let coords = null;
    let usedGps = false;

    try {
      coords = await getBrowserCoords();
      usedGps = true;
    } catch (geoErr) {
      console.warn(
        "GPS failed / denied, estimating location via network:",
        geoErr,
      );
      usedGps = false;
    }

    try {
      const raw = usedGps
        ? await getEmergencyContactInfo({ lat: coords.lat, lng: coords.lng })
        : await getEmergencyContactInfo();

      const parsed = normalize(raw);

      if (
        !parsed ||
        !parsed.services ||
        Object.keys(parsed.services).length === 0
      ) {
        setError(true);
        setApiData(null);
      } else {
        setApiData(parsed);
        setIsEstimated(!usedGps);
      }
    } catch (apiErr) {
      console.error("Failed to fetch emergency contacts:", apiErr);
      setError(true);
      setApiData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

  const services = apiData?.services || {};

  const emergencyContacts = useMemo(() => {
    if (!apiData || !apiData.services) return [];

    const getServiceDetails = (serviceObj) => {
      if (!serviceObj) {
        return {
          phone: t("NOT_AVAILABLE") || "Not available",
          dial: null,
          isFallback: false,
        };
      }
      const display = serviceObj.display_number || serviceObj.dial_number;
      const dial = (serviceObj.dial_number || serviceObj.display_number || "")
        .toString()
        .replace(/\D/g, "");
      return {
        phone: display || t("NOT_AVAILABLE") || "Not available",
        dial: dial || null,
        isFallback: Boolean(serviceObj.is_fallback),
      };
    };

    const contactsList = [];

    // Safety category
    const safetyContacts = [];
    if (services.police) {
      const p = getServiceDetails(services.police);
      safetyContacts.push({ name: t("POLICE") || "Police", ...p });
    }
    if (services.fire) {
      const f = getServiceDetails(services.fire);
      safetyContacts.push({ name: t("FIRE") || "Fire", ...f });
    }

    if (safetyContacts.length > 0) {
      contactsList.push({
        category: t("CATEGORY_SAFETY") || "Safety & Security",
        contacts: safetyContacts,
      });
    }

    // Medical & Helplines category
    const medicalContacts = [];
    if (services.ambulance) {
      const a = getServiceDetails(services.ambulance);
      medicalContacts.push({ name: t("AMBULANCE") || "Ambulance", ...a });
    }
    if (services.suicide_helpline) {
      const s = getServiceDetails(services.suicide_helpline);
      medicalContacts.push({
        name: t("SUICIDE_PREVENTION") || "Crisis / Mental Health Helpline",
        ...s,
      });
    }

    // Dynamic additional services returned by country
    const standardKeys = new Set([
      "police",
      "fire",
      "ambulance",
      "suicide_helpline",
    ]);
    const otherContacts = [];
    Object.keys(services).forEach((key) => {
      if (!standardKeys.has(key)) {
        const extra = getServiceDetails(services[key]);
        const formattedName = key
          .replace(/_/g, " ")
          .replace(/\b\w/g, (c) => c.toUpperCase());
        otherContacts.push({ name: formattedName, ...extra });
      }
    });

    if (otherContacts.length > 0) {
      medicalContacts.push(...otherContacts);
    }

    if (medicalContacts.length > 0) {
      contactsList.push({
        category: t("CATEGORY_MEDICAL") || "Medical & Helplines",
        contacts: medicalContacts,
      });
    }

    return contactsList;
  }, [apiData, services, t]);

  const locationLine = formatLocationLine(
    apiData?.resolved_location,
    apiData?.country,
  );

  return (
    <div className="flex flex-col items-center p-5 px-5 min-h-[70vh]">
      {!embedded && (
        <div className="w-full max-w-[900px] px-4 mb-4 flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            className="text-blue-600 hover:text-blue-800 font-semibold text-lg flex items-center cursor-pointer"
          >
            <span className="text-2xl mr-2">&lt;</span>{" "}
            {t("BACK_TO_DASHBOARD") || "Back to Dashboard"}
          </button>
        </div>
      )}

      <div className="max-w-[900px] w-full bg-white rounded-lg p-8 md:p-10 shadow-lg border border-gray-100">
        <h1 className="text-center text-3xl font-bold mb-4 text-black">
          {t("EMERGENCY_CONTACTS") || "Emergency Contacts"}
        </h1>

        <p className="text-[1.05rem] text-gray-700 text-justify mb-4 leading-7">
          {t("EMERGENCY_SUBTITLE") ||
            "Saayam connects you with the appropriate emergency and medical helpline contacts based on your location."}
        </p>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-12">
            <CircularProgress size={36} className="mb-4 text-blue-600" />
            <p className="text-gray-600 font-medium">
              Detecting your location...
            </p>
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="my-6 p-6 bg-amber-50 rounded-lg border border-amber-200 text-center">
            <h3 className="text-lg font-semibold text-amber-900 mb-2">
              We couldn't load emergency numbers for your location
            </h3>
            <p className="text-sm text-amber-800 mb-4">
              On a mobile phone, 112 works in most countries (911 in North
              America).
            </p>
            <button
              type="button"
              onClick={fetchContacts}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded shadow transition-colors cursor-pointer"
            >
              Retry
            </button>
          </div>
        )}

        {/* Success / Numbers List */}
        {!loading && !error && apiData && (
          <>
            <div className="mb-6 pb-2 border-b border-gray-100">
              <p className="text-sm font-medium text-gray-700">
                {isEstimated
                  ? `Location estimated from your internet connection: ${locationLine || "Unavailable"}`
                  : `Area Detected: ${locationLine || "Unavailable"}`}
              </p>
            </div>

            <div data-testid="emergency-contacts-list">
              {emergencyContacts.map((section, idx) => (
                <Box key={idx} className="mb-6">
                  <h2 className="flex items-center text-xl font-bold text-black mb-3 relative">
                    <span className="absolute -left-4 w-1 h-7 bg-blue-500 rounded-full"></span>
                    <span className="ml-4">{section.category}</span>
                  </h2>

                  <List>
                    {section.contacts.map((contact, cidx) => (
                      <ListItem
                        key={cidx}
                        component={contact.dial ? "a" : "div"}
                        href={contact.dial ? `tel:${contact.dial}` : undefined}
                        className={`border border-gray-200 rounded-md px-4 py-3 mb-2 flex justify-between ${
                          contact.dial
                            ? "hover:bg-red-50 hover:border-red-500 cursor-pointer"
                            : "bg-gray-50"
                        }`}
                      >
                        <ListItemText
                          primary={
                            <span className="font-medium text-gray-900">
                              {contact.name} — {contact.phone}
                              {contact.isFallback && (
                                <span className="ml-2 text-xs text-gray-500 font-normal italic">
                                  (general emergency number)
                                </span>
                              )}
                            </span>
                          }
                        />
                      </ListItem>
                    ))}
                  </List>
                </Box>
              ))}
            </div>

            <p className="text-xs text-gray-500 mt-8 pt-4 border-t border-gray-100 text-center">
              Emergency numbers are provided for convenience and may not be
              accurate for your exact location. If in doubt, dial your local
              emergency number (112 in Europe, 911 in North America).
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default EmergencyContact;
