import { render, screen } from "@testing-library/react";
import i18next from "i18next";
import { I18nextProvider } from "react-i18next";
import NewsLinkedText from "./NewsLinkedText";

jest.unmock("react-i18next");

const translations = {
  en: {
    news: {
      TEST_TITLE: "Our CEO met <person/> at an event.",
    },
  },
  es: {
    news: {
      TEST_TITLE: "Nuestro CEO se reunió con <person/> en un evento.",
    },
  },
};

const links = {
  person: {
    text: "Jensen Huang",
    url: "https://www.linkedin.com/in/jenhsunhuang/",
  },
};

async function renderWithLanguage(language) {
  const instance = i18next.createInstance();

  await instance.init({
    lng: language,
    fallbackLng: "en",
    resources: translations,
    defaultNS: "news",
    ns: ["news"],
    interpolation: { escapeValue: false },
    react: { useSuspense: false },
  });

  return render(
    <I18nextProvider i18n={instance}>
      <NewsLinkedText translationKey="TEST_TITLE" links={links} />
    </I18nextProvider>,
  );
}

describe("NewsLinkedText", () => {
  test("renders an English sentence with a clickable name", async () => {
    await renderWithLanguage("en");

    const link = screen.getByRole("link", { name: "Jensen Huang" });

    expect(link.getAttribute("href")).toBe(links.person.url);
    expect(link.getAttribute("target")).toBe("_blank");
    expect(link.getAttribute("rel")).toBe("noopener noreferrer");
  });

  test("preserves the original name in Spanish", async () => {
    await renderWithLanguage("es");

    expect(screen.getByText(/Nuestro CEO se reunió con/)).toBeTruthy();
    expect(screen.getByRole("link", { name: "Jensen Huang" })).toBeTruthy();
    expect(screen.getAllByRole("link", { name: "Jensen Huang" })).toHaveLength(
      1,
    );
  });
});
