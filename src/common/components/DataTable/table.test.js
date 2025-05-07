import { render } from "@testing-library/react";
import Table from "./Table";
import { axe, toHaveNoViolations } from 'jest-axe'

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
  it('accessibility test', async () =>{
    expect.extend(toHaveNoViolations)
    
    const {container} = render(<Table
      headers={mockHeaders}
      rows={mockRows}
      currentPage={2}
      setCurrentPage={mockSetCurrentPage}
      totalPages={2}
      totalRows={mockRows.length}
      itemsPerPage={2}
      sortConfig={{ key: "name", direction: "descending" }}
      requestSort={mockRequestSort}
      onRowsPerPageChange={mockOnRowsPerPageChange}
      getLinkPath={mockGetLinkPath}
    />,)
    expect(await axe(container)).toHaveNoViolations()
  })

});
  /*it("Shows ↑ when sortConfig is ascending", () => {
    render(
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

    expect(screen.getByText(/Name ↑/i)).toBeInTheDocument();
  });

  it("Shows ↓ when sortConfig is descending", () => {
    render(
      <Table
        headers={mockHeaders}
        rows={mockRows}
        currentPage={1}
        setCurrentPage={mockSetCurrentPage}
        totalPages={2}
        totalRows={mockRows.length}
        itemsPerPage={2}
        sortConfig={{ key: "name", direction: "descending" }}
        requestSort={mockRequestSort}
        onRowsPerPageChange={mockOnRowsPerPageChange}
        getLinkPath={mockGetLinkPath}
      />,
    );

    expect(screen.getByText(/Name ↓/i)).toBeInTheDocument();
  });
  it("tests paginationRequest", () => {
    render(
      <Table
        headers={mockHeaders}
        rows={mockRows}
        currentPage={2}
        setCurrentPage={mockSetCurrentPage}
        totalPages={2}
        totalRows={mockRows.length}
        itemsPerPage={2}
        sortConfig={{ key: "name", direction: "descending" }}
        requestSort={mockRequestSort}
        onRowsPerPageChange={mockOnRowsPerPageChange}
        getLinkPath={mockGetLinkPath}
      />,
    );
    expect(screen.getByText("Item 3")).toBeInTheDocument();
    expect(screen.getByText("Item 4")).toBeInTheDocument();

    expect(screen.queryByText("Item 1")).not.toBeInTheDocument();
    expect(screen.queryByText("Item 2")).not.toBeInTheDocument();
  });*/
  
