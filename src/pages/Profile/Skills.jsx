import { List, ListItem, ListItemText } from "@mui/material";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useImmer } from "use-immer";
import { getVolunteerSkills } from "../../services/volunteerServices";

const Skills = ({ setHasUnsavedChanges }) => {
  const { t } = useTranslation("profile");
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
  // Update with user skills data from the API once that is created
  const [checkedCategories, setCheckedCategories] = useImmer(mockCategories);
  const [categoriesData, setCategoriesData] = useState();

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
            <ListItemText primary={`• ${categoryName}`} />
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
      .catch((error) => {});
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
        <div key={index} className="ml-4 mb-3">
          <label className="inline-flex items-center space-x-3 cursor-pointer group">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 focus:ring-2 transition-all"
              checked={getCheckedStatus(currentPath)}
              onChange={() => handleCheckboxChange(currentPath)}
            />
            <span
              className={`text-sm ${getCheckedStatus(currentPath) ? "font-semibold text-blue-700" : "text-gray-700 group-hover:text-gray-900"} transition-colors`}
            >
              {categoryName}
            </span>
          </label>

          {hasSubCategories && getCheckedStatus(currentPath) && (
            <div className="ml-4 mt-2 pl-3 border-l-2 border-blue-100">
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
    <div className="space-y-6">
      {/* Header Section */}
      <div className="space-y-1">
        <h2 className="text-xl font-semibold text-gray-900">{t("SKILLS")}</h2>
        <p className="text-sm text-gray-500">{t("SKILLS_DESCRIPTION")}</p>
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <div className="space-y-3">
          {categoriesData?.categories?.length > 0 ? (
            isEditing ? (
              <div className="space-y-2">
                {renderCategories(categoriesData.categories)}
              </div>
            ) : (
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                <List className="flex flex-col" disablePadding>
                  {getSelectedSkills(categoriesData.categories)}
                </List>
              </div>
            )
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>{t("NO_SKILLS_DATA")}</p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end pt-6 mt-6 border-t border-gray-100">
          {isEditing ? (
            <div className="flex gap-3">
              <button
                onClick={() => setIsEditing(false)}
                className="inline-flex items-center gap-2 py-2.5 px-6 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-all duration-200"
              >
                {t("CANCEL")}
              </button>
              <button
                onClick={handleSave}
                className="inline-flex items-center gap-2 py-2.5 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-200"
              >
                {t("SAVE")}
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="inline-flex items-center gap-2 py-2.5 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-200"
            >
              {t("EDIT")}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Skills;
