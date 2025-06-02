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

  const cDate = new Date(requestData.creationDate + "T00:00:00");
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
              <span className="bg-green-200 text-black-800 text-xs md:text-sm px-3 py-1 rounded-full items-center flex">
                {t(requestData.status)}
              </span>
            </li>
            <li>
              <div className="flex items-center">
                <PiWarningDiamondFill className="mr-1 text-red-500" />
                <span className="text-md font-bold">
                  {t(requestData.priority)}
                </span>
              </div>
            </li>
            <button
              className="bg-blue-500 text-white text-sm px-7 py-2 rounded-lg hover:bg-blue-600 ml-auto"
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
