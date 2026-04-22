import { render, screen, fireEvent, within } from "@testing-library/react";
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
  isValidPhoneNumber: () => false,
}));

describe("ContactUs", () => {
  it("renders correctly", () => {
    const tree = render(<ContactUs />);
    expect(tree).toMatchSnapshot();
  });

  it("shows validation errors when submitting an empty form", () => {
    render(<ContactUs />);

    // Click the submit button with an empty form — this should trigger
    // all the validation branches in handleSubmit (firstName, lastName,
    // email, phone, reason, message)
    const submitButton = screen.getByRole("button", { name: /Submit/i });
    fireEvent.click(submitButton);

    // Confirm the new "reason" validation error appears — this also
    // renders the {errors.reason && ...} branch in the JSX
    expect(
      screen.getByText("Please select a reason for contacting"),
    ).toBeInTheDocument();
    expect(screen.getByText("Message is required")).toBeInTheDocument();
  });

  it("allows selecting a reason from the dropdown", () => {
    render(<ContactUs />);

    // Open the MUI Select dropdown — it's rendered as a button with combobox role
    const selectTrigger = screen.getByRole("combobox");
    fireEvent.mouseDown(selectTrigger);

    // Choose one of the reasons from the opened listbox — this causes
    // handleChange to fire and sets formData.reason, which in turn:
    //   - renders t(selected) in renderValue
    //   - switches targetHash to CONTACT_REASON_HASHES[reason]
    //   - switches _subject hidden input to the "New Contact Form: ..." branch
    const listbox = screen.getByRole("listbox");
    const option = within(listbox).getByText("General Inquiry");
    fireEvent.click(option);

    // Confirm the selected value is now shown in the Select
    expect(screen.getByText("General Inquiry")).toBeInTheDocument();
  });

  it("toggles FAQ items when clicked", () => {
    render(<ContactUs />);

    // Click the first FAQ question to expand it — this covers the toggleFAQ
    // function and the conditional rendering of the answer and arrow icons
    const faqButton = screen.getByRole("button", {
      name: /What services does Saayam for All offer/i,
    });
    fireEvent.click(faqButton);

    expect(
      screen.getByText(
        "We offer a platform to connect volunteers with people who need help in areas like education, food, and healthcare.",
      ),
    ).toBeInTheDocument();

    // Click again to collapse it
    fireEvent.click(faqButton);
  });
});
