import { screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import PromoteToVolunteer from "./PromoteToVolunteer";
import {
  MOCK_STATE_LOGGED_IN,
  renderWithProviders,
} from "#utils/test-utils.jsx";

let mockUseSearchParams = jest.fn(() => [new URLSearchParams(), jest.fn()]);

jest.mock("react-router-dom", () => ({
  useNavigate: jest.fn(),
  useSearchParams: () => mockUseSearchParams(),
  Link: ({ to, children }) => <a href={to}>{children}</a>,
}));

jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (text) => `mockTranslate(${text})`,
    i18n: { changeLanguage: jest.fn() },
  }),
  Trans: ({ children }) => <>{children}</>,
}));

jest.mock("aws-amplify/auth", () => ({
  getCurrentUser: jest.fn(() => Promise.resolve({ userId: "mockUser123" })),
}));

jest.mock("../../services/volunteerServices", () => ({
  getVolunteerSkills: jest.fn(() =>
    Promise.resolve({ message: "Mocked API Response" }),
  ),
}));

describe("PromoteToVolunteer Component", () => {
  it("renders Terms & Conditions on step 1", async () => {
    renderWithProviders(<PromoteToVolunteer />, {
      preloadedState: MOCK_STATE_LOGGED_IN,
    });

    expect(await screen.findByText("Terms & Conditions")).toBeInTheDocument();
  });

  it("renders Volunteer Course on step 2", async () => {
    renderWithProviders(<PromoteToVolunteer />, {
      preloadedState: MOCK_STATE_LOGGED_IN,
    });

    const nextButton = await screen.findByText(/mockTranslate\(common:NEXT\)/);
    fireEvent.click(nextButton);

    expect(await screen.findByText("Identification")).toBeInTheDocument();
  });

  it("renders Skills on step 3", async () => {
    renderWithProviders(<PromoteToVolunteer />, {
      preloadedState: MOCK_STATE_LOGGED_IN,
    });

    const nextButton = await screen.findByText(/mockTranslate\(common:NEXT\)/);
    fireEvent.click(nextButton);
    fireEvent.click(nextButton);

    expect(await screen.findByText(/skills/i)).toBeInTheDocument();
  });

  it("renders Availability on step 4", async () => {
    renderWithProviders(<PromoteToVolunteer />, {
      preloadedState: MOCK_STATE_LOGGED_IN,
    });

    const nextButton = await screen.findByText(/mockTranslate\(common:NEXT\)/);
    fireEvent.click(nextButton);
    fireEvent.click(nextButton);
    fireEvent.click(nextButton);

    expect(await screen.findByText("Availability")).toBeInTheDocument();
  });

  it("renders Review step label in stepper", async () => {
    renderWithProviders(<PromoteToVolunteer />, {
      preloadedState: MOCK_STATE_LOGGED_IN,
    });

    expect(await screen.findByText("Review")).toBeInTheDocument();
  });

  it("renders the Review step when userId and step are present in query params", async () => {
    mockUseSearchParams.mockReturnValueOnce([
      new URLSearchParams("userId=SID-00-000-000-123&step=5"),
      jest.fn(),
    ]);

    renderWithProviders(<PromoteToVolunteer />, {
      preloadedState: MOCK_STATE_LOGGED_IN,
    });

    expect(
      await screen.findByText(/mockTranslate\(IN_REVIEW\)/),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/mockTranslate\(REVIEW_STATUS_MESSAGE\)/),
    ).toBeInTheDocument();
  });
});
