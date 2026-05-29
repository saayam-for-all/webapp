import "@testing-library/jest-dom";
import { fireEvent, screen, act, waitFor } from "@testing-library/react";
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
let capturedOnClose = null;
jest.mock("../HelpRequest/HelpRequestForm", () => (props) => {
  capturedOnClose = props.onClose;
  return <div data-testid="help-request-form" />;
});
jest.mock("../../common/components/RequestButton/RequestButton", () => () => (
  <div data-testid="request-button" />
));
jest.mock("../../common/components/BreadCrumbs/breadcrumbUtils", () => ({
  createOrganizationsPageState: jest.fn(() => ({})),
}));

describe("RequestDetails - Tab Translation Tests", () => {
  it("renders action buttons in the orange area on Details tab", () => {
    renderWithProviders(<RequestDetails />, {
      preloadedState: MOCK_STATE_LOGGED_IN,
    });

    fireEvent.click(screen.getByText("DETAILS"));

    expect(
      screen.getByRole("button", { name: "Change Volunteer" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Delete" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "EDIT" })).toBeInTheDocument();
  });

  it("shows attachments pill only on Details tab", () => {
    renderWithProviders(<RequestDetails />, {
      preloadedState: MOCK_STATE_LOGGED_IN,
    });

    // Default tab is Comments
    expect(screen.queryByText("No files")).not.toBeInTheDocument();

    // Details tab shows the pill (empty-state)
    fireEvent.click(screen.getByText("DETAILS"));
    expect(screen.getByText("No files")).toBeInTheDocument();

    // Switching away hides it
    fireEvent.click(screen.getByText("VOLUNTEERS"));
    expect(screen.queryByText("No files")).not.toBeInTheDocument();
  });

  it("renders lead volunteer as clickable with LEAD_VOLUNTEER label", async () => {
    renderWithProviders(<RequestDetails />, {
      preloadedState: MOCK_STATE_LOGGED_IN,
    });

    expect(
      await screen.findByRole("button", { name: "Ethan Marshall" }),
    ).toBeInTheDocument();
    expect(screen.getByText("LEAD_VOLUNTEER")).toBeInTheDocument();
  });
});

describe("RequestDetails - Edit onClose refreshes data", () => {
  beforeEach(() => {
    capturedOnClose = null;
  });

  it("updates displayed subject after onClose receives updated data", async () => {
    renderWithProviders(<RequestDetails />, {
      preloadedState: MOCK_STATE_LOGGED_IN,
    });

    expect(screen.getByText("Test Request")).toBeInTheDocument();

    fireEvent.click(screen.getByText("DETAILS"));
    fireEvent.click(screen.getByRole("button", { name: "EDIT" }));

    expect(screen.getByTestId("help-request-form")).toBeInTheDocument();
    expect(capturedOnClose).toBeTruthy();

    await act(async () => {
      capturedOnClose({
        requestSubject: "Updated Subject",
        requestDescription: "Updated description",
        requestPriority: { priority: "HIGH" },
        requestType: { type: "IN_PERSON" },
      });
    });

    await waitFor(() => {
      expect(screen.getByText("Updated Subject")).toBeInTheDocument();
    });
  });

  it("closes edit modal without updating data when onClose is called with no data", async () => {
    renderWithProviders(<RequestDetails />, {
      preloadedState: MOCK_STATE_LOGGED_IN,
    });

    fireEvent.click(screen.getByText("DETAILS"));
    fireEvent.click(screen.getByRole("button", { name: "EDIT" }));

    expect(screen.getByTestId("help-request-form")).toBeInTheDocument();

    await act(async () => {
      capturedOnClose(undefined);
    });

    expect(screen.getByText("Test Request")).toBeInTheDocument();
    expect(screen.queryByTestId("help-request-form")).not.toBeInTheDocument();
  });
});
