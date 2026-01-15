import React from "react";
import { Box, List, ListItem, ListItemText } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
// import { getEmergencyContactInfo } from "../services/requestService";

const EmergencyContact = ({ embedded = false }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  // const [phoneNumbers, setPhoneNumbers] = useState({}); // store API numbers
  //
  // useEffect(() => {
  //   const fetchContacts = async () => {
  //     try {
  //       const data = await getEmergencyContactInfo();
  //       setPhoneNumbers(data);
  //     } catch (err) {
  //       console.error("Failed to fetch emergency contacts:", err);
  //     }
  //   };
  //   fetchContacts();
  // }, []);

  // Keep i18n hardcoded names, just replace phone numbers dynamically

  // const emergencyContacts = [
  //   {
  //     category: t("CATEGORY_SAFETY"),
  //     contacts: [
  //       { name: t("POLICE"), phone: phoneNumbers.police_no || "911" },
  //       { name: t("FIRE"), phone: phoneNumbers.fire_no || "911" },
  //       { name: t("SECURITY"), phone: phoneNumbers.security_no || "(123) 456-7890" },
  //       { name: t("DOMESTIC_VIOLENCE"), phone: phoneNumbers.women_no || "1-800-799-7233" },
  //       { name: t("CHILD_ABUSE"), phone: phoneNumbers.child_abuse_no || "1-800-422-4453" },
  //     ],
  //   },
  //   {
  //     category: t("CATEGORY_MEDICAL"),
  //     contacts: [
  //       { name: t("MEDICAL_EMERGENCY"), phone: phoneNumbers.medical_no || "911" },
  //       { name: t("POISON_CONTROL"), phone: phoneNumbers.poison_no || "1-800-222-1222" },
  //       { name: t("AMBULANCE"), phone: phoneNumbers.ambulance_no || "1-800-555-1234" },
  //       { name: t("MENTAL_HEALTH"), phone: phoneNumbers.mental_health_no || "988" },
  //       { name: t("SUICIDE_PREVENTION"), phone: phoneNumbers.suicide_prevention_no || "1-800-273-8255" },
  //     ],
  //   },
  //   {
  //     category: t("CATEGORY_UTILITIES"),
  //     contacts: [
  //       { name: t("GAS_LEAK"), phone: phoneNumbers.gas_no || "1-800-555-0199" },
  //       { name: t("ELECTRICITY_OUTAGE"), phone: phoneNumbers.electricity_no || "1-800-555-0123" },
  //       { name: t("WATER_DEPARTMENT"), phone: phoneNumbers.water_no || "1-800-555-0177" },
  //     ],
  //   },
  //   {
  //     category: t("CATEGORY_NATURAL"),
  //     contacts: [
  //       { name: t("FLOOD_HELP"), phone: phoneNumbers.flood_no || "1-800-555-0198" },
  //       { name: t("EARTHQUAKE_INFO"), phone: phoneNumbers.earthquake_no || "1-800-555-0187" },
  //       { name: t("HURRICANE_INFO"), phone: phoneNumbers.hurricane_no || "1-800-555-0140" },
  //       { name: t("EMERGENCY_MGMT"), phone: phoneNumbers.emergency_mgmt_no || "1-800-555-0101" },
  //     ],
  //   },
  //   {
  //     category: t("CATEGORY_TRANSPORT"),
  //     contacts: [
  //       { name: t("ROADSIDE_ASSISTANCE"), phone: phoneNumbers.roadside_no || "1-800-555-0166" },
  //       { name: t("HIGHWAY_PATROL"), phone: phoneNumbers.highway_no || "1-800-555-0155" },
  //       { name: t("PUBLIC_TRANSPORT_EMERGENCY"), phone: phoneNumbers.public_transport_no || "1-800-555-0133" },
  //     ],
  //   },
  //   {
  //     category: t("CATEGORY_ANIMAL"),
  //     contacts: [
  //       { name: t("ANIMAL_CONTROL"), phone: phoneNumbers.animal_control_no || "1-800-555-0145" },
  //       { name: t("WILDLIFE_RESCUE"), phone: phoneNumbers.wildlife_no || "1-800-555-0146" },
  //       { name: t("ENVIRONMENTAL_HAZARDS"), phone: phoneNumbers.environment_no || "1-800-555-0150" },
  //     ],
  //   },
  //   {
  //     category: t("CATEGORY_COMMUNITY"),
  //     contacts: [
  //       { name: t("SENIOR_HELPLINE"), phone: phoneNumbers.senior_no || "1-800-555-0111" },
  //       { name: t("HOMELESS_SERVICES"), phone: phoneNumbers.homeless_no || "1-800-555-0112" },
  //       { name: t("FOOD_ASSISTANCE"), phone: phoneNumbers.food_no || "1-800-555-0113" },
  //     ],
  //   },
  // ];

  const emergencyContacts = [
    {
      category: t("CATEGORY_SAFETY"),
      contacts: [
        { name: t("POLICE"), phone: "911" },
        { name: t("FIRE"), phone: "911" },
        { name: t("SECURITY"), phone: "(123) 456-7890" },
        { name: t("DOMESTIC_VIOLENCE"), phone: "1-800-799-7233" },
        { name: t("CHILD_ABUSE"), phone: "1-800-422-4453" },
      ],
    },
    {
      category: t("CATEGORY_MEDICAL"),
      contacts: [
        { name: t("MEDICAL_EMERGENCY"), phone: "911" },
        { name: t("POISON_CONTROL"), phone: "1-800-222-1222" },
        { name: t("AMBULANCE"), phone: "1-800-555-1234" },
        { name: t("MENTAL_HEALTH"), phone: "988" },
        { name: t("SUICIDE_PREVENTION"), phone: "1-800-273-8255" },
      ],
    },
    {
      category: t("CATEGORY_UTILITIES"),
      contacts: [
        { name: t("GAS_LEAK"), phone: "1-800-555-0199" },
        { name: t("ELECTRICITY_OUTAGE"), phone: "1-800-555-0123" },
        { name: t("WATER_DEPARTMENT"), phone: "1-800-555-0177" },
      ],
    },
    {
      category: t("CATEGORY_NATURAL"),
      contacts: [
        { name: t("FLOOD_HELP"), phone: "1-800-555-0198" },
        { name: t("EARTHQUAKE_INFO"), phone: "1-800-555-0187" },
        { name: t("HURRICANE_INFO"), phone: "1-800-555-0140" },
        { name: t("EMERGENCY_MGMT"), phone: "1-800-555-0101" },
      ],
    },
    {
      category: t("CATEGORY_TRANSPORT"),
      contacts: [
        { name: t("ROADSIDE_ASSISTANCE"), phone: "1-800-555-0166" },
        { name: t("HIGHWAY_PATROL"), phone: "1-800-555-0155" },
        { name: t("PUBLIC_TRANSPORT_EMERGENCY"), phone: "1-800-555-0133" },
      ],
    },
    {
      category: t("CATEGORY_ANIMAL"),
      contacts: [
        { name: t("ANIMAL_CONTROL"), phone: "1-800-555-0145" },
        { name: t("WILDLIFE_RESCUE"), phone: "1-800-555-0146" },
        { name: t("ENVIRONMENTAL_HAZARDS"), phone: "1-800-555-0150" },
      ],
    },
    {
      category: t("CATEGORY_COMMUNITY"),
      contacts: [
        { name: t("SENIOR_HELPLINE"), phone: "1-800-555-0111" },
        { name: t("HOMELESS_SERVICES"), phone: "1-800-555-0112" },
        { name: t("FOOD_ASSISTANCE"), phone: "1-800-555-0113" },
      ],
    },
  ];

  return (
    <div className="flex justify-center p-5 px-5">
      <div className="max-w-[900px] w-full bg-white rounded-lg p-10 shadow-lg">
        {/* Back Button */}
        {/*<div className="w-full mb-4">*/}
        {/*  <button*/}
        {/*    onClick={() => navigate(-1)}*/}
        {/*    className="text-blue-600 hover:text-blue-800 font-semibold text-lg flex items-center"*/}
        {/*  >*/}
        {/*    <span className="text-2xl mr-2">&lt;</span> {t("BACK")}*/}
        {/*  </button>*/}
        {/*</div>*/}

        {/* Page Header */}
        <h1 className="text-center text-3xl font-bold mb-4 text-black">
          {t("EMERGENCY_CONTACTS")}
        </h1>

        <p className="text-[1.05rem] text-gray-700 text-justify mb-6 leading-7">
          {t("EMERGENCY_SUBTITLE")}
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
                  href={`tel:${contact.phone.replace(/\D/g, "")}`}
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
