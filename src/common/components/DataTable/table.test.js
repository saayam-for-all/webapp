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
  headers: [
    "requestId",
    "subject",
    "category",
    "status",
    "priority",
    "updatedDate",
    "creationDate",
    "calamity",
  ],
  rows: [
    {
      requestId: "REQ-001",
      id: "REQ-001",
      status: "CREATED",
      subject: "Test subject",
      type: "IN_PERSON",
      requestCategory: "FOOD_ASSISTANCE",
      category: "FOOD_ASSISTANCE",
      priority: "HIGH",
      updatedDate: "2026-05-25T17:17:45.999Z",
      creationDate: "2026-05-24T17:17:45.999Z",
      calamity: "No",
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

      expect(screen.getAllByText(/REQUEST ID/i).length).toBeGreaterThan(0);
      expect(screen.getAllByText(/SUBJECT/i).length).toBeGreaterThan(0);
      expect(screen.getAllByText(/CATEGORY/i).length).toBeGreaterThan(0);
      expect(screen.getAllByText(/STATUS/i).length).toBeGreaterThan(0);
      expect(screen.getAllByText(/PRIORITY/i).length).toBeGreaterThan(0);
      expect(screen.getAllByText(/LAST UPDATED/i).length).toBeGreaterThan(0);
      expect(screen.getAllByText(/CREATED/i).length).toBeGreaterThan(0);
      expect(screen.getAllByText(/CALAMITY/i).length).toBeGreaterThan(0);
    });

    it("falls back to camelCase transform for unmapped headers", () => {
      render(<Table {...defaultProps} headers={["requestId", "calamity"]} />);

      expect(screen.getByText("Calamity")).toBeInTheDocument();
    });

    it("renders readable All Requests identity labels and missing-value markers", () => {
      render(
        <Table
          {...defaultProps}
          headers={["beneficiaryCreatorDisplayId", "leadVolunteerDisplayId"]}
          rows={[
            {
              beneficiaryCreatorDisplayId: "SID-CREATOR",
              leadVolunteerDisplayId: null,
            },
          ]}
        />,
      );

      expect(
        screen.getByText("Beneficiary ID / Creator ID"),
      ).toBeInTheDocument();
      expect(screen.getByText("Lead Volunteer ID")).toBeInTheDocument();
      expect(screen.getByText("SID-CREATOR")).toBeInTheDocument();
      expect(screen.getByText("—")).toBeInTheDocument();
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
        rows: [
          {
            ...defaultProps.rows[0],
            requestCategory: "BUY_THINGS",
            category: "BUY_THINGS",
          },
        ],
      };
      render(<Table {...props} />);

      expect(screen.getByText("Buy Household Items")).toBeInTheDocument();
    });

    it("falls back to raw code when category is not found in bundle", () => {
      const props = {
        ...defaultProps,
        rows: [
          {
            ...defaultProps.rows[0],
            requestCategory: "UNKNOWN_CATEGORY",
            category: "UNKNOWN_CATEGORY",
          },
        ],
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
        rows: [
          {
            ...defaultProps.rows[0],
            requestCategory: "FOOD_ASSISTANCE",
            category: "FOOD_ASSISTANCE",
          },
        ],
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
      requestId: `REQ-${i + 1}`,
      id: `REQ-${i + 1}`,
      status: "CREATED",
      subject: `Subject ${i + 1}`,
      type: "REMOTE",
      requestCategory: "FOOD_ASSISTANCE",
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

    it("does not auto-reset page when totalRows changes (client pagination)", () => {
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

      expect(mockSetPage).not.toHaveBeenCalled();
    });
  });

  describe("API field mapping", () => {
    it("reads category from requestCategory when category header is used", () => {
      render(
        <Table
          {...defaultProps}
          rows={[
            {
              requestId: "REQ-API",
              requestCategory: "FOOD_ASSISTANCE",
            },
          ]}
        />,
      );

      expect(screen.getByText("Food Assistance")).toBeInTheDocument();
    });

    it("formats creationDate values for display", () => {
      render(
        <Table
          {...defaultProps}
          headers={["requestId", "creationDate"]}
          rows={[
            {
              requestId: "REQ-DATE",
              creationDate: "2026-05-24T17:17:45.999Z",
            },
          ]}
        />,
      );

      expect(screen.getByText(/05\/24\/2026/)).toBeInTheDocument();
    });

    it("renders requestId from requestId field", () => {
      render(
        <Table
          {...defaultProps}
          headers={["requestId", "status"]}
          rows={[{ requestId: "REQ-99-001", status: "CREATED" }]}
        />,
      );

      expect(screen.getByText("REQ-99-001")).toBeInTheDocument();
    });

    it("wraps long request IDs across multiple lines", () => {
      render(
        <Table
          {...defaultProps}
          headers={["requestId", "status"]}
          rows={[
            { requestId: "REQ-00-000-000-0490", status: "MATCHING_VOLUNTEER" },
          ]}
        />,
      );

      expect(screen.getByText("REQ-00-")).toBeInTheDocument();
      expect(screen.getByText("000-000-")).toBeInTheDocument();
      expect(screen.getByText("0490")).toBeInTheDocument();
    });
  });
});
