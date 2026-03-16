import React, { useState } from "react";
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
  const [showChangeVolunteerDialog, setShowChangeVolunteerDialog] =
    useState(false);
  const [changeVolunteerReason, setChangeVolunteerReason] = useState("");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteReason, setDeleteReason] = useState("");

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
            <button
              className="bg-yellow-500 text-white text-sm px-4 py-2 rounded-lg hover:bg-yellow-600"
              onClick={() => {
                setChangeVolunteerReason("");
                setShowChangeVolunteerDialog(true);
              }}
            >
              {t("CHANGE_VOLUNTEER")}
            </button>
            <button
              className="bg-red-500 text-white text-sm px-4 py-2 rounded-lg hover:bg-red-600"
              onClick={() => {
                setDeleteReason("");
                setShowDeleteDialog(true);
              }}
            >
              {t("DELETE_REQUEST")}
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

      {/* Change Volunteer Dialog */}
      {showChangeVolunteerDialog && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          onClick={() => setShowChangeVolunteerDialog(false)}
        >
          <div
            className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold mb-4">
              {t("CHANGE_VOLUNTEER_REASON")}
            </h3>
            <textarea
              rows={4}
              value={changeVolunteerReason}
              onChange={(e) => setChangeVolunteerReason(e.target.value)}
              placeholder={t("CHANGE_VOLUNTEER_REASON_PLACEHOLDER")}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:border-blue-500 resize-none"
            />
            <div className="flex justify-end gap-3 mt-4">
              <button
                className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-100"
                onClick={() => setShowChangeVolunteerDialog(false)}
              >
                {t("CANCEL")}
              </button>
              <button
                className="px-4 py-2 text-sm bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 disabled:opacity-50"
                disabled={!changeVolunteerReason.trim()}
                onClick={() => {
                  // TODO: submit change volunteer reason
                  setShowChangeVolunteerDialog(false);
                }}
              >
                {t("SUBMIT")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Request Dialog */}
      {showDeleteDialog && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          onClick={() => setShowDeleteDialog(false)}
        >
          <div
            className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold mb-4">
              {t("DELETE_REQUEST_REASON")}
            </h3>
            <textarea
              rows={4}
              value={deleteReason}
              onChange={(e) => setDeleteReason(e.target.value)}
              placeholder={t("DELETE_REQUEST_REASON_PLACEHOLDER")}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:border-red-500 resize-none"
            />
            <div className="flex justify-end gap-3 mt-4">
              <button
                className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-100"
                onClick={() => setShowDeleteDialog(false)}
              >
                {t("CANCEL")}
              </button>
              <button
                className="px-4 py-2 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50"
                disabled={!deleteReason.trim()}
                onClick={() => {
                  // TODO: submit delete request with reason
                  setShowDeleteDialog(false);
                }}
              >
                {t("CONFIRM_DELETE")}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default RequestDescription;
