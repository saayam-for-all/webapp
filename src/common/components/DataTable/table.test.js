import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import Table from "./Table";

jest.mock("../Pagination/Pagination");

const mockCategoriesBundle = {
  REQUEST_CATEGORIES: {
    FOOD_AND_ESSENTIALS: {
      LABEL: "Food & Essentials",
      SUBCATEGORIES: {
        FOOD_ASSISTANCE: { LABEL: "Food Assistance" },
        GROCERY_SHOPPING_AND_DELIVERY: {
          LABEL: "Grocery Shopping & Delivery",
        },
      },
    },
    GENERAL_CATEGORY: {
      LABEL: "General",
      SUBCATEGORIES: {
        BUY_THINGS: { LABEL: "Buy Household Items" },
      },
    },
  },
};

jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key) => key,
    i18n: {
      language: "en",
      getResourceBundle: (lang, ns) => {
        if (ns === "categories") return mockCategoriesBundle;
        return null;
      },
    },
  }),
}));

const defaultProps = {
  headers: ["requestId", "status", "subject", "type", "category", "priority"],
  rows: [
    {
      id: "REQ-001",
      status: "CREATED",
      subject: "Test subject",
      type: "IN_PERSON",
      category: "FOOD_ASSISTANCE",
      priority: "HIGH",
    },
  ],
  currentPage: 1,
  setCurrentPage: jest.fn(),
  totalPages: 1,
  totalRows: 1,
  itemsPerPage: 5,
  sortConfig: { key: "status", direction: "ascending" },
  requestSort: jest.fn(),
  onRowsPerPageChange: jest.fn(),
  getLinkPath: jest.fn(() => null),
};

describe("Table", () => {
  const mockHeaders = ["id", "name"];
  const mockRows = [
    { id: 1, name: "Item 1" },
    { id: 2, name: "Item 2" },
  ];

  const mockSetCurrentPage = jest.fn();
  const mockRequestSort = jest.fn();
  const mockGetLinkPath = jest.fn(() => "/mock-link-path");
  const mockOnRowsPerPageChange = jest.fn();

  it("renders correctly", () => {
    const tree = render(
      <Table
        headers={mockHeaders}
        rows={mockRows}
        currentPage={1}
        setCurrentPage={mockSetCurrentPage}
        totalPages={2}
        totalRows={mockRows.length}
        itemsPerPage={2}
        sortConfig={{ key: "name", direction: "ascending" }}
        requestSort={mockRequestSort}
        onRowsPerPageChange={mockOnRowsPerPageChange}
        getLinkPath={mockGetLinkPath}
      />,
    );
    expect(tree).toMatchSnapshot();
  });

  describe("header translation", () => {
    it("uses translated labels for mapped headers", () => {
      render(<Table {...defaultProps} />);

      expect(screen.getByText(/^STATUS/)).toBeInTheDocument();
      expect(screen.getByText(/^SUBJECT/)).toBeInTheDocument();
      expect(screen.getByText(/^TYPE/)).toBeInTheDocument();
      expect(screen.getByText(/^REQUEST_CATEGORY/)).toBeInTheDocument();
      expect(screen.getByText(/^PRIORITY/)).toBeInTheDocument();
    });

    it("falls back to camelCase transform for unmapped headers", () => {
      render(<Table {...defaultProps} headers={["requestId", "calamity"]} />);

      expect(screen.getByText("Calamity")).toBeInTheDocument();
    });
  });

  describe("category cell translation", () => {
    it("translates a subcategory code to its readable label", () => {
      render(<Table {...defaultProps} />);

      expect(screen.getByText("Food Assistance")).toBeInTheDocument();
    });

    it("translates a nested subcategory code", () => {
      const props = {
        ...defaultProps,
        rows: [{ ...defaultProps.rows[0], category: "BUY_THINGS" }],
      };
      render(<Table {...props} />);

      expect(screen.getByText("Buy Household Items")).toBeInTheDocument();
    });

    it("falls back to raw code when category is not found in bundle", () => {
      const props = {
        ...defaultProps,
        rows: [{ ...defaultProps.rows[0], category: "UNKNOWN_CATEGORY" }],
      };
      render(<Table {...props} />);

      expect(screen.getByText("UNKNOWN_CATEGORY")).toBeInTheDocument();
    });

    it("falls back to raw code when categories bundle is unavailable", () => {
      jest
        .spyOn(require("react-i18next"), "useTranslation")
        .mockReturnValueOnce({
          t: (key) => key,
          i18n: {
            language: "en",
            getResourceBundle: () => null,
          },
        });
      const props = {
        ...defaultProps,
        rows: [{ ...defaultProps.rows[0], category: "FOOD_ASSISTANCE" }],
      };
      render(<Table {...props} />);
      expect(screen.getByText("FOOD_ASSISTANCE")).toBeInTheDocument();
    });

    it("handles empty category gracefully", () => {
      const props = {
        ...defaultProps,
        rows: [{ ...defaultProps.rows[0], category: "" }],
      };
      expect(() => render(<Table {...props} />)).not.toThrow();
    });
  });
});
