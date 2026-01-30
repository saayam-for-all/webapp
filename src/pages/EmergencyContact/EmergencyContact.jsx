// src/pages/EmergencyContact/EmergencyContact.jsx
import React, { useEffect, useMemo, useState } from "react";
import { Box, List, ListItem, ListItemText } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getEmergencyContactInfo } from "../../services/requestServices";
import { fetchAuthSession } from "aws-amplify/auth";

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

const EmergencyContact = ({ embedded = false }) => {
  console.log("✅ EmergencyContact component rendered");
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [apiData, setApiData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;

    const normalize = (raw) => {
      // Lambda proxy response: { statusCode, headers, body: "json string" }
      if (raw && typeof raw === "object" && typeof raw.body === "string") {
        try {
          return JSON.parse(raw.body);
        } catch (e) {
          console.error("❌ Failed to parse body:", e, raw.body);
          return null;
        }
      }
      // Already normal JSON
      return raw;
    };

    const fetchContacts = async () => {
      try {
        // 1) GPS
        try {
          const { lat, lng } = await getBrowserCoords();
          console.log("GPS coordinates:", { lat, lng });

          const raw = await getEmergencyContactInfo({ lat, lng });
          console.log("Emergency API response (GPS raw):", raw);

          const parsed = normalize(raw);
          console.log("Emergency API response (GPS parsed):", parsed);

          if (alive) setApiData(parsed);
        } catch (geoErr) {
          console.warn("GPS failed / denied:", geoErr);

          // 2) fallback
          const raw = await getEmergencyContactInfo();
          console.log("Fallback API response (raw):", raw);

          const parsed = normalize(raw);
          console.log("Fallback API response (parsed):", parsed);

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
  // this is only for debug
  // useEffect(() => {
  //   fetchAuthSession().then(session => {
  //     console.log(
  //       "ACCESS TOKEN:",
  //       session.tokens.accessToken.toString()
  //     );
  //   });
  // }, []);

  // Normalize service numbers from backend
  const dynamic = useMemo(() => {
    const services = apiData?.services || {};
    return {
      police: services.police || "911",
      fire: services.fire || "911",
      ambulance: services.ambulance || "911",
      suicide: services.suicide_helpline || "108",
    };
  }, [apiData]);

  // Keep your i18n labels; only inject dynamic phone numbers
  const emergencyContacts = [
    {
      category: t("CATEGORY_SAFETY"),
      contacts: [
        { name: t("POLICE"), phone: dynamic.police },
        { name: t("FIRE"), phone: dynamic.fire },
        // { name: t("SECURITY"), phone: "(123) 456-7890" },
        // { name: t("DOMESTIC_VIOLENCE"), phone: "1-800-799-7233" },
        // { name: t("CHILD_ABUSE"), phone: "1-800-422-4453" },
      ],
    },
    {
      category: t("CATEGORY_MEDICAL"),
      contacts: [
        { name: t("MEDICAL_EMERGENCY"), phone: dynamic.ambulance },
        // { name: t("POISON_CONTROL"), phone: "1-800-222-1222" },
        { name: t("AMBULANCE"), phone: dynamic.ambulance },
        { name: t("MENTAL_HEALTH"), phone: dynamic.suicide },
        { name: t("SUICIDE_PREVENTION"), phone: dynamic.suicide },
      ],
    },
    // {
    //   category: t("CATEGORY_UTILITIES"),
    //   contacts: [
    //     { name: t("GAS_LEAK"), phone: "1-800-555-0199" },
    //     { name: t("ELECTRICITY_OUTAGE"), phone: "1-800-555-0123" },
    //     { name: t("WATER_DEPARTMENT"), phone: "1-800-555-0177" },
    //   ],
    // },
    // {
    //   category: t("CATEGORY_NATURAL"),
    //   contacts: [
    //     { name: t("FLOOD_HELP"), phone: "1-800-555-0198" },
    //     { name: t("EARTHQUAKE_INFO"), phone: "1-800-555-0187" },
    //     { name: t("HURRICANE_INFO"), phone: "1-800-555-0140" },
    //     { name: t("EMERGENCY_MGMT"), phone: "1-800-555-0101" },
    //   ],
    // },
    // {
    //   category: t("CATEGORY_TRANSPORT"),
    //   contacts: [
    //     { name: t("ROADSIDE_ASSISTANCE"), phone: "1-800-555-0166" },
    //     { name: t("HIGHWAY_PATROL"), phone: "1-800-555-0155" },
    //     { name: t("PUBLIC_TRANSPORT_EMERGENCY"), phone: "1-800-555-0133" },
    //   ],
    // },
    // {
    //   category: t("CATEGORY_ANIMAL"),
    //   contacts: [
    //     { name: t("ANIMAL_CONTROL"), phone: "1-800-555-0145" },
    //     { name: t("WILDLIFE_RESCUE"), phone: "1-800-555-0146" },
    //     { name: t("ENVIRONMENTAL_HAZARDS"), phone: "1-800-555-0150" },
    //   ],
    // },
    // {
    //   category: t("CATEGORY_COMMUNITY"),
    //   contacts: [
    //     { name: t("SENIOR_HELPLINE"), phone: "1-800-555-0111" },
    //     { name: t("HOMELESS_SERVICES"), phone: "1-800-555-0112" },
    //     { name: t("FOOD_ASSISTANCE"), phone: "1-800-555-0113" },
    //   ],
    // },
  ];

  const locationLine = apiData?.resolved_location
    ? `${apiData.resolved_location.city}, ${apiData.resolved_location.state} (${apiData.resolved_location.country})`
    : null;

  return (
    <div className="flex flex-col items-center p-5 px-5">
      {/* Show ONLY on standalone page */}
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

        {/* Optional status line */}
        <p className="text-sm text-gray-600 mb-6">
          {loading
            ? "Fetching emergency numbers..."
            : locationLine
              ? `Resolved location: ${locationLine} • match: ${apiData?.match_level}`
              : "Using default emergency numbers."}
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
                  href={`tel:${String(contact.phone).replace(/\D/g, "")}`}
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
