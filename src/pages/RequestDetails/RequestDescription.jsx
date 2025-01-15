import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { PiWarningDiamondFill } from "react-icons/pi";
import { VscCalendar } from "react-icons/vsc";
import { TbTriangleSquareCircle } from "react-icons/tb";
import { IoPersonCircle } from "react-icons/io5";
import { RiUserStarLine } from "react-icons/ri";
import { IoIosArrowUp } from "react-icons/io";
import { IoIosArrowDown } from "react-icons/io";
import HelpRequestForm from "../HelpRequest/HelpRequestForm";
import { createPortal } from "react-dom";
import { useParams } from "react-router-dom"

const headerList = [
  {
    context: "July 1, 2024",
    type: "date",
    icon: <VscCalendar size={22} />,
  },
  {
    context: "maintenance",
    type: "category",
    icon: <TbTriangleSquareCircle size={22} />,
  },
  {
    context: "Peter parker",
    type: "requester",
    icon: <IoPersonCircle size={26} />,
  },
  {
    context: "Ethan Marshall",
    type: "volunteer",
    icon: <RiUserStarLine size={22} />,
  }
];

const RequestDescription = () => {
  const token = useSelector((state) => state.auth.idToken);
  const { id } = useParams();
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
              <HelpRequestForm
                isEdit={true}
                onClose={() => setIsEditing(false)}
              />
            </div>
          </div>,
          document.body
        )}
      <div>
        <div
          className="rounded-lg bg-white border border-gray-200 shadow-md p-4 sm:p-6 m-0 flex flex-col gap-4"
          onClick={handleToggle}
        >
          <button
            className="bg-blue-500 text-white text-sm px-7 py-2 rounded-lg hover:bg-blue-600 ml-auto"
            onClick={handleEditClick}
          >
            Edit
          </button>
          <div className="flex flex-row justify-between md:items-center">
            {/* <div className="flex items-center md:gap-2 lg:gap-4"> */}
            <h2 className="text-2xl font-semibold lg:flex sm:items-center sm:gap-5">
              #{id} Help Needed for Community Clean-Up Event
              {/* <div className="flex gap-2 lg:gap-5">
                <span className="bg-green-200 text-black-800 text-sm px-3 py-1 rounded-full ">
                  Open
                </span>
              </div> */}
            </h2>
            {/* </div> */}
            {/* <div className="flex items-center">
              <PiWarningDiamondFill className="mr-1 text-red-500" />
              <span className="text-sm font-bold">High</span>
            </div> */}
          </div>
          <div className="flex gap-4">
            <span className="bg-green-200 text-black-800 text-sm px-3 py-1 rounded-full ">
              Open
            </span>
            <div className="flex items-center">
              <PiWarningDiamondFill className="mr-1 text-red-500" />
              <span className="text-sm font-bold">High</span>
            </div>
          </div>
          <ul className="flex flex-col sm:flex-row items-start flex-wrap md:gap-2 lg:gap-10 text-xs text-gray-700 sm:items-center justify-between">
            {headerList.map((header, index) => (
              <li
                key={index}
                className="flex items-center gap-1 group relative"
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
