import i18n from "./i18n";
import localeList from "./localeList.js";
import { validateString, validateArray } from "../../utils/validators";

const PERSONAL_INFO = "personalInfo";

function getUserLanguages(personalInfo) {
  try {
    if (!personalInfo) {
      const savedPersonalInfo = localStorage.getItem(PERSONAL_INFO);
      personalInfo = JSON.parse(savedPersonalInfo);
    }
    return [
      personalInfo?.languagePreference1,
      personalInfo?.languagePreference2,
      personalInfo?.languagePreference3,
    ].filter((language) => validateString(language));
  } catch (error) {
    console.error("Error on PersonalInfo parsing.", error);
    return null;
  }
}

export const changeUiLanguage = (personalInfo = null) => {
  const languages = getUserLanguages(personalInfo);

  // If no personal info or no preferences, skip and use browser language.
  if (!validateArray(languages)) {
    console.log(
      "No valid user language preferences, keeping browser language.",
    );
    return;
  }

  const pattern = Object.keys(localeList);

  const firstLanguage = languages[0];

  if (
    validateString(firstLanguage) &&
    pattern.includes(firstLanguage) &&
    firstLanguage !== "English"
  ) {
    console.log("Changing language to:", localeList[firstLanguage]);
    i18n.changeLanguage(localeList[firstLanguage]);
    return;
  }

  console.log(
    "No valid first language preference found, keeping browser language.",
  );
  // DO NOT force 2nd/3rd language — leave i18n on browser language.
};

export const returnDefaultLanguage = () => {
  localStorage.removeItem("i18nextLng");
  i18n.changeLanguage();
};
