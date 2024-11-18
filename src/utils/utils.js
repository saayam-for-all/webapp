export const maskEmail = (email) => {
  const [name, domain] = email.split("@");
  const maskedName =
    name[0] + "x".repeat(name.length - 2) + name[name.length - 1];
  return `${maskedName}@${domain}`;
};

export const getPhoneCodeslist = (phoneCodeEn) => {
  return Object.entries(phoneCodeEn).map(([key, value]) => ({
    code: key,
    country: value.primary,
    dialCode: value.secondary,
  }));
};
