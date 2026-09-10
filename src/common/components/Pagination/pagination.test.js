import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import Pagination from "./Pagination";

describe("Pagination", () => {
  it("renders correctly", () => {
    const tree = render(
      <Pagination
        currentPage={1}
        totalPages={3}
        onPageChange={() => {}}
        rowsPerPage={10}
        totalRows={30}
      />,
    );
    expect(tree).toMatchSnapshot();
  });

  it("shows 0 as start index when totalRows is 0", () => {
    render(
      <Pagination
        currentPage={1}
        totalPages={1}
        onPageChange={() => {}}
        rowsPerPage={10}
        totalRows={0}
      />,
    );

    expect(
      screen.getByText(/Showing data 0-0 of 0 entries/),
    ).toBeInTheDocument();
  });
});
