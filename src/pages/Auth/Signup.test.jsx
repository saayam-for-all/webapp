import "@testing-library/jest-dom";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { signUp } from "aws-amplify/auth";
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
  beforeEach(() => {
    jest.clearAllMocks();
  });

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

  const fillValidForm = () => {
    fireEvent.change(screen.getByLabelText("FIRST_NAME"), {
      target: { value: "Jane" },
    });
    fireEvent.change(screen.getByLabelText("LAST_NAME"), {
      target: { value: "Doe" },
    });
    fireEvent.change(screen.getByLabelText("EMAIL"), {
      target: { value: "jane.doe@example.com" },
    });
    fireEvent.change(screen.getByLabelText("PASSWORD"), {
      target: { value: "Passw0rd!" },
    });
    fireEvent.change(screen.getByLabelText("CONFIRM_PASSWORD"), {
      target: { value: "Passw0rd!" },
    });
    fireEvent.click(screen.getByRole("checkbox"));
  };

  it("disables the button and shows a loading state while sign up is in progress", async () => {
    let resolveSignUp;
    signUp.mockReturnValue(
      new Promise((resolve) => {
        resolveSignUp = resolve;
      }),
    );

    render(<SignUp />);
    fillValidForm();

    const button = screen.getByRole("button", { name: "Sign up" });
    fireEvent.click(button);

    const submittingButton = await screen.findByRole("button", {
      name: /Signing up.../,
    });
    expect(submittingButton).toBeDisabled();

    resolveSignUp({ isSignUpComplete: false });

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: "Sign up" }),
      ).not.toBeDisabled();
    });
  });

  it("does not trigger a second sign up call while one is already in progress", async () => {
    let resolveSignUp;
    signUp.mockReturnValue(
      new Promise((resolve) => {
        resolveSignUp = resolve;
      }),
    );

    render(<SignUp />);
    fillValidForm();

    const button = screen.getByRole("button", { name: "Sign up" });
    fireEvent.click(button);
    await screen.findByRole("button", { name: /Signing up.../ });

    fireEvent.click(screen.getByRole("button", { name: /Signing up.../ }));

    expect(signUp).toHaveBeenCalledTimes(1);

    resolveSignUp({ isSignUpComplete: false });
    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: "Sign up" }),
      ).not.toBeDisabled();
    });
  });

  it("re-enables the button after a failed sign up", async () => {
    signUp.mockRejectedValue(new Error("network error"));

    render(<SignUp />);
    fillValidForm();

    fireEvent.click(screen.getByRole("button", { name: "Sign up" }));

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: "Sign up" }),
      ).not.toBeDisabled();
    });
  });
});
