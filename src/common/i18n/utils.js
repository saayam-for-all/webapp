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
  if (!validateArray(languages)) {
    return;
  }

  const pattern = Object.keys(localeList);
  for (const language of languages) {
    if (!validateString(language) || !pattern.includes(language)) {
      continue;
    }

    i18n.changeLanguage(localeList[language]);
    return;
  }

  returnDefaultLanguage();
};

export const returnDefaultLanguage = () => {
  localStorage.removeItem("i18nextLng");
  i18n.changeLanguage();
};
