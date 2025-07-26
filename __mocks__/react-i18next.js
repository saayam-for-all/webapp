export function useTranslation() {
  return {
    t: (text) => `mockTranslate(${text})`,
    i18n: {
      language: "en",
      changeLanguage: jest.fn(),
    },
  };
}

export function Trans({ children, ...props }) {
  return <mock-trans props={JSON.stringify(props)}>{children}</mock-trans>;
}
