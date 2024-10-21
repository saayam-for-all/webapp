import React, { useState, useEffect } from "react";

import { PiWarningDiamondFill } from "react-icons/pi";
import { VscCalendar } from "react-icons/vsc";
import { TbTriangleSquareCircle } from "react-icons/tb";
import { IoPersonCircle } from "react-icons/io5";
import { RiUserStarLine } from "react-icons/ri";
import { IoIosArrowUp } from "react-icons/io";
import { IoIosArrowDown } from "react-icons/io";
import HelpRequestForm from "../HelpRequest/HelpRequestForm";
import { createPortal } from "react-dom";
const RequestDescription = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const handleToggle = () => {
    setIsOpen(!isOpen);
  }

  const handleEditClick = (event) => {
    event.stopPropagation();
    setIsEditing(true)
  }

  const handleOverlayClick = () => {
    setIsEditing(false);
  }

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
              className="overflow-y-auto max-h-[100vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <HelpRequestForm isEdit={true} />
            </div>
          </div>,
          document.body
        )}
      <div>
        <div
          className="rounded-lg bg-white border border-gray-200 p-4 sm:p-6 m-0"
          onClick={handleToggle}
        >
          <div className="flex justify-between items-center">
            <div className="flex items-center md:gap-2 lg:gap-4">
              <h2 className="text-xl sm:text-2xl font-semibold">
                Help Needed for Community Clean-Up Event
              </h2>
              <span className="bg-green-200 text-black-800 text-sm font-medium px-3 py-1 rounded-full">
                Open
              </span>
              <button
                className="bg-blue-500 text-white text-sm px-5 py-1 rounded-full hover:bg-blue-600"
                onClick={handleEditClick}
              >
                Edit
              </button>
            </div>
            <div className="flex items-center">
              <PiWarningDiamondFill className="mr-1 text-red-500" />
              <span className="text-sm font-bold">High</span>
            </div>
          </div>
          <ul className="flex flex-wrap md:gap-2 lg:gap-14 text-xs text-gray-700 pt-5 items-center justify-between">
            <li className="flex items-center gap-1">
              <VscCalendar size={22} />
              July 1, 2024
            </li>
            <li className="flex items-center gap-1">
              <TbTriangleSquareCircle size={22} />
              maintenance
            </li>
            <li className="flex items-center gap-1">
              <IoPersonCircle size={22} />
              Peter parker
            </li>
            <li className="flex items-center gap-1">
              <RiUserStarLine size={22} />
              Ethan Marshall
            </li>
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
            <p className="text-sm p-5 font-semibold">
              We need volunteers for our upcoming Community Clean-Up Day on
              August 15 from 9:00 AM to 1:00 PM at Cherry Creek Park. Tasks
              include picking up litter, sorting recyclables, and managing the
              registration table. We also need donations of trash bags, gloves,
              and refreshments. Your support will help make our community
              cleaner and more enjoyable for everyone.
            </p>
          </div>
        )}
      </div>
    </>
  );
};

export default RequestDescription;
