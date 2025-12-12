import i18n from "./i18n";
import localeList from "./localeList.js";
import { validateString, validateArray } from "../../utils/validators";

const PERSONAL_INFO = "personalInfo";
const USER_PREFERENCES = "userPreferences";

function getUserLanguages(personalOrPrefs) {
  try {
    // Prefer explicit object passed in (e.g., from Preferences save)
    if (!personalOrPrefs) {
      // 1) Prefer saved user preferences
      const savedPrefsRaw = localStorage.getItem(USER_PREFERENCES);
      if (savedPrefsRaw) {
        personalOrPrefs = JSON.parse(savedPrefsRaw);
      } else {
        // 2) Fallback to legacy personalInfo storage
        const savedPersonalInfo = localStorage.getItem(PERSONAL_INFO);
        personalOrPrefs = JSON.parse(savedPersonalInfo);
      }
    }

    return [
      personalOrPrefs?.languagePreference1,
      personalOrPrefs?.languagePreference2,
      personalOrPrefs?.languagePreference3,
    ].filter((language) => validateString(language));
  } catch (error) {
    console.error("Error on preferences parsing.", error);
    return null;
  }
}

export const changeUiLanguage = (personalInfo = null) => {
  const languages = getUserLanguages(personalInfo);

  if (!validateArray(languages)) {
    console.log("No valid user preferences — using browser language");
    localStorage.removeItem("i18nextLng");
    i18n.changeLanguage(); // re-run detection to respect browser language
    return;
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
