import React, { useState } from "react"; //added for testing
import { useTranslation } from "react-i18next";

// Example JSON data with multiple levels of subCategories - need to get this data from server
const Skills = ({
  checkedCategories,
  setCheckedCategories,
  categoriesData,
  setTextboxCheck,
  textboxValue,
  setTextboxValue,
}) => {
  // const [text, setText] = useState("");
  const { t } = useTranslation();
  // Recursive function to handle rendering categories and subcategories
  const renderCategories = (categories, parentPath = "") => {
    const sortedCategories = [...categories].sort((a, b) => {
      const aName = typeof a === "object" ? a.category : a;
      const bName = typeof b === "object" ? b.category : b;
      return aName.localeCompare(bName);
    });

    return sortedCategories.map((cat, index) => {
      const isObject = typeof cat === "object";
      const categoryName = isObject ? cat.category : cat;
      const hasSubCategories = isObject && cat.subCategories;

      // Create a unique path for each category, concatenating parent path and current category name
      const currentPath = parentPath
        ? `${parentPath}.${categoryName}`
        : categoryName;

      return (
        <div key={index} className="ml-4">
          <label className="inline-flex items-center space-x-2">
            <input
              type="checkbox"
              className="h-4 w-4"
              checked={getCheckedStatus(currentPath)}
              onChange={() => handleCheckboxChange(currentPath)}
            />
            <span className={getCheckedStatus(currentPath) ? "font-bold" : ""}>
              {categoryName}
            </span>
          </label>

          {currentPath === "General" && getCheckedStatus(currentPath) && (
            <div className="ml-5 mt-2">
              <label
                htmlFor="description"
                className="block text-gray-700 font-medium mb-2"
              >
                {t("DESCRIPTION")}
                <span className="text-red-500 m-1">*</span>(
                {t("MAX_CHARACTERS", { count: 500 })})
              </label>
              <textarea
                value={textboxValue}
                onChange={(e) => setTextboxValue(e.target.value)}
                placeholder="Please enter the details here (Required)"
                maxLength={500}
                className="border p-2 w-full rounded-lg"
              ></textarea>
            </div>
          )}

          {/* Recursively render subcategories if they exist */}
          {hasSubCategories && getCheckedStatus(currentPath) && (
            <div className="ml-3">
              {renderCategories(cat.subCategories, currentPath)}
            </div>
          )}
        </div>
      );
    });
  };

  // Function to handle the checkbox click
  const handleCheckboxChange = (categoryPath) => {
    setCheckedCategories((draft) => {
      const checkedStatus = getCheckedStatus(categoryPath);

      // Toggle the current category checkbox state
      setCheckboxState(draft, categoryPath, !checkedStatus);
    });
  };

  // Get the checked status of a category by its hierarchical path
  const getCheckedStatus = (categoryPath) => {
    const keys = categoryPath.split(".");
    let currentLevel = checkedCategories || {};

    for (let key of keys) {
      if (!currentLevel[key]) return false;
      currentLevel = currentLevel[key];
    }

    return currentLevel.checked;
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
          if (key == "General") {
            setTextboxCheck(false);
          }
        } else {
          // If unchecked, remove the key entirely
          delete currentLevel[key];
          if (key == "General") {
            setTextboxCheck(true);
          }
        }
      } else {
        if (!currentLevel[key]) {
          currentLevel[key] = {};
        }
        currentLevel = currentLevel[key];
      }
    });
  };

  return (
    <>
      <p className="font-bold text-xl mb-4">
        Select Your Skills For Volunteer Assignments
      </p>
      {categoriesData?.categories?.length > 0 &&
        renderCategories(categoriesData.categories)}
    </>
  );
};

export default Skills;
