// __mocks__/i18next.js

const i18n = {
    use: () => i18n, // permite encadenar use().use().init()
    init: () => i18n,
    t: (key) => `mockTranslate(${key})`,
  };
  
  export default i18n;
  
  // react-i18next mocks
  
  export function useTranslation() {
    return {
      t: (key) => `mockTranslate(${key})`,
      i18n,
    };
  }
  
  export function Trans({ children }) {
    return <>{children}</>;
  }
  
  export const initReactI18next = {
    type: '3rdParty',
    init: () => {},
  };
  