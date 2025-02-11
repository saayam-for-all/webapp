import { render } from "@testing-library/react";
import Info from "./Info";

describe("Info", () => {
  it("renders correctly", () => {
    const tree = render(<Info />);
    expect(tree).toMatchSnapshot();
  });
});
