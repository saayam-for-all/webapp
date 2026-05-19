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

const findCategoryLabel = (node, targetKey) => {
  if (!node || !targetKey) return null;

  for (const [key, value] of Object.entries(node)) {
    if (key === targetKey && value?.LABEL) return value.LABEL;

    if (value?.SUBCATEGORIES) {
      const found = findCategoryLabel(value.SUBCATEGORIES, targetKey);
      if (found) return found;
    }
  }

  return null;
};

const RequestDescription = ({ requestData }) => {
  const { t, i18n } = useTranslation();

  const cDate = new Date(requestData.creationDate);
  const formattedDate = cDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const lang = i18n.resolvedLanguage || i18n.language || "en";
  const categoriesBundle = i18n.hasResourceBundle?.(lang, "categories")
    ? i18n.getResourceBundle(lang, "categories")
    : i18n.getResourceBundle("en", "categories");

  const categoryLabel =
    findCategoryLabel(
      categoriesBundle?.REQUEST_CATEGORIES,
      requestData?.category,
    ) || requestData?.category;

  const attributes = [
    {
      context: formattedDate,
      type: "Creation Date",
      icon: <VscCalendar size={22} />,
    },
    {
      context: categoryLabel,
      type: "Category",
      icon: <TbTriangleSquareCircle size={22} />,
    },
  ];

  return (
    <div className="border border-gray-300 rounded-lg p-4">
      <div>
        <ul className="w-full flex flex-col sm:flex-row items-start flex-wrap md:gap-2 lg:gap-10 text-xs text-gray-700 sm:items-center justify-between">
          {attributes.map((header, index) => (
            <li key={index} className="flex items-center gap-2">
              {header.icon}
              {header.context}
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
        </ul>

        <div className="w-full m-0">
          <p className="text-sm p-5">{t(requestData.description)}</p>
        </div>
      </div>
    </div>
  );
};

export default RequestDescription;
