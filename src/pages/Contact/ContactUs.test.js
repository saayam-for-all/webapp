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

// Mock react-phone-number-input's validator (returns false so the invalid-phone
// else-if branch gets covered on every submit attempt with non-empty phone)
jest.mock("react-phone-number-input", () => ({
  isValidPhoneNumber: () => false,
}));

// Silence jsdom "window.scrollTo is not implemented" warning
beforeAll(() => {
  window.scrollTo = jest.fn();
});

// Helper to submit the form — using fireEvent.submit directly on the form
// bypasses the browser's native HTML5 required-field validation, which
// otherwise blocks handleSubmit from ever running.
const submitForm = () => {
  const form = document.querySelector("form");
  fireEvent.submit(form);
};

describe("ContactUs", () => {
  it("renders without crashing", () => {
    render(<ContactUs />);
    // Sanity checks — the page's main headings and submit button are present.
    // Avoids brittle MUI snapshots that differ across environments.
    expect(screen.getByText("Contact Us")).toBeTruthy();
    expect(screen.getByText("Get In Touch")).toBeTruthy();
    expect(screen.getByRole("button", { name: /Submit/i })).toBeTruthy();
  });

  it("shows validation errors when submitting an empty form", () => {
    render(<ContactUs />);

    // Submit an empty form — hits all "X is required" validation branches
    submitForm();

    expect(
      screen.getByText("Please select a reason for contacting"),
    ).toBeTruthy();
    expect(screen.getByText("Message is required")).toBeTruthy();
    expect(screen.getByText("First Name is required")).toBeTruthy();
    expect(screen.getByText("Last Name is required")).toBeTruthy();
    expect(screen.getByText("Email is required")).toBeTruthy();
  });

  it("shows format errors when fields are filled with invalid values", () => {
    render(<ContactUs />);

    // Fill fields with invalid values to hit the "else if" format branches:
    //   - Name regex (only letters & spaces)
    //   - Email regex
    fireEvent.change(screen.getByLabelText(/First Name/i), {
      target: { name: "firstName", value: "12345" },
    });
    fireEvent.change(screen.getByLabelText(/Last Name/i), {
      target: { name: "lastName", value: "67890" },
    });
    fireEvent.change(screen.getByLabelText(/Email/i), {
      target: { name: "email", value: "not-an-email" },
    });

    submitForm();

    expect(
      screen.getByText("First Name should contain only letters"),
    ).toBeTruthy();
    expect(
      screen.getByText("Last Name should contain only letters"),
    ).toBeTruthy();
    expect(screen.getByText("Email is invalid")).toBeTruthy();
  });

  it("allows selecting a reason from the dropdown", () => {
    render(<ContactUs />);

    // Open the MUI Select dropdown
    const selectTrigger = screen.getByRole("combobox");
    fireEvent.mouseDown(selectTrigger);

    // Choose a reason — this triggers handleChange, sets formData.reason,
    // and in turn:
    //   - renders t(selected) in renderValue
    //   - switches targetHash to CONTACT_REASON_HASHES[reason]
    //   - switches _subject hidden input to the truthy branch
    const listbox = screen.getByRole("listbox");
    const option = within(listbox).getByText("General Inquiry");
    fireEvent.click(option);

    // After selection the text may appear in both the trigger and (briefly)
    // the listbox — use getAllByText and just confirm at least one exists
    expect(screen.getAllByText("General Inquiry").length).toBeGreaterThan(0);
  });

  it("toggles FAQ items when clicked", () => {
    render(<ContactUs />);

    // Click the first FAQ question to expand it — this covers toggleFAQ
    // and the conditional rendering of the answer + the arrow icon flip
    const faqButton = screen.getByRole("button", {
      name: /What services does Saayam for All offer/i,
    });
    fireEvent.click(faqButton);

    expect(
      screen.getByText(
        "We offer a platform to connect volunteers with people who need help in areas like education, food, and healthcare.",
      ),
    ).toBeTruthy();

    // Click again to collapse (covers the setOpenFAQIndex(null) branch)
    fireEvent.click(faqButton);
  });

  it("displays the 24-48 hour response time note", () => {
    render(<ContactUs />);

    // Verify the response time note is visible on the page
    // This covers the rendering of the note section before the submit button
    expect(
      screen.getByText(
        "We typically respond to your inquiry within 24-48 hours.",
      ),
    ).toBeTruthy();

    // Verify the "Note:" label is also present
    expect(screen.getByText("Note:")).toBeTruthy();
  });
});
