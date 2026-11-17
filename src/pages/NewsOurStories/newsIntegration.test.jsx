import { render, screen, within } from "@testing-library/react";
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
    const index = newsCards.findIndex((card) => card.id === testCard.id);

    if (index !== -1) {
      newsCards.splice(index, 1);
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
});
