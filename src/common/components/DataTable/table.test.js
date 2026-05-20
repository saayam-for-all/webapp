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

  describe("server-side pagination", () => {
    const manyRows = Array.from({ length: 5 }, (_, i) => ({
      id: `REQ-${i + 1}`,
      status: "CREATED",
      subject: `Subject ${i + 1}`,
      type: "REMOTE",
      category: "FOOD_ASSISTANCE",
      priority: "HIGH",
    }));

    it("shows all rows without slicing when serverPaginated is true", () => {
      render(
        <Table
          {...defaultProps}
          rows={manyRows}
          currentPage={3}
          itemsPerPage={2}
          totalPages={10}
          totalRows={20}
          serverPaginated={true}
        />,
      );

      // All 5 rows should render even though currentPage=3 and itemsPerPage=2
      // (server already returned the correct page)
      const cells = screen.getAllByTestId("map-data-one");
      expect(cells.length).toBe(5 * defaultProps.headers.length);
    });

    it("slices rows client-side when serverPaginated is false", () => {
      render(
        <Table
          {...defaultProps}
          rows={manyRows}
          currentPage={1}
          itemsPerPage={2}
          totalPages={3}
          totalRows={5}
          serverPaginated={false}
        />,
      );

      // Only 2 rows should render (itemsPerPage=2, page 1)
      const cells = screen.getAllByTestId("map-data-one");
      expect(cells.length).toBe(2 * defaultProps.headers.length);
    });

    it("does not auto-reset page to 1 when serverPaginated is true", () => {
      const mockSetPage = jest.fn();
      render(
        <Table
          {...defaultProps}
          rows={manyRows}
          currentPage={3}
          setCurrentPage={mockSetPage}
          itemsPerPage={5}
          totalPages={10}
          totalRows={50}
          serverPaginated={true}
        />,
      );

      // setCurrentPage(1) should NOT have been called
      expect(mockSetPage).not.toHaveBeenCalled();
    });

    it("auto-resets page to 1 when serverPaginated is false and totalRows changes", () => {
      const mockSetPage = jest.fn();
      const { rerender } = render(
        <Table
          {...defaultProps}
          rows={manyRows}
          currentPage={2}
          setCurrentPage={mockSetPage}
          itemsPerPage={2}
          totalPages={3}
          totalRows={5}
        />,
      );

      mockSetPage.mockClear();

      // Re-render with different totalRows to trigger the useEffect
      rerender(
        <Table
          {...defaultProps}
          rows={manyRows.slice(0, 3)}
          currentPage={2}
          setCurrentPage={mockSetPage}
          itemsPerPage={2}
          totalPages={2}
          totalRows={3}
        />,
      );

      expect(mockSetPage).toHaveBeenCalledWith(1);
    });
  });
});
