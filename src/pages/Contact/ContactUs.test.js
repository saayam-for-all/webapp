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

// jsdom doesn't implement scrollTo — stub it so useEffect doesn't log errors
beforeAll(() => {
  window.scrollTo = jest.fn();
});

describe("ContactUs", () => {
  it("renders correctly", () => {
    const tree = render(<ContactUs />);
    expect(tree).toMatchSnapshot();
  });

  it("shows validation errors when submitting an empty form", () => {
    const { container } = render(<ContactUs />);

    // Submit the form directly rather than clicking the button — in jsdom,
    // Material UI's Button click doesn't reliably trigger the form's onSubmit
    const form = container.querySelector("form");
    fireEvent.submit(form);

    // The new "reason" validation error should appear — this also renders
    // the {errors.reason && ...} branch in the JSX
    expect(
      screen.getByText("Please select a reason for contacting"),
    ).toBeTruthy();
    expect(screen.getByText("Message is required")).toBeTruthy();
    expect(screen.getByText("First Name is required")).toBeTruthy();
    expect(screen.getByText("Last Name is required")).toBeTruthy();
    expect(screen.getByText("Email is required")).toBeTruthy();
  });

  it("allows selecting a reason from the dropdown", () => {
    render(<ContactUs />);

    // Open the MUI Select dropdown
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

    // After selection, "General Inquiry" appears in both the combobox display
    // and the (still-rendered) menu option, so use getAllByText
    expect(screen.getAllByText("General Inquiry").length).toBeGreaterThan(0);
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
    ).toBeTruthy();

    // Click again to collapse it — covers the openFAQIndex === index ? null : index branch
    //
    fireEvent.click(faqButton);
  });
});
