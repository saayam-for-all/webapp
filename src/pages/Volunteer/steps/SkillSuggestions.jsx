import { useState } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { predictCategories } from "../../../services/requestServices";
import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  FormGroup,
  Typography,
} from "@mui/material";
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
      setCheckedSkills(
        resolved
          .filter((skill) => selectedSkills.includes(skill.catId))
          .map((skill) => skill.catId),
      );
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
    const suggestedIds = new Set(suggestions.map((skill) => skill.catId));

    const retainedSkills = selectedSkills.filter(
      (id) => !suggestedIds.has(id) || checkedSkills.includes(id),
    );

    setSelectedSkills(mergeSelectedSkills(retainedSkills, checkedSkills));

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
          <div className="relative">
            <textarea
              id="volunteer-skills-description"
              value={description}
              maxLength={MAX_SKILL_DESCRIPTION_LENGTH}
              rows={4}
              onChange={(event) => setDescription(event.target.value)}
              placeholder={t(
                "common:VOLUNTEER_SKILLS_DESCRIPTION_PLACEHOLDER",
                {
                  defaultValue:
                    "Describe your skills and how you would like to help.",
                },
              )}
              className="w-full border border-gray-300 rounded-lg p-3 pe-10 resize-y"
            />
            {description.length > 0 && (
              <button
                type="button"
                aria-label={t("common:VOLUNTEER_CLEAR_DESCRIPTION", {
                  defaultValue: "Clear description",
                })}
                title={t("common:VOLUNTEER_CLEAR_DESCRIPTION", {
                  defaultValue: "Clear description",
                })}
                disabled={loading}
                onClick={() => {
                  setDescription("");
                  setError("");
                }}
                className="absolute top-2 end-3 text-xl text-gray-500 hover:text-gray-800 disabled:opacity-50"
              >
                &times;
              </button>
            )}
          </div>

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

      <Dialog
        open={showModal}
        onClose={() => setShowModal(false)}
        aria-labelledby="volunteer-suggested-skills-title"
      >
        <DialogTitle id="volunteer-suggested-skills-title">
          {t("common:VOLUNTEER_SUGGESTED_SKILLS", {
            defaultValue: "Suggested Skills",
          })}
        </DialogTitle>

        <DialogContent>
          {noMatch && (
            <Typography className="mb-4">
              {t("common:VOLUNTEER_SKILLS_NO_MATCH", {
                defaultValue:
                  "We couldn't find a match for your skills. Please choose General category or explore the skills picker on the page.",
              })}
            </Typography>
          )}

          <FormGroup>
            {suggestions.map((skill) => (
              <FormControlLabel
                key={skill.catId}
                control={
                  <Checkbox
                    checked={checkedSkills.includes(skill.catId)}
                    onChange={() => toggleSuggestion(skill.catId)}
                  />
                }
                label={translatePath(skill.hierarchy)}
              />
            ))}
          </FormGroup>

          {unmatchedSkills.length > 0 && (
            <Typography variant="body2" sx={{ mt: 2 }} color="text.secondary">
              {t("common:VOLUNTEER_UNMATCHED_SKILLS", {
                defaultValue: "We couldn't match {{skills}}.",
                skills: unmatchedSkills.join(", "),
              })}
            </Typography>
          )}
        </DialogContent>

        <DialogActions>
          <Button
            type="button"
            onClick={handleAddSkills}
            variant="contained"
            className="bg-blue-500 hover:bg-blue-600 text-white hover:text-white"
          >
            {t("common:VOLUNTEER_SELECT_SKILLS", {
              defaultValue: "Select",
            })}
          </Button>
          <Button
            type="button"
            onClick={() => setShowModal(false)}
            variant="contained"
            className="bg-gray-500 hover:bg-gray-600 text-white hover:text-white"
          >
            {t("common:CANCEL", {
              defaultValue: "Cancel",
            })}
          </Button>
        </DialogActions>
      </Dialog>
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
