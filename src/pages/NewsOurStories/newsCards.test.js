import fs from "fs";
import path from "path";
import newsCards from "./newsCards.json";
import english from "../../common/i18n/locales/en/news.json";

describe("News card configuration", () => {
  test("every card has a unique ID", () => {
    const ids = newsCards.map((card) => card.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  test("every card has required fields", () => {
    newsCards.forEach((card) => {
      expect(card.id).toEqual(expect.any(String));
      expect(card.titleKey).toEqual(expect.any(String));
      expect(card.descriptionKey).toEqual(expect.any(String));
      expect(card.image).toEqual(expect.any(String));
      expect(card.titleLinks).toEqual(expect.any(Object));
    });
  });

  test("every card has valid English translation keys", () => {
    newsCards.forEach((card) => {
      expect(english[card.titleKey]).toBeTruthy();
      expect(english[card.descriptionKey]).toBeTruthy();
    });
  });

  test("every local image exists in public/news", () => {
    newsCards.forEach((card) => {
      if (!card.image.startsWith("/news/")) return;

      const filename = decodeURIComponent(
        card.image.substring("/news/".length),
      );

      const imagePath = path.join(
        path.resolve("."),
        "public",
        "news",
        filename,
      );

      expect(fs.existsSync(imagePath)).toBe(true);
    });
  });

  test("all configured hyperlinks use HTTPS", () => {
    newsCards.forEach((card) => {
      Object.entries(card.titleLinks).forEach(([name, url]) => {
        expect(name.trim().length).toBeGreaterThan(0);
        expect(url).toMatch(/^https:\/\//);
      });
    });
  });
});
