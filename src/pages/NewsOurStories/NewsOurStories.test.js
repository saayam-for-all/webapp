import { render } from "@testing-library/react";
import NewsOurStories from "./NewsOurStories";

describe("NewsOurStories", () => {
  it("preserves the complete European roadtrip collage", () => {
    const { container } = render(<NewsOurStories />);

    const collage = container.querySelector(
      'img[src="/news/europe-roadtrip-collage.webp"]',
    );

    expect(collage).not.toBeNull();

    expect(
      collage.parentElement.classList.contains("news-img-wrap-contained"),
    ).toBe(true);

    expect(container.querySelectorAll(".news-img-wrap-contained")).toHaveLength(
      1,
    );
  });

  it("renders correctly", () => {
    const tree = render(<NewsOurStories />);
    expect(tree).toMatchSnapshot();
  });
});
