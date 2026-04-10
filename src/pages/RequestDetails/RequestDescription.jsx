import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { PiWarningDiamondFill } from "react-icons/pi";
import { TbTriangleSquareCircle } from "react-icons/tb";
import { VscCalendar } from "react-icons/vsc";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import "./RequestDescription.css";

const RequestDescription = ({ requestData, setIsEditing }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteReason, setDeleteReason] = useState("");

  const formatEnumLabel = (value) => {
    if (!value) return "N/A";

    const normalized = String(value).toLowerCase().replaceAll("_", " ");
    return normalized.charAt(0).toUpperCase() + normalized.slice(1);
  };

  const formatDate = (value) => {
    if (!value) return "N/A";

    const parsedDate = new Date(value);

    if (Number.isNaN(parsedDate.getTime())) {
      return "N/A";
    }

    return parsedDate.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const rawCreationDate =
    requestData?.creationDate ??
    requestData?.createdAt ??
    requestData?.createdDate ??
    requestData?.date;

  const formattedDate = formatDate(rawCreationDate);

  const normalizedStatus = String(requestData?.status || "").toUpperCase();
  const normalizedPriority = String(requestData?.priority || "").toUpperCase();

  const statusStyles = {
    CREATED: "bg-blue-100 text-blue-800",
    MATCHING_VOLUNTEER: "bg-amber-100 text-amber-800",
    MANAGED: "bg-indigo-100 text-indigo-800",
    RESOLVED: "bg-green-100 text-green-800",
    CANCELLED: "bg-red-100 text-red-800",
    DELETED: "bg-gray-100 text-gray-700",
    RATED_BY_REQUESTER: "bg-teal-100 text-teal-800",
    RATED_BY_VOLUNTEER: "bg-violet-100 text-violet-800",
  };

  const priorityStyles = {
    LOW: "text-emerald-600",
    MEDIUM: "text-amber-600",
    HIGH: "text-orange-600",
    CRITICAL: "text-red-600",
  };

  const statusLabel = t(
    `enums:requestStatus.${normalizedStatus}`,
    formatEnumLabel(requestData?.status),
  );

  const priorityLabel = t(
    `enums:requestPriority.${normalizedPriority}`,
    formatEnumLabel(requestData?.priority),
  );

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

  const handleDeleteRequest = async () => {
    try {
      console.log("Deleting request:", requestData.id);
      console.log("Reason:", deleteReason);

      setDeleteDialogOpen(false);
      navigate("/dashboard");
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  return (
    <>
      <div className="border border-gray-300 rounded-lg p-4">
        <div>
          <ul className="w-full flex flex-col sm:flex-row items-start flex-wrap md:gap-2 lg:gap-10 text-xs text-gray-700 sm:items-center justify-between">
            {attributes.map((header, index) => (
              <li key={index} className="flex items-center gap-2">
                {header.icon}
                {t(header.context)}
              </li>
            ))}

            <li>
              <span
                className={`text-xs px-3 py-1 rounded-full ${statusStyles[normalizedStatus] || "bg-gray-100 text-gray-700"}`}
              >
                {statusLabel}
              </span>
            </li>

            <li className="flex items-center">
              <PiWarningDiamondFill
                className={`mr-1 ${priorityStyles[normalizedPriority] || "text-gray-500"}`}
              />
              <span
                className={`font-bold ${priorityStyles[normalizedPriority] || "text-gray-700"}`}
              >
                {priorityLabel}
              </span>
            </li>
          </ul>

          <div className="mt-6 flex flex-wrap justify-end gap-3">
            <button
              className="bg-blue-500 text-white text-sm px-6 py-2 rounded-lg hover:bg-blue-600"
              onClick={() => console.log("Change Volunteer clicked")}
            >
              {t("Change Volunteer")}
            </button>

            <button
              className="bg-red-500 text-white text-sm px-6 py-2 rounded-lg hover:bg-red-600"
              onClick={() => setDeleteDialogOpen(true)}
            >
              {t("Delete")}
            </button>

            <button
              className="bg-blue-500 text-white text-sm px-6 py-2 rounded-lg hover:bg-blue-600"
              onClick={() => setIsEditing(true)}
            >
              {t("EDIT")}
            </button>
          </div>

          <div className="w-full m-0">
            <p className="text-sm p-5">{t(requestData.description)}</p>
          </div>
        </div>
      </div>

      {/* ✅ DELETE DIALOG */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>{t("Delete")}</DialogTitle>

        <DialogContent>
          <Typography>{t("Reason")}</Typography>

          <textarea
            value={deleteReason}
            onChange={(e) => setDeleteReason(e.target.value)}
            className="border p-2 w-full mt-3 rounded-lg min-h-[100px]"
            placeholder={t("Reason")}
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} variant="outlined">
            {t("Cancel")}
          </Button>

          <Button
            onClick={handleDeleteRequest}
            color="error"
            variant="contained"
            disabled={!deleteReason.trim()}
          >
            {t("Delete")}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default RequestDescription;
