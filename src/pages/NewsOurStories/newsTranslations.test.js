import english from "../../common/i18n/locales/en/news.json";
import arabic from "../../common/i18n/locales/ar/news.json";
import urdu from "../../common/i18n/locales/ur/news.json";

describe("News page translations", () => {
  const translations = [
    ["Arabic", arabic],
    ["Urdu", urdu],
  ];

  test.each(translations)("%s contains every English news key", (_, locale) => {
    expect(Object.keys(locale).sort()).toEqual(Object.keys(english).sort());
  });

  test.each(translations)("%s contains no empty translations", (_, locale) => {
    Object.values(locale).forEach((value) => {
      expect(typeof value).toBe("string");
      expect(value.trim().length).toBeGreaterThan(0);
    });
  });

  test("Arabic uses the expected CEO and consular phrases", () => {
    expect(arabic.STORY_1_TITLE).toContain("رئيسنا التنفيذي");
    expect(arabic.STORY_7_TITLE).toContain("القنصل الهندي");
    expect(arabic.STORY_7_DESC).toContain("الفريق القنصلي الهندي");
  });

  test("Urdu uses the expected CEO and consular phrases", () => {
    expect(urdu.STORY_1_TITLE).toContain("ہمارے CEO");
    expect(urdu.STORY_7_TITLE).toContain("بھارتی قونصل");
    expect(urdu.STORY_7_DESC).toContain("بھارتی قونصلر ٹیم");
  });
});
