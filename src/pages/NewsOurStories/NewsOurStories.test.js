import { render, screen } from "@testing-library/react";
import NewsOurStories from "./NewsOurStories";
import { BrowserRouter } from "react-router-dom";

describe("NewsOurStories", () => {
  it("renders the News: Our Stories page", () => {
    render(
      <BrowserRouter>
        <NewsOurStories />
      </BrowserRouter>,
    );
    expect(screen.getByText("News: Our Stories")).toBeInTheDocument();
    expect(screen.getByText("Want to join us?")).toBeInTheDocument();
  });
});
