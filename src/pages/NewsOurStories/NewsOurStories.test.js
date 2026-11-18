import { render, screen } from "@testing-library/react";
import * as reactI18next from "react-i18next";
import NewsOurStories from "./NewsOurStories";
import enNews from "../../common/i18n/locales/en/news.json";
import newsStories from "./newsStories.json";

describe("NewsOurStories", () => {
  it("renders correctly", () => {
    const tree = render(<NewsOurStories />);
    expect(tree).toMatchSnapshot();
  });

  it("renders all 11 story cards", () => {
    render(<NewsOurStories />);

    expect(screen.getAllByRole("img")).toHaveLength(11);

    expect(
      screen.getByRole("img", {
        name: "mockTranslate(ARIA_ANNIVERSARY_TITLE)",
      }),
    ).toBeTruthy();

    expect(
      screen.getByRole("img", {
        name: "mockTranslate(WALMART_TITLE)",
      }),
    ).toBeTruthy();
  });

  it("uses meaningful translation keys from the story JSON", () => {
    expect(newsStories).toHaveLength(11);

    newsStories.forEach((story) => {
      expect(enNews).toHaveProperty(story.titleKey);
      expect(enNews).toHaveProperty(story.descriptionKey);

      expect(enNews[story.titleKey]).toBeTruthy();
      expect(enNews[story.descriptionKey]).toBeTruthy();
    });
  });

  it("contains the expected English story content", () => {
    expect(enNews.ARIA_ANNIVERSARY_DESC).toMatch(/Silicon Andhra/i);
    expect(enNews.WALMART_TITLE).toMatch(/Walmart Spark Good/i);

    const allEnglishContent = Object.values(enNews).join(" ");
    expect(allEnglishContent).not.toMatch(/Georgia Titan/i);
  });

  it("renders configured names and organizations as working external links", () => {
    const useTranslationSpy = jest
      .spyOn(reactI18next, "useTranslation")
      .mockReturnValue({
        t: (key) => enNews[key] || key,
        i18n: {
          language: "en",
          changeLanguage: jest.fn(),
        },
      });

    try {
      const { container } = render(<NewsOurStories />);

      const configuredLinks = Object.assign(
        {},
        ...newsStories.map((story) => story.links || {}),
      );

      const renderedLinks = container.querySelectorAll(".news-card a");

      expect(renderedLinks.length).toBeGreaterThan(0);

      renderedLinks.forEach((link) => {
        const linkText = link.textContent.trim();
        const href = link.getAttribute("href");

        // The CEO LinkedIn link is generated separately from the JSON.
        if (href === "https://www.linkedin.com/in/raobhethanabotla") {
          expect(linkText).toBe("CEO");
        } else {
          expect(configuredLinks[linkText]).toBe(href);
        }

        expect(link.getAttribute("target")).toBe("_blank");
        expect(link.getAttribute("rel")).toBe("noopener noreferrer");
      });

      // Verify the special CEO LinkedIn link exists.
      expect(
        container.querySelector(
          'a[href="https://www.linkedin.com/in/raobhethanabotla"]',
        ),
      ).not.toBeNull();
    } finally {
      useTranslationSpy.mockRestore();
    }
  });
});
