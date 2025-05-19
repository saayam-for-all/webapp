import { List, ListItem, ListItemText } from "@mui/material";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useImmer } from "use-immer";
import { getVolunteerSkills } from "../../services/volunteerServices";

const Skills = ({ setHasUnsavedChanges }) => {
  const { t } = useTranslation();
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

  const [originalData, setOriginalData] = useState(mockCategories);

  // Update with user skills data from the API once that is created
  const [checkedCategories, setCheckedCategories] = useImmer(mockCategories);
  const [categoriesData, setCategoriesData] = useState({ categories: [] });

  const getSelectedSkills = (categories, parentPath = "") => {
    if (!categories || !Array.isArray(categories)) return null;

    return categories
      .map((cat, index) => {
        if (!cat) return null;

        const isObject = typeof cat === "object";
        const categoryName = isObject ? cat.category : cat;
        if (!categoryName) return null;

        const hasSubCategories =
          isObject && cat.subCategories && Array.isArray(cat.subCategories);
        const currentPath = parentPath
          ? `${parentPath}.${categoryName}`
          : categoryName;

        if (!getCheckedStatus(currentPath)) return null;

        return (
          <div
            className="flex flex-col"
            key={`${currentPath}-${index}`}
            disablePadding
          >
            <ListItem className="" disablePadding>
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
      })
      .filter((item) => item !== null);
  };

  useEffect(() => {
    try {
      getVolunteerSkills()
        .then((data) => {
          if (data?.body) {
            setCategoriesData(data.body);

            if (data.body.userSkills) {
              setCheckedCategories(data.body.userSkills);
              setOriginalData(JSON.parse(JSON.stringify(data.body.userSkills)));
            }
          }
        })
        .catch((error) => {
          console.error("Error fetching volunteer skills:", error);
        });
    } catch (error) {
      console.error("Exception in useEffect:", error);
    }
  }, []);

  const getCheckedStatus = (categoryPath) => {
    try {
      if (!categoryPath) return false;

      const keys = categoryPath.split(".");
      let currentLevel = checkedCategories || {};

      for (let key of keys) {
        if (!currentLevel[key]) return false;
        currentLevel = currentLevel[key];
      }

      return currentLevel.checked === true;
    } catch (error) {
      console.error("Error in getCheckedStatus:", error);
      return false;
    }
  };

  // Function to handle the checkbox click
  const handleCheckboxChange = (categoryPath) => {
    setHasUnsavedChanges(true);

    setCheckedCategories((draft) => {
      try {
        const checkedStatus = getCheckedStatus(categoryPath);
        setCheckboxState(draft, categoryPath, !checkedStatus);
      } catch (error) {
        console.error("Error in handleCheckboxChange:", error);
      }
    });
  };

  // Set the checkbox state for a category at a given path using immer's draft
  const setCheckboxState = (draft, categoryPath, checked) => {
    try {
      if (!categoryPath) return;

      const keys = categoryPath.split(".");
      let currentLevel = draft;

      keys.forEach((key, index) => {
        if (index === keys.length - 1) {
          if (checked) {
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
    } catch (error) {
      console.error("Error in setCheckboxState:", error);
    }
  };

  const renderCategories = (categories, parentPath = "") => {
    if (!categories || !Array.isArray(categories)) return null;

    return categories
      .map((cat, index) => {
        if (!cat) return null;

        const isObject = typeof cat === "object";
        const categoryName = isObject ? cat.category : cat;
        if (!categoryName) return null;

        const hasSubCategories =
          isObject && cat.subCategories && Array.isArray(cat.subCategories);
        const currentPath = parentPath
          ? `${parentPath}.${categoryName}`
          : categoryName;

        return (
          <div key={`${currentPath}-${index}`} className="ml-4 mb-2">
            <label className="inline-flex items-center space-x-2">
              <input
                type="checkbox"
                className="h-4 w-4"
                checked={getCheckedStatus(currentPath)}
                onChange={() => handleCheckboxChange(currentPath)}
              />
              <span
                className={getCheckedStatus(currentPath) ? "font-bold" : ""}
              >
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
      })
      .filter((item) => item !== null);
  };

  const handleSave = async () => {
    try {
      // TODO: Replace with actual API call
      // await fetch("/api/user/skills", {
      //   method: "PUT",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify({ skills: checkedCategories }),
      // });

      setOriginalData(JSON.parse(JSON.stringify(checkedCategories)));
      setIsEditing(false);
      setHasUnsavedChanges(false);
    } catch (error) {
      console.error("Error saving skills:", error);
    }
  };

  const handleCancel = () => {
    setCheckedCategories(JSON.parse(JSON.stringify(originalData)));
    setIsEditing(false);
    setHasUnsavedChanges(false);
  };
  if (!categoriesData || !categoriesData.categories) {
    return (
      <div className="p-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-center py-8">
            <p>Loading skills data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="space-y-4">
          {categoriesData.categories && categoriesData.categories.length > 0 ? (
            isEditing ? (
              renderCategories(categoriesData.categories)
            ) : (
              <List className="flex flex-col" disablePadding>
                {getSelectedSkills(categoriesData.categories)}
              </List>
            )
          ) : (
            <div className="text-center py-8">
              <p>No skills categories available.</p>
            </div>
          )}
        </div>
      </div>
      <div className="flex flex-row justify-center items-center mb-6 mt-4">
        {isEditing ? (
          <>
            <button
              onClick={handleSave}
              className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors mr-2"
            >
              {t("SAVE")}
            </button>
            <button
              onClick={handleCancel}
              className="flex items-center px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              {t("CANCEL")}
            </button>
          </>
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
