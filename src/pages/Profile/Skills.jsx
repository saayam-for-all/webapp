import { List, ListItem, ListItemText } from "@mui/material";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useImmer } from "use-immer";
import { getVolunteerSkills } from "../../services/volunteerServices";

const Skills = ({ setHasUnsavedChanges }) => {
  const { t } = useTranslation(["profile", "categories"]);
  const [isEditing, setIsEditing] = useState(false);
  const mockCategories = {
    Books: { checked: true },
    Education: {
      checked: true,
      Elementary: { checked: true },
      "Middle School": { checked: true },
    },
    Gardening: { checked: true },
    Matrimonial: { checked: true },
    Shopping: { checked: true },
  };
  const [checkedCategories, setCheckedCategories] = useImmer(mockCategories);
  const [categoriesData, setCategoriesData] = useState();

  const CATEGORY_LABEL_TO_KEY = {
    "Food & Essentials": "FOOD_AND_ESSENTIALS",
    "Clothing Assistance": "CLOTHING_ASSISTANCE",
    "Housing Assistance": "HOUSING_ASSISTANCE",
    "Education & Career Assistance": "EDUCATION_CAREER_SUPPORT",
    "Healthcare & Wellbeing": "HEALTHCARE_AND_WELLNESS",
    "Elderly & Community Assistance": "ELDERLY_COMMUNITY_ASSISTANCE",
    General: "GENERAL_CATEGORY",
  };

  const toI18nKey = (label) => {
    if (!label) return "";
    if (CATEGORY_LABEL_TO_KEY[label]) return CATEGORY_LABEL_TO_KEY[label];
    if (/^[A-Z0-9_]+$/.test(label)) return label;
    return label
      .toUpperCase()
      .replace(/\//g, "_")
      .replace(/&/g, "AND")
      .replace(/\s+/g, "_");
  };

  const translateCategory = (categoryName, parentPath = "") => {
    const categoryKey = toI18nKey(categoryName);

    if (parentPath) {
      const parentKey = toI18nKey(parentPath.split(".")[0]);
      return t(
        `categories:REQUEST_CATEGORIES.${parentKey}.SUBCATEGORIES.${categoryKey}.LABEL`,
        { defaultValue: categoryName },
      );
    }

    return t(`categories:REQUEST_CATEGORIES.${categoryKey}.LABEL`, {
      defaultValue: categoryName,
    });
  };

  const getSelectedSkills = (categories, parentPath = "", selected = []) => {
    return categories.map((cat, index) => {
      const isObject = typeof cat === "object";
      const categoryName = isObject ? cat.category : cat;
      const hasSubCategories = isObject && cat.subCategories;
      const currentPath = parentPath
        ? `${parentPath}.${categoryName}`
        : categoryName;
      if (!getCheckedStatus(currentPath)) return;
      return (
        <div className="flex flex-col" disablePadding>
          <ListItem key={index} className="" disablePadding>
            <ListItemText
              primary={`• ${translateCategory(categoryName, parentPath)}`}
            />
          </ListItem>
          {hasSubCategories && getCheckedStatus(currentPath) && (
            <div className="ml-5" disablePadding>
              <List className="" disablePadding>
                {getSelectedSkills(cat.subCategories, currentPath)}
              </List>
            </div>
          )}
        </div>
      );
    });
  };

  useEffect(() => {
    getVolunteerSkills()
      .then((data) => {
        setCategoriesData(data?.body);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const getCheckedStatus = (categoryPath) => {
    const keys = categoryPath.split(".");
    let currentLevel = checkedCategories || {};

    for (let key of keys) {
      if (!currentLevel[key]) return false;
      currentLevel = currentLevel[key];
    }

    return currentLevel.checked;
  };

  // Function to handle the checkbox click
  const handleCheckboxChange = (categoryPath) => {
    setCheckedCategories((draft) => {
      const checkedStatus = getCheckedStatus(categoryPath);

      // Toggle the current category checkbox state
      setCheckboxState(draft, categoryPath, !checkedStatus);
    });
  };

  // Set the checkbox state for a category at a given path using immer's draft
  const setCheckboxState = (draft, categoryPath, checked) => {
    const keys = categoryPath.split(".");
    let currentLevel = draft;

    keys.forEach((key, index) => {
      if (index === keys.length - 1) {
        if (checked) {
          // If the checkbox is checked, set it to true
          currentLevel[key] = { checked: true };
        } else {
          // If unchecked, remove the key entirely
          delete currentLevel[key];
        }
      } else {
        if (!currentLevel[key]) {
          currentLevel[key] = {};
        }
        currentLevel = currentLevel[key];
      }
    });
  };

  const renderCategories = (categories, parentPath = "") => {
    return categories.map((cat, index) => {
      const isObject = typeof cat === "object";
      const categoryName = isObject ? cat.category : cat;
      const hasSubCategories = isObject && cat.subCategories;
      const currentPath = parentPath
        ? `${parentPath}.${categoryName}`
        : categoryName;

      return (
        <div key={index} className="ml-4 mb-2">
          <label className="inline-flex items-center space-x-2">
            <input
              type="checkbox"
              className="h-4 w-4"
              checked={getCheckedStatus(currentPath)}
              onChange={() => handleCheckboxChange(currentPath)}
            />
            <span className={getCheckedStatus(currentPath) ? "font-bold" : ""}>
              {translateCategory(categoryName, parentPath)}
            </span>
          </label>

          {hasSubCategories && getCheckedStatus(currentPath) && (
            <div className="ml-3">
              {renderCategories(cat.subCategories, currentPath)}
            </div>
          )}
        </div>
      );
    });
  };

  const handleSave = async () => {
    try {
      // TODO: Replace with actual API call
      // await fetch("/api/user/skills", {
      //   method: "PUT",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify({ skills: userSkills }),
      // });
      setIsEditing(false);
      setHasUnsavedChanges(false);
    } catch (error) {
      console.error("Error saving skills:", error);
    }
  };

  return (
    <div className="p-6">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="space-y-4">
          {categoriesData?.categories?.length > 0 &&
            (isEditing ? (
              renderCategories(categoriesData.categories)
            ) : (
              <List className="flex flex-col" disablePadding>
                {getSelectedSkills(categoriesData.categories)}
              </List>
            ))}
        </div>
      </div>
      <div className="flex flex-row justify-center items-center mb-6 mt-4">
        {isEditing ? (
          <button
            onClick={handleSave}
            className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            {t("SAVE")}
          </button>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            {t("EDIT")}
          </button>
        )}
      </div>
    </div>
  );
};

export default Skills;
