import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { PiWarningDiamondFill } from "react-icons/pi";
import { TbTriangleSquareCircle } from "react-icons/tb";
import { VscCalendar } from "react-icons/vsc";
import "./RequestDescription.css";

const RequestDescription = ({ requestData, setIsEditing, onDeleteRequest }) => {
  const { t } = useTranslation();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteReason, setDeleteReason] = useState("");
  const [deleteReasonError, setDeleteReasonError] = useState("");

  const cDate = new Date(requestData.creationDate + "T00:00:00");
  const formattedDate = cDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

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

  const handleConfirmDelete = () => {
    const reason = deleteReason.trim();
    if (!reason) {
      setDeleteReasonError(t("Please provide a reason for deletion."));
      return;
    }

    if (onDeleteRequest) {
      onDeleteRequest({ requestId: requestData.id, reason });
    }

    setDeleteReason("");
    setDeleteReasonError("");
    setIsDeleteModalOpen(false);
  };

  return (
    <>
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-20 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-lg rounded-lg bg-white p-6 shadow-xl">
            <h3 className="text-lg font-semibold mb-2">
              {t("Delete Request")}
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              {t("Please provide the reason for deleting this request.")}
            </p>
            <textarea
              value={deleteReason}
              onChange={(e) => {
                setDeleteReason(e.target.value);
                if (deleteReasonError) {
                  setDeleteReasonError("");
                }
              }}
              rows={4}
              className="w-full border border-gray-300 rounded-md p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={t("Enter deletion reason")}
            />
            {deleteReasonError && (
              <p className="text-red-600 text-sm mt-2">{deleteReasonError}</p>
            )}
            <div className="flex justify-end gap-2 mt-4">
              <button
                className="px-4 py-2 text-sm rounded-md bg-gray-200 hover:bg-gray-300"
                onClick={() => {
                  setDeleteReason("");
                  setDeleteReasonError("");
                  setIsDeleteModalOpen(false);
                }}
              >
                {t("Cancel")}
              </button>
              <button
                className="px-4 py-2 text-sm rounded-md bg-red-500 text-white hover:bg-red-600"
                onClick={handleConfirmDelete}
              >
                {t("Delete")}
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="border border-gray-300 rounded-lg p-4">
        <div className="">
          <div className="w-full flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
            <ul className="flex flex-wrap items-center gap-3 md:gap-4 text-xs text-gray-700">
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
            </ul>

            <div className="w-full lg:w-auto flex flex-col sm:flex-row gap-2 lg:justify-end lg:shrink-0">
              <button
                className="bg-blue-500 text-white text-sm px-7 py-2 rounded-lg hover:bg-blue-600"
                onClick={() => {
                  // TODO: Implement change volunteer functionality
                  console.log("Change Volunteer clicked");
                }}
              >
                {t("Change Volunteer")}
              </button>
              <div className="flex gap-2 justify-end sm:justify-start">
                <button
                  className="bg-blue-500 text-white text-sm px-7 py-2 rounded-lg hover:bg-blue-600"
                  onClick={() => setIsDeleteModalOpen(true)}
                >
                  {t("Delete")}
                </button>
                <button
                  className="bg-blue-500 text-white text-sm px-7 py-2 rounded-lg hover:bg-blue-600"
                  onClick={() => setIsEditing(true)}
                >
                  {t("EDIT")}
                </button>
              </div>
            </div>
          </div>

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
