import { render } from "@testing-library/react";
import ContactUs from "./ContactUs";

// Mock i18n so t() just returns the key
jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key) => key,
  }),
}));

// Mock child components that have heavy dependencies
jest.mock("../../common/components/PhoneNumberInputWithCountry", () => () => (
  <div data-testid="phone-input-mock" />
));

jest.mock("#components/Ads/HorizontalAd", () => () => (
  <div data-testid="horizontal-ad-mock" />
));

// Mock react-phone-number-input's validator
jest.mock("react-phone-number-input", () => ({
  isValidPhoneNumber: () => true,
}));

describe("ContactUs", () => {
  it("renders correctly", () => {
    const tree = render(<ContactUs />);
    expect(tree).toMatchSnapshot();
  });
});
