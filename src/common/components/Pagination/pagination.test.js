import { render } from "@testing-library/react";
import Pagination from "./Pagination";
import { toHaveNoViolations,axe } from "jest-axe";

describe("Pagination", () => {
  expect.extend(toHaveNoViolations)
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
  it('does accesibility test',async () =>{
    const {container} = render(
      <Pagination
        currentPage={1}
        totalPages={3}
        onPageChange={() => {}}
        rowsPerPage={10}
        totalRows={30}
      />,)
      expect(await axe(container)).toHaveNoViolations()
  })
});
