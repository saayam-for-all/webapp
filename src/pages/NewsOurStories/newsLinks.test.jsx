import { fireEvent, render, screen, within } from "@testing-library/react";
import NewsOurStories from "./NewsOurStories";
import arabic from "../../common/i18n/locales/ar/news.json";
import urdu from "../../common/i18n/locales/ur/news.json";

jest.mock("react-router-dom", () => ({
  useNavigate: () => jest.fn(),
  Link: "a",
}));

jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key, options) =>
      (mockTranslations[key] || key).replace(
        "{{page}}",
        String(options?.page ?? ""),
      ),
    i18n: {
      resolvedLanguage: mockLanguage,
      language: mockLanguage,
    },
  }),
}));

let mockTranslations = {};
let mockLanguage = "en";

describe.each([
  [
    "Arabic",
    arabic,
    "رئيسنا التنفيذي",
    "القنصل الهندي",
    "الفريق القنصلي الهندي",
  ],
  ["Urdu", urdu, "CEO", "بھارتی قونصل", "بھارتی قونصلر ٹیم"],
])("%s news hyperlinks", (_, locale, ceoText, consulText, teamText) => {
  beforeEach(() => {
    mockTranslations = locale;
    mockLanguage = locale === arabic ? "ar" : "ur";
  });

  test("links our CEO to Rao's LinkedIn", () => {
    const { container } = render(<NewsOurStories />);

    const links = Array.from(
      container.querySelectorAll(
        'a[href="https://www.linkedin.com/in/raobhethanabotla"]',
      ),
    );

    expect(links.length).toBeGreaterThan(0);
    expect(links.some((link) => link.textContent.includes(ceoText))).toBe(true);
  });

  test("links the Indian Consul and consular team", () => {
    const { container } = render(<NewsOurStories />);

    fireEvent.click(
      screen.getByRole("button", {
        name: locale.PAGINATION_NEXT,
      }),
    );

    const storySeven = Array.from(
      container.querySelectorAll(".news-card"),
    ).find((card) => card.textContent.includes("Srikar Reddy Koppula"));

    expect(storySeven).toBeTruthy();

    const consulateLinks = within(storySeven)
      .getAllByRole("link")
      .filter(
        (link) => link.getAttribute("href") === "https://www.cgisf.gov.in/",
      );

    expect(
      consulateLinks.some((link) => link.textContent.includes(consulText)),
    ).toBe(true);
    expect(
      consulateLinks.some((link) => link.textContent.includes(teamText)),
    ).toBe(true);
  });
});
