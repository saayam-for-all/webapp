import { render } from "@testing-library/react";
import NewsOurStories from "./NewsOurStories";
import { BrowserRouter } from "react-router-dom";

describe("NewsOurStories", () => {
  it("renders correctly", () => {
    const tree = render(
      <BrowserRouter>
        <NewsOurStories />
      </BrowserRouter>,
    );
    expect(tree).toMatchSnapshot();
  });
});
