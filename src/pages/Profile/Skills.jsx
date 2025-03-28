import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { FaEdit, FaSave } from "react-icons/fa";

const Skills = ({ setHasUnsavedChanges }) => {
  const { t } = useTranslation();
  const [isEditing, setIsEditing] = useState(false);
  const [userSkills, setUserSkills] = useState({});
  const [categoriesData, setCategoriesData] = useState({ categories: [] });

  useEffect(() => {
    // Fetch user's skills and categories data
    fetchUserSkills();
    fetchCategoriesData();
  }, []);

  const fetchUserSkills = async () => {
    try {
      // TODO: Replace with actual API call
      const response = await fetch("/api/user/skills");
      const data = await response.json();
      setUserSkills(data.skills || {});
    } catch (error) {
      console.error("Error fetching user skills:", error);
    }
  };

  const fetchCategoriesData = async () => {
    try {
      // TODO: Replace with actual API call
      const response = await fetch("/api/skills/categories");
      const data = await response.json();
      setCategoriesData(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleCheckboxChange = (categoryPath) => {
    setUserSkills((prev) => {
      const newSkills = { ...prev };
      const keys = categoryPath.split(".");
      let currentLevel = newSkills;

      keys.forEach((key, index) => {
        if (index === keys.length - 1) {
          if (!currentLevel[key]) {
            currentLevel[key] = { checked: true };
          } else {
            delete currentLevel[key];
          }
        } else {
          if (!currentLevel[key]) {
            currentLevel[key] = {};
          }
          currentLevel = currentLevel[key];
        }
      });

      return newSkills;
    });
    setHasUnsavedChanges(true);
  };

  const getCheckedStatus = (categoryPath) => {
    const keys = categoryPath.split(".");
    let currentLevel = userSkills;

    for (let key of keys) {
      if (!currentLevel[key]) return false;
      currentLevel = currentLevel[key];
    }

    return currentLevel.checked;
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
              disabled={!isEditing}
            />
            <span className={getCheckedStatus(currentPath) ? "font-bold" : ""}>
              {categoryName}
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
      await fetch("/api/user/skills", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ skills: userSkills }),
      });
      setIsEditing(false);
      setHasUnsavedChanges(false);
    } catch (error) {
      console.error("Error saving skills:", error);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">{t("YOUR_SKILLS")}</h2>
        <div className="flex space-x-4">
          {isEditing ? (
            <button
              onClick={handleSave}
              className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              <FaSave className="mr-2" />
              {t("SAVE")}
            </button>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <FaEdit className="mr-2" />
              {t("EDIT")}
            </button>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-600 mb-4">{t("SELECT_SKILLS_DESCRIPTION")}</p>
        <div className="space-y-4">
          {categoriesData?.categories?.length > 0 &&
            renderCategories(categoriesData.categories)}
        </div>
      </div>
    </div>
  );
};

export default Skills;
