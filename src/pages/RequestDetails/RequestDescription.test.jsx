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
});
