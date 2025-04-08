import { render } from "@testing-library/react";
import Table from "./Table";

jest.mock("../Pagination/Pagination");

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
});
