import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import SignUp from "./Signup";

jest.mock("aws-amplify/auth", () => ({ signUp: jest.fn() }));

jest.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key) => key }),
}));

jest.mock("react-router-dom", () => ({
  useNavigate: () => jest.fn(),
}));

jest.mock("react-select-country-list", () =>
  jest.fn(() => ({
    getData: () => [
      { value: "US", label: "United States" },
      { value: "AR", label: "Argentina" },
      { value: "CA", label: "Canada" },
    ],
  })),
);

jest.mock("react-phone-number-input", () => ({
  isValidPhoneNumber: jest.fn(() => true),
}));

jest.mock("../../common/components/PhoneNumberInputWithCountry", () => {
  const React = require("react");
  return function PhoneInputMock(props) {
    React.useLayoutEffect(() => {
      props.setCountryCode?.("US");
      props.setPhone?.("2345678901");
      props.setError?.("");
    }, []);
    return <div data-testid="phone-input-mock" />;
  };
});

jest.mock("../../utils/phone-codes-en", () => ({
  US: { primary: "United States", secondary: "+1", dialCode: "+1" },
}));

describe("SignUp", () => {
  it("renders the country dropdown with ISO Alpha-2 options", () => {
    render(<SignUp />);
    const select = screen.getByRole("combobox", { name: /country/i });
    expect(select).toBeInTheDocument();
    expect(
      screen.getByRole("option", { name: "United States" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("option", { name: "Argentina" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Canada" })).toBeInTheDocument();
  });

  it("defaults country selection to US", () => {
    render(<SignUp />);
    const select = screen.getByRole("combobox", { name: /country/i });
    expect(select.value).toBe("US");
  });

  it("updates country when a different option is selected", () => {
    render(<SignUp />);
    const select = screen.getByRole("combobox", { name: /country/i });
    fireEvent.change(select, { target: { value: "AR" } });
    expect(select.value).toBe("AR");
  });
});
