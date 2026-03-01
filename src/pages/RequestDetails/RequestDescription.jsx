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
  const [changeVolunteerOpen, setChangeVolunteerOpen] = useState(false);
  const [changeVolunteerReason, setChangeVolunteerReason] = useState("");
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteReason, setDeleteReason] = useState("");

  const rawDate = requestData.creationDate;
  const dateObj = rawDate ? new Date(rawDate) : null;
  const isValidDate = dateObj && !Number.isNaN(dateObj.getTime());
  const formattedDate = isValidDate
    ? dateObj.toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : rawDate || "—";

  const attributes = [
    {
      context: formattedDate,
      type: "CREATION_DATE",
      icon: <VscCalendar size={22} />,
    },
    {
      context: requestData.category,
      type: "Category",
      icon: <TbTriangleSquareCircle size={22} />,
    },
  ];

  const handleChangeVolunteerSubmit = () => {
    if (!changeVolunteerReason.trim()) return;
    console.log("Change volunteer reason:", changeVolunteerReason);
    setChangeVolunteerReason("");
    setChangeVolunteerOpen(false);
  };

  const handleDeleteSubmit = () => {
    if (!deleteReason.trim()) return;
    console.log("Delete reason:", deleteReason);
    setDeleteReason("");
    setDeleteOpen(false);
  };

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
              onClick={() => setChangeVolunteerOpen(true)}
            >
              {t("CHANGE_VOLUNTEER")}
            </button>
            <button
              className="bg-blue-500 text-white text-sm px-7 py-2 rounded-lg hover:bg-blue-600"
              onClick={() => setDeleteOpen(true)}
            >
              {t("DELETE")}
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

      {changeVolunteerOpen && (
        <div
          className="fixed inset-0 z-20 flex items-center justify-center bg-black/50"
          onClick={() => setChangeVolunteerOpen(false)}
        >
          <div
            className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold mb-3">
              {t("CHANGE_VOLUNTEER")}
            </h3>
            <p className="text-sm text-gray-600 mb-3">
              {t("REASON_FOR_CHANGE_VOLUNTEER_HELP")}
            </p>
            <textarea
              value={changeVolunteerReason}
              onChange={(e) => setChangeVolunteerReason(e.target.value)}
              placeholder={t("REASON_FOR_CHANGE_VOLUNTEER_PLACEHOLDER")}
              rows={4}
              className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <div className="flex justify-end gap-2 mt-4">
              <button
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300"
                onClick={() => {
                  setChangeVolunteerOpen(false);
                  setChangeVolunteerReason("");
                }}
              >
                {t("CANCEL")}
              </button>
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
                disabled={!changeVolunteerReason.trim()}
                onClick={handleChangeVolunteerSubmit}
              >
                {t("SUBMIT")}
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteOpen && (
        <div
          className="fixed inset-0 z-20 flex items-center justify-center bg-black/50"
          onClick={() => setDeleteOpen(false)}
        >
          <div
            className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold mb-3 text-gray-800">
              {t("DELETE_REQUEST")}
            </h3>
            <p className="text-sm text-gray-600 mb-3">
              {t("REASON_FOR_DELETION_HELP")}
            </p>
            <textarea
              value={deleteReason}
              onChange={(e) => setDeleteReason(e.target.value)}
              placeholder={t("REASON_FOR_DELETION_PLACEHOLDER")}
              rows={4}
              className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <div className="flex justify-end gap-2 mt-4">
              <button
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300"
                onClick={() => {
                  setDeleteOpen(false);
                  setDeleteReason("");
                }}
              >
                {t("CANCEL")}
              </button>
              <button
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50"
                disabled={!deleteReason.trim()}
                onClick={handleDeleteSubmit}
              >
                {t("DELETE")}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default RequestDescription;
