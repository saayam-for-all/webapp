import { fireEvent, render, screen } from "@testing-library/react";
import { parsePhoneNumberFromString } from "libphonenumber-js/max";
import PhoneNumberInputWithCountry from "./PhoneNumberInputWithCountry";

jest.mock("libphonenumber-js/max", () => ({
  parsePhoneNumberFromString: jest.fn(),
}));

jest.mock("../../utils/phone-codes-en", () => ({
  US: { primary: "United States", secondary: "+1" },
  CA: { primary: "Canada", secondary: "+1" },
}));

const translate = (key) => key;

describe("PhoneNumberInputWithCountry", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("exposes accessible names and associates the phone error", () => {
    render(
      <PhoneNumberInputWithCountry
        phone="123"
        setPhone={jest.fn()}
        countryCode="US"
        setCountryCode={jest.fn()}
        error="Please enter a valid phone number"
        setError={jest.fn()}
        hideLabel
        required
        t={translate}
        name="phone"
        autoComplete="tel-national"
        type="tel"
        inputMode="tel"
        countryCodeName="countryCode"
      />,
    );

    expect(screen.getByRole("combobox", { name: "COUNTRY" })).toBeTruthy();

    const phoneInput = screen.getByRole("textbox", {
      name: "YOUR_PHONE_NUMBER",
    });
    const error = screen.getByRole("alert");

    expect(phoneInput.type).toBe("tel");
    expect(phoneInput.inputMode).toBe("tel");
    expect(phoneInput.autocomplete).toBe("tel-national");
    expect(phoneInput.getAttribute("aria-invalid")).toBe("true");
    expect(phoneInput.getAttribute("aria-describedby")).toBe(error.id);
  });

  it("preserves the default input behavior for existing consumers", () => {
    render(
      <PhoneNumberInputWithCountry
        phone=""
        setPhone={jest.fn()}
        countryCode="US"
        setCountryCode={jest.fn()}
        setError={jest.fn()}
        t={translate}
      />,
    );

    const phoneInput = screen.getByLabelText("Phone Number");

    expect(phoneInput.type).toBe("text");
    expect(phoneInput.inputMode).toBe("");
    expect(phoneInput.getAttribute("name")).toBeNull();
    expect(phoneInput.getAttribute("autocomplete")).toBeNull();
  });

  it("clears the error after a valid phone number is entered", () => {
    const setPhone = jest.fn();
    const setError = jest.fn();
    parsePhoneNumberFromString.mockReturnValue({
      isPossible: () => true,
      isValid: () => true,
    });

    render(
      <PhoneNumberInputWithCountry
        phone=""
        setPhone={setPhone}
        countryCode="US"
        setCountryCode={jest.fn()}
        setError={setError}
        t={translate}
      />,
    );

    fireEvent.change(screen.getByLabelText("Phone Number"), {
      target: { value: "2025550125" },
    });

    expect(setPhone).toHaveBeenCalledWith("2025550125");
    expect(parsePhoneNumberFromString).toHaveBeenCalledWith("+12025550125");
    expect(setError).toHaveBeenCalledWith(undefined);
  });

  it("ignores non-numeric input without changing consumer state", () => {
    const setPhone = jest.fn();
    const setError = jest.fn();

    render(
      <PhoneNumberInputWithCountry
        phone=""
        setPhone={setPhone}
        countryCode="US"
        setCountryCode={jest.fn()}
        setError={setError}
        t={translate}
      />,
    );

    fireEvent.change(screen.getByLabelText("Phone Number"), {
      target: { value: "202-abc" },
    });

    expect(setPhone).not.toHaveBeenCalled();
    expect(setError).not.toHaveBeenCalled();
  });

  it("keeps required-field validation behavior on blur", () => {
    const setError = jest.fn();

    render(
      <PhoneNumberInputWithCountry
        phone=""
        setPhone={jest.fn()}
        countryCode="US"
        setCountryCode={jest.fn()}
        setError={setError}
        required
        t={translate}
      />,
    );

    fireEvent.blur(screen.getByLabelText("Phone Number"));

    expect(setError).toHaveBeenCalledWith("Phone number is required");
  });

  it("preserves country selection callbacks and clears stale errors", () => {
    const setCountryCode = jest.fn();
    const setError = jest.fn();

    render(
      <PhoneNumberInputWithCountry
        phone="2025550125"
        setPhone={jest.fn()}
        countryCode="US"
        setCountryCode={setCountryCode}
        error="Please enter a valid phone number"
        setError={setError}
        t={translate}
      />,
    );

    fireEvent.change(screen.getByRole("combobox", { name: "COUNTRY" }), {
      target: { value: "CA" },
    });

    expect(setCountryCode).toHaveBeenCalledWith("CA");
    expect(setError).toHaveBeenCalledWith(undefined);
  });
});
