import { render } from "@testing-library/react";
import Donate from "./Donate";

describe("Donate", () => {
  it("renders correctly", () => {
    const tree = render(<Donate />);
    expect(tree).toMatchSnapshot();
  });
});
