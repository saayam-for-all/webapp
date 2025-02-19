import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { IoPersonCircle } from "react-icons/io5";
import { PiWarningDiamondFill } from "react-icons/pi";
import { RiUserStarLine } from "react-icons/ri";
import { TbTriangleSquareCircle } from "react-icons/tb";
import { VscCalendar } from "react-icons/vsc";
import { useSelector } from "react-redux";
import HelpRequestForm from "../HelpRequest/HelpRequestForm";
import "./RequestDescription.css";

const attributes = [
  {
    context: "July 1, 2024",
    type: "Creation Date",
    icon: <VscCalendar size={22} />,
    phoneIcon: false,
    videoIcon: false,
  },
  {
    context: "Maintenance",
    type: "Category",
    icon: <TbTriangleSquareCircle size={22} />,
    phoneIcon: false,
    videoIcon: false,
  },
  {
    context: "Peter parker",
    type: "Requester",
    icon: <IoPersonCircle size={26} />,
    phoneIcon: true,
    videoIcon: true,
  },
  {
    context: "Ethan Marshall",
    type: "Volunteer",
    icon: <RiUserStarLine size={22} />,
    phoneIcon: true,
    videoIcon: true,
  },
];

const RequestDescription = ({ requestData }) => {
  const { t } = useTranslation();
  const token = useSelector((state) => state.auth.idToken);
  const [isOpen, setIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // attributes[0].context = requestData?.creationDate;
  // attributes[1].context = requestData?.category;

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleEditClick = (event) => {
    event.stopPropagation();
    setIsEditing(true);
  };

  const handleOverlayClick = () => {
    setIsEditing(false);
  };

  useEffect(() => {
    if (isEditing) {
      document.body.style.overflow = "hidden"; // Prevent background scrolling
    } else {
      document.body.style.overflow = "unset"; // Restore background scrolling
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isEditing]);

  return (
    <>
      {isEditing &&
        createPortal(
          <div
            className="fixed inset-0 z-10 flex items-center justify-center bg-black bg-opacity-50"
            onClick={handleOverlayClick}
          >
            <div
              className="overflow-auto max-h-[100vh]"
              onClick={(e) => e.stopPropagation()}
              id="request-description-popup"
            >
              <HelpRequestForm
                isEdit={true}
                onClose={() => setIsEditing(false)}
              />
            </div>
          </div>,
          document.body,
        )}
      <div>
        <div
          className="rounded-lg bg-white border border-gray-200 shadow-md p-4 sm:p-6 m-0 flex flex-col gap-4"
          onClick={handleToggle}
          data-testid="handleToggleContainer"
        >
          <button
            className="bg-blue-500 text-white text-sm px-7 py-2 rounded-lg hover:bg-blue-600 ml-auto"
            onClick={handleEditClick}
          >
            {t("EDIT")}
          </button>
          <div className="flex flex-row justify-between md:items-center">
            {/* <div className="flex items-center md:gap-2 lg:gap-4"> */}
            <div className="flex flex-row gap-5">
              <h2 className="text-2xl font-semibold lg:flex sm:items-center sm:gap-5 uppercase">
                {requestData.subject}
              </h2>
              <span className="bg-green-200 text-black-800 text-xs md:text-sm px-3 py-1 rounded-full items-center flex">
                {requestData.status}
              </span>
            </div>
            <div className="flex items-center">
              <PiWarningDiamondFill className="mr-1 text-red-500" />
              <span className="text-md font-bold">{requestData.priority}</span>
            </div>
          </div>

          <ul className="flex flex-col sm:flex-row items-start flex-wrap md:gap-2 lg:gap-10 text-xs text-gray-700 sm:items-center justify-between">
            {attributes.map((header, index) => (
              <li
                key={index}
                className="flex items-center gap-2 group relative"
              >
                {header.icon}
                {header.context}
                <div className="absolute top-6 px-5 py-2 bg-gray-50 border shadow-md rounded-xl flex opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {header.type}
                </div>
              </li>
            ))}
            <li className="flex items-center gap-1 ml-auto">
              {isOpen ? (
                <IoIosArrowUp size={30} strokeWidth={2} />
              ) : (
                <IoIosArrowDown size={30} strokeWidth={2} />
              )}
            </li>
          </ul>
        </div>
        {isOpen && (
          <div className="bg-gray-100 m-0">
            <p className="text-sm p-5">{requestData.description}</p>
          </div>
        )}
      </div>
    </>
  );
};

export default RequestDescription;
