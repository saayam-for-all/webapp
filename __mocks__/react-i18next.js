export function useTranslation() {
  return { t: (text) => `mockTranslate(${text})` };
}

export function Trans({ children, ...props }) {
  return <mock-trans props={JSON.stringify(props)}>{children}</mock-trans>;
}
