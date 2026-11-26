import { useState } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { predictCategories } from "../../../services/requestServices";
import Modal from "../../../common/components/Modal/Modal";
import {
  MAX_SKILL_DESCRIPTION_LENGTH,
  buildSkillSuggestionPayload,
  normalizeSkillSuggestionResponse,
  resolveSuggestedSkills,
  getGeneralSkill,
  mergeSelectedSkills,
} from "./skillSuggestionUtils";

const SkillSuggestions = ({
  categories,
  selectedSkills,
  setSelectedSkills,
  session,
  setSession,
}) => {
  const { t } = useTranslation(["common", "categories"]);

  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [checkedSkills, setCheckedSkills] = useState([]);
  const [unmatchedSkills, setUnmatchedSkills] = useState([]);
  const [noMatch, setNoMatch] = useState(false);
  const [error, setError] = useState("");

  const translatePath = (hierarchy) => {
    let key = "categories:REQUEST_CATEGORIES";

    return hierarchy
      .map((name, index) => {
        key += index === 0 ? `.${name}` : `.SUBCATEGORIES.${name}`;

        return t(`${key}.LABEL`, {
          defaultValue: name,
        });
      })
      .join(" > ");
  };

  const handleSuggest = async () => {
    if (!description.trim() || loading) return;

    setLoading(true);
    setError("");
    setNoMatch(false);
    setUnmatchedSkills([]);
    setSuggestions([]);
    setCheckedSkills([]);

    try {
      const payload = buildSkillSuggestionPayload(description, session);

      const response = await predictCategories(payload);

      const result = normalizeSkillSuggestionResponse(response);

      if (result.session !== undefined) {
        setSession(result.session);
      }

      let resolved = resolveSuggestedSkills(result.categories, categories);

      setUnmatchedSkills(result.unmatchedSkills);

      if (result.categories.length > 0 && resolved.length === 0) {
        throw new Error(
          "Suggested categories could not be mapped to available skills",
        );
      }

      if (result.categories.length === 0) {
        setNoMatch(true);

        const general = getGeneralSkill(categories);

        resolved = general ? [general] : [];
      }

      setSuggestions(resolved);
      setShowModal(true);
    } catch {
      setError(
        t("common:VOLUNTEER_SKILL_SUGGESTION_ERROR", {
          defaultValue:
            "Skill suggestions are currently unavailable. Please use the skills picker below.",
        }),
      );
    } finally {
      setLoading(false);
    }
  };

  const toggleSuggestion = (catId) => {
    setCheckedSkills((previous) =>
      previous.includes(catId)
        ? previous.filter((id) => id !== catId)
        : [...previous, catId],
    );
  };

  const handleAddSkills = () => {
    setSelectedSkills(mergeSelectedSkills(selectedSkills, checkedSkills));

    setShowModal(false);
    setCheckedSkills([]);
  };

  return (
    <div className="mb-5">
      <label
        htmlFor="volunteer-skills-description"
        className="block font-semibold mb-2"
      >
        {t("common:VOLUNTEER_SKILLS_DESCRIPTION", {
          defaultValue: "Description",
        })}
      </label>

      <div className="flex flex-col sm:flex-row gap-3 items-start">
        <div className="flex-1 w-full">
          <textarea
            id="volunteer-skills-description"
            value={description}
            maxLength={MAX_SKILL_DESCRIPTION_LENGTH}
            rows={4}
            onChange={(event) => setDescription(event.target.value)}
            placeholder={t("common:VOLUNTEER_SKILLS_DESCRIPTION_PLACEHOLDER", {
              defaultValue:
                "Describe your skills and how you would like to help.",
            })}
            className="w-full border border-gray-300 rounded-lg p-3 resize-y"
          />

          <p className="text-xs text-gray-500 text-right">
            {description.length}/{MAX_SKILL_DESCRIPTION_LENGTH}
          </p>
        </div>

        <button
          type="button"
          onClick={handleSuggest}
          disabled={!description.trim() || loading}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading
            ? t("common:VOLUNTEER_SKILLS_LOADING", {
                defaultValue: "Finding skills...",
              })
            : t("common:VOLUNTEER_SUGGEST_SKILLS", {
                defaultValue: "Suggest Skills",
              })}
        </button>
      </div>

      {loading && (
        <p role="status" className="text-sm text-blue-600 mt-2">
          {t("common:VOLUNTEER_SKILLS_LOADING_MESSAGE", {
            defaultValue: "Finding skills that match your description...",
          })}
        </p>
      )}

      {error && (
        <p role="alert" className="text-sm text-red-600 mt-2">
          {error}
        </p>
      )}

      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleAddSkills}
        submitText={t("common:VOLUNTEER_ADD_SKILLS", {
          defaultValue: "Add Selected Skills",
        })}
      >
        <h2 className="text-xl font-semibold mb-4">
          {t("common:VOLUNTEER_SUGGESTED_SKILLS", {
            defaultValue: "Suggested Skills",
          })}
        </h2>

        {noMatch && (
          <p className="text-sm text-gray-600 mb-4">
            {t("common:VOLUNTEER_SKILLS_NO_MATCH", {
              defaultValue:
                "We couldn't find a match for your skills. Please choose General category or explore the skills picker on the page.",
            })}
          </p>
        )}

        {unmatchedSkills.length > 0 && (
          <p className="text-sm text-gray-600 mb-4">
            {t("common:VOLUNTEER_UNMATCHED_SKILLS", {
              defaultValue: "We couldn't match {{skills}}.",
              skills: unmatchedSkills.join(", "),
            })}
          </p>
        )}

        <div className="flex flex-col gap-3">
          {suggestions.map((skill) => {
            const alreadySelected = selectedSkills.includes(skill.catId);

            return (
              <label
                key={skill.catId}
                className="flex items-center gap-3 border border-gray-200 rounded-lg p-3"
              >
                <input
                  type="checkbox"
                  checked={
                    alreadySelected || checkedSkills.includes(skill.catId)
                  }
                  disabled={alreadySelected}
                  onChange={() => toggleSuggestion(skill.catId)}
                  className="h-4 w-4"
                />

                <span className="text-sm">
                  {translatePath(skill.hierarchy)}

                  {alreadySelected && (
                    <span className="block text-xs text-gray-500">
                      {t("common:VOLUNTEER_SKILL_ALREADY_SELECTED", {
                        defaultValue: "Already selected",
                      })}
                    </span>
                  )}
                </span>
              </label>
            );
          })}
        </div>
      </Modal>
    </div>
  );
};

SkillSuggestions.propTypes = {
  categories: PropTypes.arrayOf(PropTypes.object).isRequired,
  selectedSkills: PropTypes.arrayOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  ).isRequired,
  setSelectedSkills: PropTypes.func.isRequired,
  session: PropTypes.object,
  setSession: PropTypes.func.isRequired,
};

export default SkillSuggestions;
