export function useTranslation() {
  return {
    t: (text) => `mockTranslate(${text})`,
    i18n: {
      language: "en",
      changeLanguage: jest.fn(),
    },
  };
}

export function Trans({ children, i18nKey, ...props }) {
  // Avoid JSON.stringify on props that may contain circular React elements
  // (e.g. components={{ 1: <Link /> }}) — only surface the i18nKey for tests.
  return <mock-trans data-i18n-key={i18nKey}>{children}</mock-trans>;
}
