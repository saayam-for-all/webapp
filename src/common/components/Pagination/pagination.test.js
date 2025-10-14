import { render } from "@testing-library/react";
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
});
