// src/pages/EmergencyContact/EmergencyContact.jsx
import React, { useEffect, useMemo, useState } from "react";
import { Box, List, ListItem, ListItemText } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getEmergencyContactInfo } from "../../services/requestServices";

// Get browser GPS coords (prompts user for permission)
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
        maximumAge: 5 * 60 * 1000,
      },
    );
  });

const getDisplayNumber = (service, fallback) => {
  if (!service) return fallback;
  if (typeof service === "string") return service;
  return service.display_number || service.dial_number || fallback;
};

const getDialNumber = (service, fallback) => {
  if (!service) return fallback;
  if (typeof service === "string") return service.replace(/\D/g, "");
  return (service.dial_number || service.display_number || fallback)
    .toString()
    .replace(/\D/g, "");
};

const EmergencyContact = ({ embedded = false }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [apiData, setApiData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;

    const normalize = (raw) => {
      if (raw && typeof raw === "object" && typeof raw.body === "string") {
        try {
          return JSON.parse(raw.body);
        } catch (e) {
          console.error("❌ Failed to parse body:", e, raw.body);
          return null;
        }
      }
      return raw;
    };

    const fetchContacts = async () => {
      try {
        try {
          const { lat, lng } = await getBrowserCoords();
          const raw = await getEmergencyContactInfo({ lat, lng });
          const parsed = normalize(raw);

          if (alive) setApiData(parsed);
        } catch (geoErr) {
          console.warn("GPS failed / denied:", geoErr);

          const raw = await getEmergencyContactInfo();
          const parsed = normalize(raw);

          if (alive) setApiData(parsed);
        }
      } catch (err) {
        console.error("Failed to fetch emergency contacts:", err);
        if (alive) setApiData(null);
      } finally {
        if (alive) setLoading(false);
      }
    };

    fetchContacts();

    return () => {
      alive = false;
    };
  }, []);

  const dynamic = useMemo(() => {
    const services = apiData?.services || {};

    return {
      police: {
        display: getDisplayNumber(services.police, "911"),
        dial: getDialNumber(services.police, "911"),
      },
      fire: {
        display: getDisplayNumber(services.fire, "911"),
        dial: getDialNumber(services.fire, "911"),
      },
      ambulance: {
        display: getDisplayNumber(services.ambulance, "911"),
        dial: getDialNumber(services.ambulance, "911"),
      },
      suicide: {
        display: getDisplayNumber(services.suicide_helpline, "988"),
        dial: getDialNumber(services.suicide_helpline, "988"),
      },
    };
  }, [apiData]);

  const emergencyContacts = useMemo(
    () => [
      {
        category: t("CATEGORY_SAFETY"),
        contacts: [
          {
            name: t("POLICE"),
            phone: dynamic.police.display,
            dial: dynamic.police.dial,
          },
          {
            name: t("FIRE"),
            phone: dynamic.fire.display,
            dial: dynamic.fire.dial,
          },
        ],
      },
      {
        category: t("CATEGORY_MEDICAL"),
        contacts: [
          {
            name: t("MEDICAL_EMERGENCY"),
            phone: dynamic.ambulance.display,
            dial: dynamic.ambulance.dial,
          },
          {
            name: t("AMBULANCE"),
            phone: dynamic.ambulance.display,
            dial: dynamic.ambulance.dial,
          },
          {
            name: t("MENTAL_HEALTH"),
            phone: dynamic.suicide.display,
            dial: dynamic.suicide.dial,
          },
          {
            name: t("SUICIDE_PREVENTION"),
            phone: dynamic.suicide.display,
            dial: dynamic.suicide.dial,
          },
        ],
      },
    ],
    [t, dynamic],
  );

  const locationLine = apiData?.resolved_location
    ? `${apiData.resolved_location.city}, ${apiData.resolved_location.state} (${apiData.resolved_location.country})`
    : null;

  return (
    <div className="flex flex-col items-center p-5 px-5">
      {!embedded && (
        <div className="w-full max-w-[900px] px-4 mb-4 flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            className="text-blue-600 hover:text-blue-800 font-semibold text-lg flex items-center"
          >
            <span className="text-2xl mr-2">&lt;</span>{" "}
            {t("BACK_TO_DASHBOARD") || "Back to Dashboard"}
          </button>
        </div>
      )}

      <div className="max-w-[900px] w-full bg-white rounded-lg p-10 shadow-lg">
        <h1 className="text-center text-3xl font-bold mb-4 text-black">
          {t("EMERGENCY_CONTACTS")}
        </h1>

        <p className="text-[1.05rem] text-gray-700 text-justify mb-3 leading-7">
          {t("EMERGENCY_SUBTITLE")}
        </p>

        <p className="text-sm text-gray-600 mb-6">
          {loading
            ? "Fetching emergency numbers..."
            : locationLine
              ? `Area Detected: ${locationLine}`
              : "Using default emergency numbers - USA"}
        </p>

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
                  button
                  component="a"
                  href={`tel:${contact.dial}`}
                  className="border border-gray-200 rounded-md px-4 py-3 mb-2 transition-all hover:bg-red-100 hover:border-red-600 hover:scale-[1.01]"
                >
                  <ListItemText
                    primary={`${contact.name} — ${contact.phone}`}
                  />
                </ListItem>
              ))}
            </List>
          </Box>
        ))}
      </div>
    </div>
  );
};

export default EmergencyContact;
