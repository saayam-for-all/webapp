import { render } from "@testing-library/react";
import NewsOurStories from "./NewsOurStories";

describe("NewsOurStories", () => {
  it("renders correctly", () => {
    const tree = render(<NewsOurStories />);
    expect(tree).toMatchSnapshot();
  });
});
