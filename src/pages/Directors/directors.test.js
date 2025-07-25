import { render } from "@testing-library/react";
import Directors from "./Directors";

describe("Directors", () => {
  it("renders correctly", () => {
    const tree = render(<Directors />);
    expect(tree).toMatchSnapshot();
  });
});
