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
jest.mock("../../common/components/PhoneNumberInputWithCountry", () => {
  const PropTypes = jest.requireActual("prop-types");

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
  }

  PhoneNumberInputWithCountryMock.propTypes = {
    phone: PropTypes.string.isRequired,
    setPhone: PropTypes.func.isRequired,
    error: PropTypes.string,
  };

  return PhoneNumberInputWithCountryMock;
});

jest.mock("#components/Ads/HorizontalAd", () => {
  function HorizontalAdMock() {
    return <div data-testid="horizontal-ad-mock" />;
  }

  return HorizontalAdMock;
});

jest.mock("react-phone-number-input", () => ({
  isValidPhoneNumber: jest.fn(),
}));

// Silence jsdom "window.scrollTo is not implemented" warning
beforeAll(() => {
  window.scrollTo = jest.fn();
});

const mockNavigate = jest.fn();
const mockExecuteRecaptcha = jest.fn();

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

const fillValidForm = () => {
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
    target: { name: "message", value: "  Need support  " },
  });
  fireEvent.change(screen.getByLabelText("Phone Number"), {
    target: { value: "2025550125" },
  });

  fireEvent.mouseDown(screen.getByRole("combobox"));
  const listbox = screen.getByRole("listbox");
  fireEvent.click(within(listbox).getByText("GENERAL_INQUIRY"));
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

  it("does not clip the responsive horizontal ad", () => {
    render(<ContactUs />);

    expect(
      screen
        .getByTestId("horizontal-ad-mock")
        .parentElement.classList.contains("overflow-hidden"),
    ).toBe(false);
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

  it("rejects a whitespace-only message", () => {
    render(<ContactUs />);

    fireEvent.change(screen.getByLabelText(/Message/i), {
      target: { name: "message", value: "   " },
    });
    submitForm();

    expect(screen.getByText("Message is required")).toBeTruthy();
    expect(sendContactEmail).not.toHaveBeenCalled();
  });

  it("allows selecting a reason from the dropdown", () => {
    render(<ContactUs />);

    // Open the MUI Select dropdown
    const selectTrigger = screen.getByRole("combobox");
    fireEvent.mouseDown(selectTrigger);

    // Choose a reason — this triggers handleChange, sets formData.reason,
    // and in turn:
    //   - renders t(selected) in renderValue

    const listbox = screen.getByRole("listbox");
    const option = within(listbox).getByText("DONATION_GRANT");
    fireEvent.click(option);
    expect(screen.getAllByText("DONATION_GRANT").length).toBeGreaterThan(0);

    // After selection the text may appear in both the trigger and (briefly)
    // the listbox — use getAllByText and just confirm at least one exists
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

  it("preserves the Lambda payload contract and navigates to thanks page", async () => {
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
    expect(sendContactEmail.mock.calls[0][0]).not.toHaveProperty(
      "recaptcha_token",
    );
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
          "Failed to submit form. Please try again or contact us directly at hr@saayamforall.org",
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
    expect(screen.getByText("RESPONSE_TIME_NOTICE")).toBeTruthy();

    // Verify the "Note:" label is also present
    expect(screen.getByText("NOTE_LABEL")).toBeTruthy();
  });

  it("submits Donation/Grant as the selected contact reason", async () => {
    mockExecuteRecaptcha.mockResolvedValue("captcha-token");
    sendContactEmail.mockResolvedValue({ ok: true });

    render(<ContactUs />);

    fireEvent.change(screen.getByLabelText(/First Name/i), {
      target: { name: "firstName", value: "John" },
    });
    fireEvent.change(screen.getByLabelText(/Last Name/i), {
      target: { name: "lastName", value: "Doe" },
    });
    fireEvent.change(screen.getByLabelText(/Email/i), {
      target: { name: "email", value: "john@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/Message/i), {
      target: { name: "message", value: "I would like to make a donation" },
    });
    fireEvent.change(screen.getByLabelText("Phone Number"), {
      target: { value: "2025550125" },
    });

    fireEvent.mouseDown(screen.getByRole("combobox"));
    const listbox = screen.getByRole("listbox");
    fireEvent.click(within(listbox).getByText("DONATION_GRANT"));

    submitForm();

    await waitFor(() => {
      expect(sendContactEmail).toHaveBeenCalledTimes(1);
    });

    expect(sendContactEmail).toHaveBeenCalledWith(
      expect.objectContaining({
        reason: "Donation",
      }),
    );

    expect(mockNavigate).toHaveBeenCalledWith("/thanks");
  });
});
