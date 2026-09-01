import "@testing-library/jest-dom";
import { fireEvent, screen, act, waitFor } from "@testing-library/react";
import { renderWithProviders, MOCK_STATE_LOGGED_IN } from "#utils/test-utils";
import RequestDetails from "./RequestDetails";

let mockLocationState = { id: "123", subject: "Test Request" };

jest.mock("react-router-dom", () => ({
  useLocation: () => ({ state: mockLocationState }),
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
  beforeEach(() => {
    mockLocationState = { id: "123", subject: "Test Request" };
  });

  it("renders action buttons in the orange area on Details tab", () => {
    renderWithProviders(<RequestDetails />, {
      preloadedState: MOCK_STATE_LOGGED_IN,
    });

    fireEvent.click(screen.getByText("DETAILS"));

    expect(
      screen.getByRole("button", { name: "CHANGE_VOLUNTEER" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "DELETE" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "EDIT" })).toBeInTheDocument();
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

  it("shows actual beneficiary and creator names for beneficiary My Requests", () => {
    mockLocationState = {
      id: "123",
      subject: "Test Request",
      sourceTab: "myRequests",
      reqFname: "Ben",
      reqLname: "Person",
    };

    renderWithProviders(<RequestDetails />, {
      preloadedState: {
        auth: {
          user: {
            userDbId: "SID-123",
            given_name: "Chris",
            family_name: "Creator",
          },
        },
      },
    });

    expect(
      screen.getByRole("button", { name: "Ben Person" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Chris Creator" }),
    ).toBeInTheDocument();
  });
});

describe("RequestDetails - Edit onClose refreshes data", () => {
  beforeEach(() => {
    capturedOnClose = null;
    mockLocationState = { id: "123", subject: "Test Request" };
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

describe("RequestDetails - Delete dialog button order and behavior", () => {
  beforeEach(() => {
    mockLocationState = { id: "123", subject: "Test Request" };
  });

  it("opens the delete dialog and shows Delete before Cancel", () => {
    renderWithProviders(<RequestDetails />, {
      preloadedState: MOCK_STATE_LOGGED_IN,
    });

    fireEvent.click(screen.getByText("DETAILS"));
    fireEvent.click(screen.getByRole("button", { name: "DELETE" }));

    const deleteActionButton = screen.getByRole("button", {
      name: "DELETE_ACTION",
    });
    const cancelButton = screen.getByRole("button", { name: "CANCEL" });

    expect(deleteActionButton).toBeInTheDocument();
    expect(cancelButton).toBeInTheDocument();
    expect(
      deleteActionButton.compareDocumentPosition(cancelButton) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
  });

  it("disables Delete until a reason is entered, then enables it", () => {
    renderWithProviders(<RequestDetails />, {
      preloadedState: MOCK_STATE_LOGGED_IN,
    });

    fireEvent.click(screen.getByText("DETAILS"));
    fireEvent.click(screen.getByRole("button", { name: "DELETE" }));

    const deleteActionButton = screen.getByRole("button", {
      name: "DELETE_ACTION",
    });
    expect(deleteActionButton).toBeDisabled();

    fireEvent.change(screen.getByPlaceholderText("REASON"), {
      target: { value: "No longer needed" },
    });

    expect(deleteActionButton).not.toBeDisabled();
  });

  it("Cancel closes the delete dialog", async () => {
    renderWithProviders(<RequestDetails />, {
      preloadedState: MOCK_STATE_LOGGED_IN,
    });

    fireEvent.click(screen.getByText("DETAILS"));
    fireEvent.click(screen.getByRole("button", { name: "DELETE" }));

    expect(
      screen.getByRole("button", { name: "DELETE_ACTION" }),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "CANCEL" }));

    await waitFor(() => {
      expect(
        screen.queryByRole("button", { name: "DELETE_ACTION" }),
      ).not.toBeInTheDocument();
    });
  });
});

describe("RequestDetails - Change Volunteer dialog button order and behavior", () => {
  beforeEach(() => {
    mockLocationState = { id: "123", subject: "Test Request" };
  });

  it("opens the change volunteer dialog and shows Save before Cancel", () => {
    renderWithProviders(<RequestDetails />, {
      preloadedState: MOCK_STATE_LOGGED_IN,
    });

    fireEvent.click(screen.getByText("DETAILS"));
    fireEvent.click(screen.getByRole("button", { name: "CHANGE_VOLUNTEER" }));

    const saveButton = screen.getByRole("button", { name: "SAVE" });
    const cancelButton = screen.getByRole("button", { name: "CANCEL" });

    expect(saveButton).toBeInTheDocument();
    expect(cancelButton).toBeInTheDocument();
    expect(
      saveButton.compareDocumentPosition(cancelButton) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
  });

  it("disables Save until a reason is entered, then enables it", () => {
    renderWithProviders(<RequestDetails />, {
      preloadedState: MOCK_STATE_LOGGED_IN,
    });

    fireEvent.click(screen.getByText("DETAILS"));
    fireEvent.click(screen.getByRole("button", { name: "CHANGE_VOLUNTEER" }));

    const saveButton = screen.getByRole("button", { name: "SAVE" });
    expect(saveButton).toBeDisabled();

    fireEvent.change(screen.getByPlaceholderText("REASON"), {
      target: { value: "Volunteer unavailable" },
    });

    expect(saveButton).not.toBeDisabled();
  });
});
