import { render, screen } from "@testing-library/react";
import NewsOurStories from "./NewsOurStories";
import enNews from "../../common/i18n/locales/en/news.json";

describe("NewsOurStories", () => {
  it("renders correctly", () => {
    const tree = render(<NewsOurStories />);
    expect(tree).toMatchSnapshot();
  });

  it("renders all 11 story cards", () => {
    render(<NewsOurStories />);

    expect(screen.getAllByRole("img")).toHaveLength(11);
    expect(screen.getByRole("img", { name: "STORY_1_TITLE" })).toBeTruthy();
    expect(screen.getByRole("img", { name: "STORY_2_TITLE" })).toBeTruthy();
  });

  it("contains the new English content and removes the deleted story", () => {
    expect(enNews.STORY_1_DESC).toMatch(/Silicon Andhra/i);
    expect(enNews.STORY_2_TITLE).toMatch(/Walmart Spark Good/i);

    const allEnglishContent = Object.values(enNews).join(" ");
    expect(allEnglishContent).not.toMatch(/Georgia Titan/i);
  });
});
