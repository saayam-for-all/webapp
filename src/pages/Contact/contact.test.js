import { render } from "@testing-library/react";
import Contact from "./Contact";

// TODO: mock translate

describe("Contact", () => {
  it("renders correctly", () => {
    const tree = render(<Contact />);
    expect(tree).toMatchSnapshot();
  });
});
