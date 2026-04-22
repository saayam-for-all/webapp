import "@testing-library/jest-dom";
import { fireEvent, screen } from "@testing-library/react";
import { renderWithProviders, MOCK_STATE_LOGGED_IN } from "#utils/test-utils";
import RequestDetails from "./RequestDetails";

jest.mock("react-router-dom", () => ({
  useLocation: () => ({ state: { id: "123", subject: "Test Request" } }),
  useNavigate: () => jest.fn(),
  useParams: () => ({ id: "123" }),
}));

jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key) => key,
    i18n: { changeLanguage: jest.fn() },
  }),
}));

jest.mock("../../services/requestServices", () => ({
  getMyRequests: jest.fn(() => Promise.resolve({ body: [] })),
  getComments: jest.fn(() => Promise.resolve({ body: [] })),
}));

jest.mock("./CommentsSection", () => () => (
  <div data-testid="comments-section" />
));
jest.mock("./HelpingVolunteers", () => () => (
  <div data-testid="helping-volunteers" />
));
jest.mock("./RequestDescription", () => () => (
  <div data-testid="request-description" />
));
jest.mock("../EmergencyContact/EmergencyContact", () => () => (
  <div data-testid="emergency-contact" />
));
jest.mock("../HelpRequest/HelpRequestForm", () => () => (
  <div data-testid="help-request-form" />
));
jest.mock("../../common/components/RequestButton/RequestButton", () => () => (
  <div data-testid="request-button" />
));
jest.mock("../../common/components/BreadCrumbs/breadcrumbUtils", () => ({
  createOrganizationsPageState: jest.fn(() => ({})),
}));

describe("RequestDetails - Tab Translation Tests", () => {
  it("renders all three tabs with translation keys", () => {
    renderWithProviders(<RequestDetails />, {
      preloadedState: MOCK_STATE_LOGGED_IN,
    });

    expect(screen.getByText("COMMENTS")).toBeInTheDocument();
    expect(screen.getByText("VOLUNTEERS")).toBeInTheDocument();
    expect(screen.getByText("DETAILS")).toBeInTheDocument();
  });

  it("switches to Volunteers tab when clicked", () => {
    renderWithProviders(<RequestDetails />, {
      preloadedState: MOCK_STATE_LOGGED_IN,
    });

    fireEvent.click(screen.getByText("VOLUNTEERS"));
    expect(screen.getByTestId("helping-volunteers")).toBeInTheDocument();
  });

  it("switches to Details tab when clicked", () => {
    renderWithProviders(<RequestDetails />, {
      preloadedState: MOCK_STATE_LOGGED_IN,
    });

    fireEvent.click(screen.getByText("DETAILS"));
    expect(screen.getByTestId("request-description")).toBeInTheDocument();
  });
});
