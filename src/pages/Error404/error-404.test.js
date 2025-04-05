import { render } from "@testing-library/react";
import Error404 from "./Error404";

describe("Error404", () => {
  it("renders correctly", () => {
    const tree = render(<Error404 />);
    expect(tree).toMatchSnapshot();
  });
});
