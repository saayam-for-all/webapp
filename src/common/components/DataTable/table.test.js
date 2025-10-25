import { render } from "@testing-library/react";
import Table from "./Table";

describe("Table", () => {
  const mockHeaders = ["id", "name"];
  const mockRows = [
    { id: 1, name: "Item 1" },
    { id: 2, name: "Item 2" },
  ];

  const mockRequestSort = jest.fn();
  const mockGetLinkPath = jest.fn(() => "/mock-link-path");

  it("renders correctly", () => {
    const tree = render(
      <Table
        headers={mockHeaders}
        rows={mockRows}
        sortConfig={{ key: "name", direction: "ascending" }}
        requestSort={mockRequestSort}
        getLinkPath={mockGetLinkPath}
      />,
    );
    expect(tree).toMatchSnapshot();
  });
});
