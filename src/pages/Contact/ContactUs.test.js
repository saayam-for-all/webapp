import {
  render,
  screen,
  fireEvent,
  within,
  waitFor,
} from "@testing-library/react";
import ContactUs from "./ContactUs";
import { useNavigate } from "react-router-dom";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { isValidPhoneNumber } from "react-phone-number-input";
import { sendContactEmail } from "../../services/contactServices";

// Mock i18n so t() just returns the key
jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key) => key,
  }),
}));

jest.mock("react-router-dom", () => ({
  useNavigate: jest.fn(),
}));

jest.mock("react-google-recaptcha-v3", () => ({
  useGoogleReCaptcha: jest.fn(),
}));

jest.mock("../../services/contactServices", () => ({
  sendContactEmail: jest.fn(),
}));

jest.mock("../../utils/phone-codes-en", () => ({
  US: { secondary: "+1" },
}));

// Mock child components that have heavy dependencies
jest.mock(
  "../../common/components/PhoneNumberInputWithCountry",
  () =>
    function PhoneNumberInputWithCountryMock({ phone, setPhone, error }) {
      return (
        <div>
          <input
            aria-label="Phone Number"
            data-testid="phone-input-mock"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          {error ? <p>{error}</p> : null}
        </div>
      );
    },
);

jest.mock("#components/Ads/HorizontalAd", () => () => (
  <div data-testid="horizontal-ad-mock" />
));

jest.mock("react-phone-number-input", () => ({
  isValidPhoneNumber: jest.fn(),
}));

// Silence jsdom "window.scrollTo is not implemented" warning
beforeAll(() => {
  window.scrollTo = jest.fn();
});

const mockNavigate = jest.fn();
const mockExecuteRecaptcha = jest.fn();

// Every dropdown option and the Lambda RECIPIENT_MAP key it must send.
// Keep in sync with CONTACT_REASONS in ContactUs.jsx and the deployed
// contactUsHandler Lambda.
const EXPECTED_REASONS = [
  { translationKey: "VOLUNTEERING_INTERNSHIP", apiValue: "Volunteer" },
  { translationKey: "TIMESHEET_ISSUES", apiValue: "Timesheet" },
  { translationKey: "OFFER_RELIEVING_LETTER", apiValue: "Letters" },
  { translationKey: "COLLABORATION_PARTNERSHIP", apiValue: "Collaboration" },
  { translationKey: "GENERAL_INQUIRY", apiValue: "General" },
  { translationKey: "DONATION_GRANT", apiValue: "Donation" },
];

beforeEach(() => {
  jest.clearAllMocks();
  useNavigate.mockReturnValue(mockNavigate);
  useGoogleReCaptcha.mockReturnValue({
    executeRecaptcha: mockExecuteRecaptcha,
  });
  isValidPhoneNumber.mockReturnValue(true);
});

// Helper to submit the form — using fireEvent.submit directly on the form
// bypasses the browser's native HTML5 required-field validation, which
// otherwise blocks handleSubmit from ever running.
const submitForm = () => {
  const form = document.querySelector("form");
  fireEvent.submit(form);
};

const selectReason = (translationKey) => {
  fireEvent.mouseDown(screen.getByRole("combobox"));
  const listbox = screen.getByRole("listbox");
  fireEvent.click(within(listbox).getByText(translationKey));
};

const fillValidForm = (reasonKey = "GENERAL_INQUIRY") => {
  fireEvent.change(screen.getByLabelText(/First Name/i), {
    target: { name: "firstName", value: "  John  " },
  });
  fireEvent.change(screen.getByLabelText(/Last Name/i), {
    target: { name: "lastName", value: "  Doe  " },
  });
  fireEvent.change(screen.getByLabelText(/Email/i), {
    target: { name: "email", value: "  john@example.com  " },
  });
  fireEvent.change(screen.getByLabelText(/Message/i), {
    target: { name: "message", value: "Need support" },
  });
  fireEvent.change(screen.getByLabelText("Phone Number"), {
    target: { value: "2025550125" },
  });

  selectReason(reasonKey);
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

  it("renders all six contact reasons in the dropdown", () => {
    render(<ContactUs />);

    fireEvent.mouseDown(screen.getByRole("combobox"));
    const listbox = screen.getByRole("listbox");

    EXPECTED_REASONS.forEach(({ translationKey }) => {
      expect(within(listbox).getByText(translationKey)).toBeTruthy();
    });
  });

  it.each(EXPECTED_REASONS)(
    "sends apiValue '$apiValue' when '$translationKey' is selected",
    async ({ translationKey, apiValue }) => {
      mockExecuteRecaptcha.mockResolvedValue("captcha-token");
      sendContactEmail.mockResolvedValue({ ok: true });
      render(<ContactUs />);

      fillValidForm(translationKey);
      submitForm();

      await waitFor(() => {
        expect(sendContactEmail).toHaveBeenCalledTimes(1);
      });

      expect(sendContactEmail).toHaveBeenCalledWith(
        expect.objectContaining({ reason: apiValue }),
      );
    },
  );

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
    expect(screen.getByText("Phone is required")).toBeTruthy();
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

  it("caps name and message inputs at the Lambda's limits", () => {
    render(<ContactUs />);

    expect(screen.getByLabelText(/First Name/i).maxLength).toBe(100);
    expect(screen.getByLabelText(/Last Name/i).maxLength).toBe(100);
    expect(screen.getByLabelText(/Message/i).maxLength).toBe(2000);
  });

  it("allows selecting a reason from the dropdown", () => {
    render(<ContactUs />);

    selectReason("GENERAL_INQUIRY");

    // After selection the text may appear in both the trigger and (briefly)
    // the listbox — use getAllByText and just confirm at least one exists
    expect(screen.getAllByText("GENERAL_INQUIRY").length).toBeGreaterThan(0);
  });

  it("shows invalid phone format error when number validation fails", () => {
    isValidPhoneNumber.mockReturnValue(false);
    render(<ContactUs />);

    fillValidForm();
    submitForm();

    expect(screen.getByText("Please enter a valid phone number")).toBeTruthy();
    expect(sendContactEmail).not.toHaveBeenCalled();
  });

  it("shows recaptcha readiness error when recaptcha function is unavailable", async () => {
    useGoogleReCaptcha.mockReturnValue({ executeRecaptcha: undefined });
    render(<ContactUs />);

    fillValidForm();
    submitForm();

    await waitFor(() => {
      expect(
        screen.getByText(
          "reCAPTCHA not ready. Please refresh the page and try again.",
        ),
      ).toBeTruthy();
    });

    expect(sendContactEmail).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it("submits successfully and navigates to thanks page", async () => {
    mockExecuteRecaptcha.mockResolvedValue("captcha-token");
    sendContactEmail.mockResolvedValue({ ok: true });
    render(<ContactUs />);

    fillValidForm();
    submitForm();

    await waitFor(() => {
      expect(sendContactEmail).toHaveBeenCalledTimes(1);
    });

    expect(mockExecuteRecaptcha).toHaveBeenCalledWith("contact_form_submit");
    expect(sendContactEmail).toHaveBeenCalledWith({
      firstName: "John",
      lastName: "Doe",
      middleName: "",
      email: "john@example.com",
      phone: "+12025550125",
      reason: "General",
      message: "Need support",
      recaptchaToken: "captcha-token",
    });
    expect(mockNavigate).toHaveBeenCalledWith("/thanks");
  });

  it("shows submit error when API call fails", async () => {
    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    mockExecuteRecaptcha.mockResolvedValue("captcha-token");
    sendContactEmail.mockRejectedValue(new Error("network down"));
    render(<ContactUs />);

    fillValidForm();
    submitForm();

    await waitFor(() => {
      expect(
        screen.getByText(
          "Failed to submit form. Please try again or contact us directly at info@saayamforall.org",
        ),
      ).toBeTruthy();
    });

    expect(mockNavigate).not.toHaveBeenCalled();
    consoleErrorSpy.mockRestore();
  });

  it("shows loading spinner while submission is in progress", async () => {
    let resolveRequest;
    mockExecuteRecaptcha.mockResolvedValue("captcha-token");
    sendContactEmail.mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveRequest = resolve;
        }),
    );

    render(<ContactUs />);
    fillValidForm();
    submitForm();

    await waitFor(() => {
      expect(screen.getByRole("progressbar")).toBeTruthy();
    });

    resolveRequest({ ok: true });

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/thanks");
    });
  });

  it("toggles FAQ items when clicked", () => {
    render(<ContactUs />);

    // Click the first FAQ question to expand it — this covers FaqAccordion's
    // toggle and the conditional rendering of the answer + arrow icon flip
    const faqButton = screen.getByRole("button", {
      name: /What services does Saayam for All offer/i,
    });
    fireEvent.click(faqButton);

    expect(
      screen.getByText(
        "We offer a platform to connect volunteers with people who need help in areas like education, food, and healthcare.",
      ),
    ).toBeTruthy();
    expect(faqButton.getAttribute("aria-expanded")).toBe("true");

    // Click again to collapse (covers the setOpenIndex(null) branch)
    fireEvent.click(faqButton);
    expect(faqButton.getAttribute("aria-expanded")).toBe("false");
  });

  it("displays the 24-48 hour response time note", () => {
    render(<ContactUs />);

    // Verify the response time note is visible on the page
    expect(screen.getByText("RESPONSE_TIME_NOTICE")).toBeTruthy();

    // Verify the "Note:" label is also present
    expect(screen.getByText("NOTE_LABEL")).toBeTruthy();
  });
});
