import "@testing-library/jest-dom";
import { render, screen, waitFor } from "@testing-library/react";
import AdditionalFieldsDisplay from "./AdditionalFieldsDisplay";
import * as requestServices from "../../services/requestServices";

jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key, options) => options?.defaultValue ?? key,
  }),
}));

jest.mock("../../services/requestServices", () => ({
  getAdditionalFields: jest.fn(),
}));

let mockCategories = [];
jest.mock("react-redux", () => ({
  useSelector: (selector) =>
    selector({ request: { categories: mockCategories } }),
}));

const sampleMetadata = [
  {
    catId: "1.1",
    fields: [
      {
        fieldId: "1.1.A",
        fieldNameKey: "PREFERRED_MEAL_TYPE",
        fieldType: "list",
        status: "active",
        catId: "1.1",
        listItems: [
          {
            itemId: "1.1.A.1",
            itemValue: "VEGETARIAN",
            itemType: "radiobutton",
          },
          { itemId: "1.1.A.2", itemValue: "VEGAN", itemType: "radiobutton" },
        ],
      },
      {
        fieldId: "1.1.B",
        fieldNameKey: "DIETARY_RESTRICTIONS",
        fieldType: "list",
        status: "active",
        catId: "1.1",
        listItems: [
          { itemId: "1.1.B.1", itemValue: "GLUTEN_FREE", itemType: "checkbox" },
          { itemId: "1.1.B.2", itemValue: "DAIRY_FREE", itemType: "checkbox" },
        ],
      },
      {
        fieldId: "1.1.C",
        fieldNameKey: "HOUSEHOLD_SIZE",
        fieldType: "int",
        status: "active",
        catId: "1.1",
      },
    ],
  },
];

describe("AdditionalFieldsDisplay", () => {
  beforeEach(() => {
    localStorage.setItem("metadata", JSON.stringify(sampleMetadata));
    mockCategories = [];
  });

  afterEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  it("shows loading state initially", () => {
    requestServices.getAdditionalFields.mockResolvedValue({ data: {} });
    render(
      <AdditionalFieldsDisplay
        requestId="REQ-1"
        requesterId="SID-1"
        category="1.1"
      />,
    );
    expect(
      screen.getByText("Loading additional details..."),
    ).toBeInTheDocument();
  });

  it("shows the empty-state message when the API returns no data", async () => {
    requestServices.getAdditionalFields.mockResolvedValue({ data: {} });
    render(
      <AdditionalFieldsDisplay
        requestId="REQ-1"
        requesterId="SID-1"
        category="1.1"
      />,
    );
    await waitFor(() => {
      expect(
        screen.getByText("No additional information available."),
      ).toBeInTheDocument();
    });
  });

  it("shows the empty-state message when requestId or requesterId is missing", async () => {
    render(
      <AdditionalFieldsDisplay
        requestId={null}
        requesterId={null}
        category="1.1"
      />,
    );
    await waitFor(() => {
      expect(
        screen.getByText("No additional information available."),
      ).toBeInTheDocument();
    });
    expect(requestServices.getAdditionalFields).not.toHaveBeenCalled();
  });

  it("shows an error message when the API call fails", async () => {
    requestServices.getAdditionalFields.mockRejectedValue(new Error("fail"));
    render(
      <AdditionalFieldsDisplay
        requestId="REQ-1"
        requesterId="SID-1"
        category="1.1"
      />,
    );
    await waitFor(() => {
      expect(
        screen.getByText(
          "Failed to load additional details. Please try again.",
        ),
      ).toBeInTheDocument();
    });
  });

  it("maps single-select field codes to readable labels", async () => {
    requestServices.getAdditionalFields.mockResolvedValue({
      data: { "1.1.A": ["1.1.A.1"] },
    });
    render(
      <AdditionalFieldsDisplay
        requestId="REQ-1"
        requesterId="SID-1"
        category="1.1"
      />,
    );
    await waitFor(() => {
      expect(screen.getByText("Preferred Meal Type:")).toBeInTheDocument();
      expect(screen.getByText("Vegetarian")).toBeInTheDocument();
    });
  });

  it("joins multi-select values with a comma", async () => {
    requestServices.getAdditionalFields.mockResolvedValue({
      data: { "1.1.B": ["1.1.B.1", "1.1.B.2"] },
    });
    render(
      <AdditionalFieldsDisplay
        requestId="REQ-1"
        requesterId="SID-1"
        category="1.1"
      />,
    );
    await waitFor(() => {
      expect(screen.getByText("Gluten Free, Dairy Free")).toBeInTheDocument();
    });
  });

  it("shows a raw value for a field with no list items", async () => {
    requestServices.getAdditionalFields.mockResolvedValue({
      data: { "1.1.C": "4" },
    });
    render(
      <AdditionalFieldsDisplay
        requestId="REQ-1"
        requesterId="SID-1"
        category="1.1"
      />,
    );
    await waitFor(() => {
      expect(screen.getByText("Household Size:")).toBeInTheDocument();
      expect(screen.getByText("4")).toBeInTheDocument();
    });
  });

  it("formats an ISO date-time value as a readable date", async () => {
    requestServices.getAdditionalFields.mockResolvedValue({
      data: { "1.1.C": "2026-06-13T04:00:00Z" },
    });
    render(
      <AdditionalFieldsDisplay
        requestId="REQ-1"
        requesterId="SID-1"
        category="1.1"
      />,
    );
    await waitFor(() => {
      expect(screen.getByText("June 13, 2026")).toBeInTheDocument();
    });
  });

  it("joins an object value's own values with a dash instead of showing [object Object]", async () => {
    requestServices.getAdditionalFields.mockResolvedValue({
      data: { "1.1.C": { min: 100, max: 150 } },
    });
    render(
      <AdditionalFieldsDisplay
        requestId="REQ-1"
        requesterId="SID-1"
        category="1.1"
      />,
    );
    await waitFor(() => {
      expect(screen.getByText("100 - 150")).toBeInTheDocument();
    });
  });

  it("falls back to a title-cased field code when no metadata entry matches", async () => {
    requestServices.getAdditionalFields.mockResolvedValue({
      data: { UNKNOWN_FIELD: "some value" },
    });
    render(
      <AdditionalFieldsDisplay
        requestId="REQ-1"
        requesterId="SID-1"
        category="1.1"
      />,
    );
    await waitFor(() => {
      expect(screen.getByText("Unknown Field:")).toBeInTheDocument();
    });
  });

  it("resolves a human-readable category name to the numeric catId via the categories tree", async () => {
    mockCategories = [
      {
        catId: "1.1",
        catName: "GROCERY_SHOPPING_AND_DELIVERY",
        subCategories: [],
      },
    ];
    requestServices.getAdditionalFields.mockResolvedValue({
      data: { "1.1.A": ["1.1.A.2"] },
    });
    render(
      <AdditionalFieldsDisplay
        requestId="REQ-1"
        requesterId="SID-1"
        category="GROCERY_SHOPPING_AND_DELIVERY"
      />,
    );
    await waitFor(() => {
      expect(screen.getByText("Vegan")).toBeInTheDocument();
    });
  });
});
