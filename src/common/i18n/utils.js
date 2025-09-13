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
    console.log("No valid user preferences — using browser language");
    return; // Letting i18n use browser default
  }

  const pattern = Object.keys(localeList);
  const firstLanguage = languages[0];

  if (validateString(firstLanguage) && pattern.includes(firstLanguage)) {
    const targetLang = localeList[firstLanguage];

    if (i18n.language !== targetLang) {
      console.log("Switching to user preferred language:", targetLang);
      i18n.changeLanguage(targetLang);
    } else {
      console.log("Language already active:", targetLang, "— forcing event.");
      i18n.emit("languageChanged", targetLang);
    }

    return;
  }

  console.log(
    "First preference is invalid — falling back to browser language.",
  );
  // Don't force change — browser language will persist
};

export const returnDefaultLanguage = () => {
  localStorage.removeItem("i18nextLng");
  i18n.changeLanguage();
};
