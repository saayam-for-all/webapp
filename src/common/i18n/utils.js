import i18n from "./i18n";
import localeList from "./localeList.js";
import { validateString, validateArray } from "../../utils/validators";

const PERSONAL_INFO = "personalInfo";

function getUserLanguages() {
  const savedPersonalInfo = localStorage.getItem(PERSONAL_INFO);
  try {
    const personalInfo = JSON.parse(savedPersonalInfo);
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

export const changeUiLanguage = () => {
  const languages = getUserLanguages();
  if (!validateArray(languages)) {
    return;
  }

  const pattern = Object.keys(localeList);
  for (const language of languages) {
    if (!validateString(language) || !pattern.includes(language)) {
      continue;
    }

    i18n.changeLanguage(localeList[language]);
    break;
  }
};

export const returnDefaultLanguage = (language) => {
  localStorage.removeItem("i18nextLng");
  i18n.changeLanguage();
};
