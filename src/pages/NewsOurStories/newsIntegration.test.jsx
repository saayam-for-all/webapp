import { fireEvent, render, screen, within } from "@testing-library/react";
import i18next from "i18next";
import { I18nextProvider } from "react-i18next";
import NewsOurStories from "./NewsOurStories";
import newsCards from "./newsCards.json";

jest.unmock("react-i18next");

jest.mock("react-router-dom", () => {
  const PropTypes = jest.requireActual("prop-types");

  const MockLink = ({ children, to, ...props }) => (
    <a href={to} {...props}>
      {children}
    </a>
  );

  MockLink.propTypes = {
    children: PropTypes.node,
    to: PropTypes.string.isRequired,
  };

  return { Link: MockLink };
});

describe("News page JSON integration", () => {
  const testCard = {
    id: "integration_test",
    titleKey: "INTEGRATION_TEST_TITLE",
    descriptionKey: "INTEGRATION_TEST_DESC",
    image: "/news/test.webp",
    links: {
      person: {
        text: "Jensen Huang",
        url: "https://www.linkedin.com/in/jenhsunhuang/",
      },
    },
  };

  afterEach(() => {
    for (let index = newsCards.length - 1; index >= 0; index--) {
      if (
        newsCards[index].id === testCard.id ||
        newsCards[index].id.startsWith("integration_batch_")
      ) {
        newsCards.splice(index, 1);
      }
    }
  });

  test("renders JSON-configured hyperlinks with untranslated names", async () => {
    newsCards.push(testCard);

    const instance = i18next.createInstance();

    await instance.init({
      lng: "es",
      fallbackLng: "en",
      defaultNS: "news",
      ns: ["news"],
      resources: {
        es: {
          news: {
            PAGINATION_PAGE: "Page {{page}}",
            INTEGRATION_TEST_TITLE:
              "Nuestro CEO se reunió con <person/> en un evento.",
            INTEGRATION_TEST_DESC: "Una conversación importante con <person/>.",
          },
        },
      },
      interpolation: { escapeValue: false },
      react: { useSuspense: false },
    });

    const { container } = render(
      <I18nextProvider i18n={instance}>
        <NewsOurStories />
      </I18nextProvider>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Page 2" }));

    const cards = Array.from(container.querySelectorAll(".news-card"));

    const card = cards.find((element) =>
      element.textContent.includes("Nuestro CEO se reunió con"),
    );

    expect(card).toBeTruthy();

    const links = within(card).getAllByRole("link", {
      name: "Jensen Huang",
    });

    expect(links).toHaveLength(2);

    links.forEach((link) => {
      expect(link.getAttribute("href")).toBe(testCard.links.person.url);
    });

    expect(screen.getByText(/Nuestro CEO se reunió con/)).toBeTruthy();
  });

  test("renders five new JSON cards at the top without component changes", async () => {
    const instance = i18next.createInstance();
    const translations = { PAGINATION_PAGE: "Page {{page}}" };

    const newCards = Array.from({ length: 5 }, (_, index) => {
      const number = index + 1;
      const titleKey = `INTEGRATION_BATCH_${number}_TITLE`;
      const descriptionKey = `INTEGRATION_BATCH_${number}_DESC`;

      translations[titleKey] = `New story ${number} with <person/>`;
      translations[descriptionKey] =
        `Description ${number} featuring <person/>`;

      return {
        id: `integration_batch_${number}`,
        date: "11/17/2026",
        titleKey,
        descriptionKey,
        image: "/news/Jensen_CEO_NVIDIA.webp",
        links: {
          person: {
            text: "Jensen Huang",
            url: "https://www.linkedin.com/in/jenhsunhuang/",
          },
        },
      };
    });

    await instance.init({
      lng: "en",
      fallbackLng: "en",
      defaultNS: "news",
      ns: ["news"],
      resources: {
        en: { news: translations },
      },
      interpolation: { escapeValue: false },
      react: { useSuspense: false },
    });

    newsCards.unshift(...newCards);

    const { container } = render(
      <I18nextProvider i18n={instance}>
        <NewsOurStories />
      </I18nextProvider>,
    );

    const renderedCards = Array.from(container.querySelectorAll(".news-card"));

    expect(renderedCards).toHaveLength(6);

    newCards.forEach((newCard, index) => {
      const card = renderedCards[index];

      expect(card.textContent).toContain(`New story ${index + 1}`);
      expect(card.textContent).toContain(`Description ${index + 1}`);

      const links = within(card).getAllByRole("link", {
        name: "Jensen Huang",
      });

      expect(links).toHaveLength(2);

      links.forEach((link) => {
        expect(link.getAttribute("href")).toBe(newCard.links.person.url);
      });
    });

    expect(renderedCards[5].textContent).toContain("ARIA_UNIVERSITY_TITLE");

    fireEvent.click(screen.getByRole("button", { name: "Page 2" }));

    const secondPageCards = container.querySelectorAll(".news-card");
    expect(secondPageCards).toHaveLength(6);
    expect(secondPageCards[0].textContent).toContain("WALMART_TITLE");

    fireEvent.click(screen.getByRole("button", { name: "Page 3" }));

    const thirdPageCards = container.querySelectorAll(".news-card");
    expect(thirdPageCards).toHaveLength(4);
    expect(thirdPageCards[3].textContent).toContain("JIMMY_PANETTA_TITLE");
  });
});
