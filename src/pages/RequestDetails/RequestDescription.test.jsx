import "@testing-library/jest-dom";
import { screen } from "@testing-library/react";
import { renderWithProviders, MOCK_STATE_LOGGED_IN } from "#utils/test-utils";
import RequestDescription from "./RequestDescription";

jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key) => key,
    i18n: {
      resolvedLanguage: "en",
      language: "en",
      hasResourceBundle: () => true,
      getResourceBundle: () => ({
        REQUEST_CATEGORIES: {
          Maintenance: { LABEL: "Maintenance" },
          Medical: { LABEL: "Medical" },
          Education: { LABEL: "Education" },
        },
      }),
    },
  }),
}));

describe("RequestDescription", () => {
  const mockRequestData = {
    id: "REQ-123",
    description: "This is a test request description",
    creationDate: "2024-01-15T10:00:00Z",
    category: "Maintenance",
    status: "Open",
    priority: "High",
  };

  it("renders description, status, and priority", () => {
    renderWithProviders(<RequestDescription requestData={mockRequestData} />, {
      preloadedState: MOCK_STATE_LOGGED_IN,
    });

    expect(
      screen.getByText("This is a test request description"),
    ).toBeInTheDocument();
    expect(screen.getByText("Open")).toBeInTheDocument();
    expect(screen.getByText("High")).toBeInTheDocument();
  });

  it("renders formatted creation date and category label", () => {
    renderWithProviders(<RequestDescription requestData={mockRequestData} />, {
      preloadedState: MOCK_STATE_LOGGED_IN,
    });

    expect(screen.getByText(/January 15, 2024/)).toBeInTheDocument();
    expect(screen.getByText("Maintenance")).toBeInTheDocument();
  });

  describe("Issue #1456 - Updated Date, Additional Info, Attached Files", () => {
    it("displays dash when lastUpdatedAt is not provided", () => {
      renderWithProviders(
        <RequestDescription requestData={mockRequestData} />,
        { preloadedState: MOCK_STATE_LOGGED_IN },
      );
      expect(screen.getByText("—")).toBeInTheDocument();
    });

    it("displays formatted updated date when lastUpdatedAt is provided", () => {
      const requestDataWithUpdatedDate = {
        ...mockRequestData,
        lastUpdatedAt: "2024-06-15T10:00:00Z",
      };
      renderWithProviders(
        <RequestDescription requestData={requestDataWithUpdatedDate} />,
        { preloadedState: MOCK_STATE_LOGGED_IN },
      );
      expect(screen.getByText(/June 15, 2024/)).toBeInTheDocument();
    });

    it("displays placeholder when additionalInfo is not present", () => {
      renderWithProviders(
        <RequestDescription requestData={mockRequestData} />,
        { preloadedState: MOCK_STATE_LOGGED_IN },
      );
      expect(
        screen.getByText("No additional information available."),
      ).toBeInTheDocument();
    });

    it("displays additionalInfo fields when present", () => {
      const requestDataWithInfo = {
        ...mockRequestData,
        additionalInfo: {
          contact_number: "123-456-7890",
          preferred_time: "Morning",
        },
      };
      renderWithProviders(
        <RequestDescription requestData={requestDataWithInfo} />,
        { preloadedState: MOCK_STATE_LOGGED_IN },
      );
      expect(screen.getByText("contact number")).toBeInTheDocument();
      expect(screen.getByText("123-456-7890")).toBeInTheDocument();
      expect(screen.getByText("preferred time")).toBeInTheDocument();
      expect(screen.getByText("Morning")).toBeInTheDocument();
    });

    it("displays placeholder when attachments are not present", () => {
      renderWithProviders(
        <RequestDescription requestData={mockRequestData} />,
        { preloadedState: MOCK_STATE_LOGGED_IN },
      );
      expect(screen.getByText("No files attached.")).toBeInTheDocument();
    });

    it("displays attached files when present", () => {
      const requestDataWithAttachments = {
        ...mockRequestData,
        attachments: [
          { name: "document.pdf", url: "https://example.com/document.pdf" },
          { url: "https://example.com/file2.pdf" },
        ],
      };
      renderWithProviders(
        <RequestDescription requestData={requestDataWithAttachments} />,
        { preloadedState: MOCK_STATE_LOGGED_IN },
      );
      expect(screen.getByText("document.pdf")).toBeInTheDocument();
      expect(screen.getByText("File 2")).toBeInTheDocument();
    });
  });
});
