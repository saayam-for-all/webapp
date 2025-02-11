import { render } from "@testing-library/react";
import NavBar from "./NavBar";

describe("NavBar", () => {
  it("renders correctly", () => {
    const tree = render(<NavBar />);
    expect(tree).toMatchSnapshot();
  });
});
