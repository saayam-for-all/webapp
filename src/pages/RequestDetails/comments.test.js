import { render } from "@testing-library/react";
import Comments from "./Comments";

describe("Comments", () => {
  it("renders correctly", () => {
    const tree = render(<Comments />);
    expect(tree).toMatchSnapshot();
  });
});
