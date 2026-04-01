import React from "react";
import { useTranslation } from "react-i18next";
import { FaPhoneAlt, FaVideo } from "react-icons/fa";
import { IoPersonCircle } from "react-icons/io5";
import { PiWarningDiamondFill } from "react-icons/pi";
import { RiUserStarLine } from "react-icons/ri";
import { TbTriangleSquareCircle } from "react-icons/tb";
import { VscCalendar } from "react-icons/vsc";
import { useSelector } from "react-redux";
import "./RequestDescription.css";

const RequestDescription = ({ requestData, setIsEditing }) => {
  const { t } = useTranslation();
  const token = useSelector((state) => state.auth.idToken);

  const formatEnumLabel = (value) => {
    if (!value) return "";
    const normalized = String(value).toLowerCase().replaceAll("_", " ");
    return normalized.charAt(0).toUpperCase() + normalized.slice(1);
  };

  const normalizedStatus = String(requestData?.status || "").toUpperCase();
  const normalizedPriority = String(requestData?.priority || "").toUpperCase();

  const statusStyles = {
    CREATED: "bg-blue-100 text-blue-800",
    MATCHING_VOLUNTEER: "bg-yellow-100 text-yellow-800",
    MANAGED: "bg-indigo-100 text-indigo-800",
    RESOLVED: "bg-green-100 text-green-800",
    CANCELLED: "bg-red-100 text-red-800",
  };

  const priorityStyles = {
    LOW: "text-green-600",
    MEDIUM: "text-yellow-600",
    HIGH: "text-orange-600",
    CRITICAL: "text-red-500",
  };

  const statusLabelRaw = t(`enums:requestStatus.${normalizedStatus}`, {
    defaultValue: requestData?.status || "",
  });
  const priorityLabelRaw = t(`enums:requestPriority.${normalizedPriority}`, {
    defaultValue: requestData?.priority || "",
  });

  const statusLabel =
    statusLabelRaw === requestData?.status
      ? formatEnumLabel(requestData?.status)
      : statusLabelRaw;
  const priorityLabel =
    priorityLabelRaw === requestData?.priority
      ? formatEnumLabel(requestData?.priority)
      : priorityLabelRaw;

  const cDate = new Date(requestData.creationDate);
  const formattedDate = cDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  console.log(requestData);

  const attributes = [
    {
      context: formattedDate,
      type: "Creation Date",
      icon: <VscCalendar size={22} />,
    },
    {
      context: requestData.category,
      type: "Category",
      icon: <TbTriangleSquareCircle size={22} />,
    },
  ];

  return (
    <>
      <div className="border border-gray-300 rounded-lg p-4">
        <div className="">
          <ul className="w-full flex flex-col sm:flex-row items-start flex-wrap md:gap-2 lg:gap-10 text-xs text-gray-700 sm:items-center justify-between">
            {attributes
              .filter((attribute) => !attribute.phoneIcon)
              .map((header, index) => (
                <li
                  key={index}
                  className="flex items-center gap-2 group relative"
                >
                  {header.icon}
                  {t(header.context)}
                  <div className="absolute top-6 px-5 py-2 bg-gray-50 border shadow-md rounded-xl flex opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {t(header.type)}
                  </div>
                </li>
              ))}
            <li>
              <span
                className={`text-xs md:text-sm px-3 py-1 rounded-full items-center flex ${statusStyles[normalizedStatus] || "bg-gray-100 text-gray-700"}`}
              >
                {statusLabel}
              </span>
            </li>
            <li>
              <div className="flex items-center">
                <PiWarningDiamondFill
                  className={`mr-1 ${priorityStyles[normalizedPriority] || "text-gray-500"}`}
                />
                <span
                  className={`text-md font-bold ${priorityStyles[normalizedPriority] || "text-gray-700"}`}
                >
                  {priorityLabel}
                </span>
              </div>
            </li>
            <button
              className="bg-blue-500 text-white text-sm px-7 py-2 rounded-lg hover:bg-blue-600 ml-auto"
              onClick={() => {
                // TODO: Implement change volunteer functionality
                console.log("Change Volunteer clicked");
              }}
            >
              {t("Change Volunteer")}
            </button>
            <button
              className="bg-blue-500 text-white text-sm px-7 py-2 rounded-lg hover:bg-blue-600"
              onClick={() => {
                // TODO: Implement delete functionality
                console.log("Delete clicked");
              }}
            >
              {t("Delete")}
            </button>
            <button
              className="bg-blue-500 text-white text-sm px-7 py-2 rounded-lg hover:bg-blue-600"
              onClick={() => setIsEditing(true)}
            >
              {t("EDIT")}
            </button>
          </ul>

          <div className="w-full m-0">
            <p className="text-sm p-5">{t(requestData.description)}</p>
          </div>
          <div className="flex flex-row gap-5 justify-between">
            {attributes
              .filter((attribute) => attribute.phoneIcon)
              .map((header, index) => (
                <li
                  key={index}
                  className="flex items-center gap-2 group relative"
                >
                  {header.icon}
                  {header.context}
                  <div className="absolute top-6 px-5 py-2 bg-gray-50 border shadow-md rounded-xl flex opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {t(header.type)}
                  </div>
                </li>
              ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default RequestDescription;
