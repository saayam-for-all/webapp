import "@testing-library/jest-dom";
import { screen } from "@testing-library/react";
import { renderWithProviders, MOCK_STATE_LOGGED_IN } from "#utils/test-utils";
import RequestDescription from "./RequestDescription";

jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key, fallback) => fallback || key,
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
    it("displays dash when updated date is not provided", () => {
      renderWithProviders(
        <RequestDescription requestData={mockRequestData} />,
        {
          preloadedState: MOCK_STATE_LOGGED_IN,
        },
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
        {
          preloadedState: MOCK_STATE_LOGGED_IN,
        },
      );

      expect(screen.getByText(/June 15, 2024/)).toBeInTheDocument();
    });

    it("displays formatted updated date when updatedDate is provided", () => {
      const requestDataWithUpdatedDate = {
        ...mockRequestData,
        updatedDate: "2024-06-16T10:00:00Z",
      };

      renderWithProviders(
        <RequestDescription requestData={requestDataWithUpdatedDate} />,
        {
          preloadedState: MOCK_STATE_LOGGED_IN,
        },
      );

      expect(screen.getByText(/June 16, 2024/)).toBeInTheDocument();
    });

    it("displays formatted updated date when updatedAt is provided", () => {
      const requestDataWithUpdatedDate = {
        ...mockRequestData,
        updatedAt: "2024-06-17T10:00:00Z",
      };

      renderWithProviders(
        <RequestDescription requestData={requestDataWithUpdatedDate} />,
        {
          preloadedState: MOCK_STATE_LOGGED_IN,
        },
      );

      expect(screen.getByText(/June 17, 2024/)).toBeInTheDocument();
    });

    it("displays formatted updated date when lastUpdated is provided", () => {
      const requestDataWithUpdatedDate = {
        ...mockRequestData,
        lastUpdated: "2024-06-18T10:00:00Z",
      };

      renderWithProviders(
        <RequestDescription requestData={requestDataWithUpdatedDate} />,
        {
          preloadedState: MOCK_STATE_LOGGED_IN,
        },
      );

      expect(screen.getByText(/June 18, 2024/)).toBeInTheDocument();
    });

    it("displays formatted updated date when modifiedDate is provided", () => {
      const requestDataWithUpdatedDate = {
        ...mockRequestData,
        modifiedDate: "2024-06-19T10:00:00Z",
      };

      renderWithProviders(
        <RequestDescription requestData={requestDataWithUpdatedDate} />,
        {
          preloadedState: MOCK_STATE_LOGGED_IN,
        },
      );

      expect(screen.getByText(/June 19, 2024/)).toBeInTheDocument();
    });

    it("displays placeholder when additionalInfo is not present", () => {
      renderWithProviders(
        <RequestDescription requestData={mockRequestData} />,
        {
          preloadedState: MOCK_STATE_LOGGED_IN,
        },
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
        {
          preloadedState: MOCK_STATE_LOGGED_IN,
        },
      );

      expect(screen.getByText("contact number")).toBeInTheDocument();

      expect(screen.getByText("123-456-7890")).toBeInTheDocument();

      expect(screen.getByText("preferred time")).toBeInTheDocument();

      expect(screen.getByText("Morning")).toBeInTheDocument();
    });

    it("displays placeholder when attachments are not present", () => {
      renderWithProviders(
        <RequestDescription requestData={mockRequestData} />,
        {
          preloadedState: MOCK_STATE_LOGGED_IN,
        },
      );

      expect(screen.getByText("No files attached.")).toBeInTheDocument();
    });

    it("displays attached files when present", () => {
      const requestDataWithAttachments = {
        ...mockRequestData,
        attachments: [
          {
            name: "document.pdf",
            url: "https://example.com/document.pdf",
          },
          {
            url: "https://example.com/file2.pdf",
          },
        ],
      };

      renderWithProviders(
        <RequestDescription requestData={requestDataWithAttachments} />,
        {
          preloadedState: MOCK_STATE_LOGGED_IN,
        },
      );

      expect(screen.getByText("document.pdf")).toBeInTheDocument();

      expect(screen.getByText("File 2")).toBeInTheDocument();
    });
  });

  describe("Issue #1349 - Priority diamond colors", () => {
    const priorityCases = [
      ["Low", "text-green-500"],
      ["Medium", "text-yellow-500"],
      ["High", "text-orange-500"],
      ["Critical", "text-red-500"],
    ];

    it.each(priorityCases)(
      "renders %s priority with the correct diamond color",
      (priority, expectedClass) => {
        const { container } = renderWithProviders(
          <RequestDescription
            requestData={{
              ...mockRequestData,
              priority,
            }}
          />,
          {
            preloadedState: MOCK_STATE_LOGGED_IN,
          },
        );

        const priorityDiamond = container.querySelector(`svg.${expectedClass}`);

        expect(priorityDiamond).toBeInTheDocument();
      },
    );

    it("uses gray color for an unknown priority", () => {
      const { container } = renderWithProviders(
        <RequestDescription
          requestData={{
            ...mockRequestData,
            priority: "Unknown",
          }}
        />,
        {
          preloadedState: MOCK_STATE_LOGGED_IN,
        },
      );

      const priorityDiamond = container.querySelector("svg.text-gray-500");

      expect(priorityDiamond).toBeInTheDocument();
    });
  });

  describe("Issue #1654 - Category hover tooltip", () => {
    it("renders the category label text", () => {
      renderWithProviders(
        <RequestDescription requestData={mockRequestData} />,
        { preloadedState: MOCK_STATE_LOGGED_IN },
      );

      expect(screen.getByText("Maintenance")).toBeInTheDocument();
    });

    it("renders the category tooltip with CATEGORY key in the DOM", () => {
      const { container } = renderWithProviders(
        <RequestDescription requestData={mockRequestData} />,
        { preloadedState: MOCK_STATE_LOGGED_IN },
      );

      // Tooltip div is always in the DOM (opacity controlled by CSS group-hover)
      const tooltip = container.querySelector(
        ".opacity-0.group-hover\\:opacity-100",
      );
      expect(tooltip).not.toBeNull();
      // At least one tooltip contains the CATEGORY key text
      const tooltips = container.querySelectorAll(
        ".opacity-0.group-hover\\:opacity-100",
      );
      const categoryTooltip = Array.from(tooltips).find((el) =>
        el.textContent.includes("CATEGORY"),
      );
      expect(categoryTooltip).not.toBeNull();
    });

    it("category span has cursor-help and dashed underline classes", () => {
      const { container } = renderWithProviders(
        <RequestDescription requestData={mockRequestData} />,
        { preloadedState: MOCK_STATE_LOGGED_IN },
      );

      const spans = container.querySelectorAll("span.cursor-help");
      const categorySpan = Array.from(spans).find((el) =>
        el.textContent.includes("Maintenance"),
      );
      expect(categorySpan).not.toBeNull();
      expect(categorySpan).toHaveClass("border-b", "border-dashed");
    });
  });
});
