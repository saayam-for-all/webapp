import { List, ListItem, ListItemText } from "@mui/material";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useImmer } from "use-immer";
import { useSelector } from "react-redux";

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
  const [categoriesData, setCategoriesData] = useState([]);
  const [savedSkills, setSavedSkills] = useState([]);

  const categories = useSelector((state) => state.request?.categories || []);

  const getCategoryName = (cat) =>
    typeof cat === "object" ? cat.catName || cat.category : cat;

  const getSubCategories = (cat) =>
    typeof cat === "object" ? cat.subCategories || [] : [];
  const translateCategory = (categoryName, parentPath = "") => {
    if (!categoryName) return "";
    if (parentPath) {
      const parentKey = parentPath.split(".")[0];
      return t(
        `categories:REQUEST_CATEGORIES.${parentKey}.SUBCATEGORIES.${categoryName}.LABEL`,
        { defaultValue: categoryName },
      );
    }
    return t(`categories:REQUEST_CATEGORIES.${categoryName}.LABEL`, {
      defaultValue: categoryName,
    });
  };

  const resolveSkillLabel = (skillId) => {
    if (!skillId) return "";
    const id = String(skillId);
    const top = categoriesData.find(
      (c) => String(c.catId) === id || c.catName === id,
    );
    if (top) return translateCategory(top.catName);

    for (const c of categoriesData) {
      const sub = (c.subCategories || []).find(
        (s) => String(s.catId) === id || s.catName === id,
      );
      if (sub) {
        return translateCategory(sub.catName, c.catName);
      }

      for (const s of c.subCategories || []) {
        const subSub = (s.subCategories || []).find(
          (ss) => String(ss.catId) === id || ss.catName === id,
        );
        if (subSub) {
          return t(
            `categories:REQUEST_CATEGORIES.${c.catName}.SUBCATEGORIES.${s.catName}.SUBCATEGORIES.${subSub.catName}.LABEL`,
            { defaultValue: subSub.catName },
          );
        }
      }
    }

    return skillId;
  };

  const getSelectedSkills = (categories, parentPath = "") => {
    return categories.map((cat, index) => {
      const categoryName = getCategoryName(cat);
      const subCategories = getSubCategories(cat);
      const hasSubCategories = subCategories.length > 0;
      const currentPath = parentPath
        ? `${parentPath}.${categoryName}`
        : categoryName;
      if (!getCheckedStatus(currentPath)) return;
      return (
        <div className="flex flex-col" disablePadding key={index}>
          <ListItem className="" disablePadding>
            <ListItemText
              primary={`• ${translateCategory(categoryName, parentPath)}`}
            />
          </ListItem>
          {hasSubCategories && getCheckedStatus(currentPath) && (
            <div className="ml-5" disablePadding>
              <List className="" disablePadding>
                {getSelectedSkills(subCategories, currentPath)}
              </List>
            </div>
          )}
        </div>
      );
    });
  };

  useEffect(() => {
    if (categories && categories.length > 0) {
      setCategoriesData(categories);
      return;
    }

    const stored = localStorage.getItem("categories");
    if (stored) {
      try {
        setCategoriesData(JSON.parse(stored));
      } catch (e) {
        console.warn("Failed to parse categories from localStorage:", e);
      }
    }
  }, [categories]);

  useEffect(() => {
    const storedSkills = localStorage.getItem("volunteer_skills");
    if (storedSkills) {
      try {
        setSavedSkills(JSON.parse(storedSkills));
      } catch (e) {
        console.warn("Failed to parse volunteer skills:", e);
      }
    }
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

  const handleCheckboxChange = (categoryPath) => {
    setCheckedCategories((draft) => {
      const checkedStatus = getCheckedStatus(categoryPath);
      setCheckboxState(draft, categoryPath, !checkedStatus);
    });
  };

  const setCheckboxState = (draft, categoryPath, checked) => {
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
  };

  const renderCategories = (categories, parentPath = "") => {
    return categories.map((cat, index) => {
      const categoryName = getCategoryName(cat);
      const subCategories = getSubCategories(cat);
      const hasSubCategories = subCategories.length > 0;
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
              {renderCategories(subCategories, currentPath)}
            </div>
          )}
        </div>
      );
    });
  };

  const handleSave = async () => {
    try {
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
          {isEditing ? (
            renderCategories(categoriesData)
          ) : savedSkills.length > 0 ? (
            <List className="flex flex-col" disablePadding>
              {savedSkills.map((skill, idx) => (
                <ListItem key={idx} disablePadding>
                  <ListItemText primary={`• ${resolveSkillLabel(skill)}`} />
                </ListItem>
              ))}
            </List>
          ) : (
            <List className="flex flex-col" disablePadding>
              {getSelectedSkills(categoriesData)}
            </List>
          )}
        </div>
      </div>
      <div className="flex flex-row justify-center items-center gap-3 mb-6 mt-4">
        {isEditing ? (
          <>
            <button
              onClick={handleSave}
              className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              {t("SAVE")}
            </button>
            <button
              onClick={() => {
                setIsEditing(false);
                setHasUnsavedChanges(false);
              }}
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
