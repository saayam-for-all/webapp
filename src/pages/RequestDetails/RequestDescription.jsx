import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { PiWarningDiamondFill } from "react-icons/pi";
import { TbTriangleSquareCircle } from "react-icons/tb";
import { VscCalendar } from "react-icons/vsc";
import { useSelector } from "react-redux";
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
  const token = useSelector((state) => state.auth.idToken);
  const navigate = useNavigate();

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteReason, setDeleteReason] = useState("");

  const cDate = new Date(requestData.creationDate);
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
        <ul className="w-full flex flex-wrap gap-4 items-center text-xs text-gray-700">
          {attributes.map((header, index) => (
            <li key={index} className="flex items-center gap-2">
              {header.icon}
              {t(header.context)}
            </li>
          ))}

          <li>
            <span className="bg-green-200 text-xs px-3 py-1 rounded-full">
              {t(requestData.status)}
            </span>
          </li>

          <li className="flex items-center">
            <PiWarningDiamondFill className="mr-1 text-red-500" />
            <span className="font-bold">{t(requestData.priority)}</span>
          </li>

          <button
            className="bg-red-500 text-white text-sm px-6 py-2 rounded-lg hover:bg-red-600 ml-auto"
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
        </ul>

        <div className="mt-6">
          <p className="text-sm">{t(requestData.description)}</p>
        </div>
      </div>

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
