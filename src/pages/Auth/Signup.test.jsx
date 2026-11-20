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

const mockPhoneInputProps = {};

jest.mock("../../common/components/PhoneNumberInputWithCountry", () => {
  const React = require("react");
  return function PhoneInputMock(props) {
    Object.assign(mockPhoneInputProps, props);
    React.useLayoutEffect(() => {
      mockPhoneInputProps.setCountryCode?.("US");
      mockPhoneInputProps.setPhone?.("2345678901");
      mockPhoneInputProps.setError?.("");
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

  it("identifies signup fields correctly to browser auto-fill", () => {
    render(<SignUp />);

    expect(screen.getByLabelText("EMAIL")).toHaveAttribute(
      "autocomplete",
      "username",
    );
    expect(mockPhoneInputProps.name).toBe("phone");
    expect(mockPhoneInputProps.autoComplete).toBe("tel-national");
    expect(screen.getByLabelText("PASSWORD")).toHaveAttribute(
      "autocomplete",
      "new-password",
    );
    expect(screen.getByLabelText("CONFIRM_PASSWORD")).toHaveAttribute(
      "autocomplete",
      "new-password",
    );
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

  it("keeps the Sign up button disabled when email is empty (#1859)", () => {
    render(<SignUp />);

    fireEvent.change(screen.getByLabelText("FIRST_NAME"), {
      target: { value: "Jane" },
    });
    fireEvent.change(screen.getByLabelText("LAST_NAME"), {
      target: { value: "Doe" },
    });
    fireEvent.change(screen.getByLabelText("PASSWORD"), {
      target: { value: "Passw0rd!" },
    });
    fireEvent.change(screen.getByLabelText("CONFIRM_PASSWORD"), {
      target: { value: "Passw0rd!" },
    });
    fireEvent.click(screen.getByRole("checkbox"));

    const button = screen.getByRole("button", { name: "Sign up" });
    expect(button).toBeDisabled();
  });

  it("renders the social media accounts text in bold", () => {
    render(<SignUp />);

    const boldText = screen.getByText(
      (_, element) =>
        element?.tagName === "STRONG" &&
        element?.textContent === "SOCIAL_MEDIA_ACCOUNTS",
    );

    expect(boldText).toBeInTheDocument();
  });

  it("renders the mandatory fields and login text in the same paragraph", () => {
    render(<SignUp />);

    const paragraph = screen.getByText(
      (_, element) =>
        element?.tagName === "P" &&
        element?.textContent?.includes("ALL_FIELDS_MANDATORY") &&
        element?.textContent?.includes("ALREADY_HAVE_ACCOUNT"),
    );

    expect(paragraph).toBeInTheDocument();
  });

  it("navigates to /login when the social media accounts link is clicked", () => {
    const mockNavigate = jest.fn();
    jest
      .spyOn(require("react-router-dom"), "useNavigate")
      .mockReturnValue(mockNavigate);

    render(<SignUp />);

    const socialMediaLink = screen.getByRole("button", {
      name: /SOCIAL_MEDIA_ACCOUNTS/,
    });

    expect(socialMediaLink).toBeInTheDocument();
    expect(socialMediaLink).toHaveAttribute("type", "button");
    expect(socialMediaLink.querySelector("strong")).toHaveTextContent(
      "SOCIAL_MEDIA_ACCOUNTS",
    );

    fireEvent.click(socialMediaLink);

    expect(mockNavigate).toHaveBeenCalledWith("/login");
  });

  it("renders the Log In button that navigates to /login", () => {
    const mockNavigate = jest.fn();
    jest
      .spyOn(require("react-router-dom"), "useNavigate")
      .mockReturnValue(mockNavigate);

    render(<SignUp />);
    const loginButton = screen.getByRole("button", { name: "LOGIN" });
    expect(loginButton).toBeInTheDocument();
    fireEvent.click(loginButton);
    expect(mockNavigate).toHaveBeenCalledWith("/login");
  });

  describe("duplicate account errors", () => {
    const fillAndSubmit = () => {
      fireEvent.change(screen.getByLabelText("FIRST_NAME"), {
        target: { value: "Jane" },
      });
      fireEvent.change(screen.getByLabelText("LAST_NAME"), {
        target: { value: "Doe" },
      });
      fireEvent.change(screen.getByLabelText("EMAIL"), {
        target: { value: "jane@example.com" },
      });
      fireEvent.change(screen.getByLabelText("PASSWORD"), {
        target: { value: "Passw0rd!" },
      });
      fireEvent.change(screen.getByLabelText("CONFIRM_PASSWORD"), {
        target: { value: "Passw0rd!" },
      });
      fireEvent.click(screen.getByRole("checkbox"));
      fireEvent.click(screen.getByRole("button", { name: "Sign up" }));
    };

    beforeEach(() => {
      signUp.mockReset();
      jest.spyOn(console, "log").mockImplementation(() => {});
    });

    afterEach(() => {
      console.log.mockRestore();
    });

    it.each([
      [
        "SIGNUP_FAILED_SOCIAL_EXISTS",
        "auth:signup.social_exists",
        "PreSignUp failed with error SIGNUP_FAILED_SOCIAL_EXISTS.",
      ],
      [
        "SIGNUP_FAILED_NATIVE_EXISTS",
        "auth:signup.native_exists",
        "PreSignUp failed with error SIGNUP_FAILED_NATIVE_EXISTS.",
      ],
    ])("shows a message for %s", async (_code, expectedKey, message) => {
      signUp.mockRejectedValue(
        Object.assign(new Error(message), {
          name: "UserLambdaValidationException",
        }),
      );
      render(<SignUp />);
      fillAndSubmit();
      expect(await screen.findByText(expectedKey)).toBeInTheDocument();
    });

    it("keeps the existing message for UsernameExistsException", async () => {
      signUp.mockRejectedValue(
        Object.assign(new Error("exists"), { name: "UsernameExistsException" }),
      );
      render(<SignUp />);
      fillAndSubmit();
      expect(
        await screen.findByText("USER_ALREADY_EXISTS"),
      ).toBeInTheDocument();
    });

    it.each([
      ["a NetworkError by name", { name: "NetworkError", message: "boom" }],
      ["a network error by message", { message: "Network error" }],
    ])("shows the network error message for %s", async (_label, error) => {
      signUp.mockRejectedValue(error);
      render(<SignUp />);
      fillAndSubmit();
      expect(
        await screen.findByText("auth:shared.network_error"),
      ).toBeInTheDocument();
    });

    it("shows the server error message when the error has no name or message", async () => {
      signUp.mockRejectedValue({});
      render(<SignUp />);
      fillAndSubmit();
      expect(
        await screen.findByText("auth:shared.server_error"),
      ).toBeInTheDocument();
    });

    it("shows a generic error for unexpected failures", async () => {
      signUp.mockRejectedValue(
        Object.assign(new Error("boom"), { name: "InternalErrorException" }),
      );
      render(<SignUp />);
      fillAndSubmit();
      await waitFor(() =>
        expect(
          screen.getByText("auth:shared.server_error"),
        ).toBeInTheDocument(),
      );
    });
  });
});
