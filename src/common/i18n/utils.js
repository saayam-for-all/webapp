import i18n from "./i18n";
import localeList from "./localeList.js";
import { validateString } from "../../utils/validators";

export const changeUiLanguage = (language) => {
  if (!validateString(language) || !localeList.includes(language)) {
    return;
  }

  i18n.changeLanguage(language);
};

export const returnDefaultLanguage = (language) => {
  localStorage.removeItem("i18nextLng");
  i18n.changeLanguage();
};
