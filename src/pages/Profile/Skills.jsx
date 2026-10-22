import { List, ListItem, ListItemText } from "@mui/material";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import {
  fetchUserSkills,
  updateUserSkills,
} from "../../services/volunteerServices";
import VolunteerSkills from "../Volunteer/steps/Skills";

const Skills = ({ setHasUnsavedChanges }) => {
  const { t } = useTranslation(["profile", "categories"]);
  const [isEditing, setIsEditing] = useState(false);
  const [categoriesData, setCategoriesData] = useState([]);
  const [savedSkills, setSavedSkills] = useState([]);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const [saveError, setSaveError] = useState(false);

  const categories = useSelector((state) => state.request?.categories || []);
  const userDbId = useSelector((state) => state.auth?.user?.userDbId);

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
    if (!userDbId) return;
    const loadSkills = async () => {
      try {
        const response = await fetchUserSkills(userDbId);
        const skills = response?.data?.skills || [];
        const skillIds = skills.map((s) => String(s));
        setSavedSkills(skillIds);
        setSelectedSkills(skillIds);
        setLoadError(false);
      } catch (error) {
        console.error("Failed to fetch user skills from API:", error);
        setLoadError(true);
      }
    };
    loadSkills();
  }, [userDbId]);

  const resolveSkillLabel = (skillId) => {
    if (!skillId) return "";
    const id = String(skillId);
    for (const c of categoriesData) {
      if (String(c.catId) === id)
        return t(`categories:REQUEST_CATEGORIES.${c.catName}.LABEL`, {
          defaultValue: c.catName,
        });
      for (const s of c.subCategories || []) {
        if (String(s.catId) === id)
          return t(
            `categories:REQUEST_CATEGORIES.${c.catName}.SUBCATEGORIES.${s.catName}.LABEL`,
            { defaultValue: s.catName },
          );
        for (const ss of s.subCategories || []) {
          if (String(ss.catId) === id)
            return t(
              `categories:REQUEST_CATEGORIES.${c.catName}.SUBCATEGORIES.${s.catName}.SUBCATEGORIES.${ss.catName}.LABEL`,
              { defaultValue: ss.catName },
            );
        }
      }
    }
    return skillId;
  };

  const getGeneralCategoryId = () => {
    const generalCategory = categoriesData.find(
      (category) => category.catName === "GENERAL_CATEGORY",
    );
    return generalCategory?.catId ? String(generalCategory.catId) : null;
  };

  const handleEdit = () => {
    setSelectedSkills(savedSkills);
    setSaveError(false);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setSelectedSkills(savedSkills);
    setSaveError(false);
    setIsEditing(false);
    setHasUnsavedChanges(false);
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      setSaveError(false);
      let skillsToSave = selectedSkills.map((skill) => String(skill));
      if (skillsToSave.length === 0) {
        const generalId = getGeneralCategoryId();
        if (!generalId) {
          setSaveError(true);
          return;
        }
        skillsToSave = [generalId];
      }
      await updateUserSkills(userDbId, skillsToSave);
      setSavedSkills(skillsToSave);
      setSelectedSkills(skillsToSave);
      setIsEditing(false);
      setHasUnsavedChanges(false);
    } catch (error) {
      console.error("Error saving skills:", error);
      setSaveError(true);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="p-6">
      {loadError && (
        <p className="text-red-500 text-sm mb-4">
          Failed to load skills. Please refresh the page and try again.
        </p>
      )}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="space-y-4">
          {isEditing ? (
            <>
              <VolunteerSkills
                selectedSkills={selectedSkills}
                setSelectedSkills={(skills) => {
                  setSelectedSkills(skills);
                  setHasUnsavedChanges(true);
                }}
                categories={categoriesData}
              />
              {selectedSkills.length === 0 && (
                <p className="text-amber-600 text-sm">
                  {t(
                    "profile:SKILLS_REQUIRED_GENERAL_FALLBACK",
                    "At least one skill is required. If no skill is selected, General will be saved by default.",
                  )}
                </p>
              )}
            </>
          ) : savedSkills.length > 0 ? (
            <List className="flex flex-col" disablePadding>
              {savedSkills.map((skill, idx) => (
                <ListItem key={idx} disablePadding>
                  <ListItemText primary={`• ${resolveSkillLabel(skill)}`} />
                </ListItem>
              ))}
            </List>
          ) : (
            <p className="text-sm text-gray-400 italic">
              {t("profile:NO_SKILLS") || "No skills added yet."}
            </p>
          )}
        </div>
      </div>
      <div className="flex flex-col items-center gap-2 mb-6 mt-4">
        {saveError && (
          <p className="text-red-500 text-sm text-center">
            Failed to save skills. Please try again.
          </p>
        )}
        <div className="flex flex-row gap-3">
          {isEditing ? (
            <>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
              >
                {isSaving ? t("SAVING") || "Saving..." : t("SAVE")}
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
              onClick={handleEdit}
              className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
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
