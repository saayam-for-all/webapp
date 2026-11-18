import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import newsStories from "./newsStories.json";
import "./NewsOurStories.css";

/* Images (WEBP) */
import seventeenMileWalk from "../../assets/news_our_stories/17_Mile_walk.webp";
import withAmitZavery from "../../assets/news_our_stories/AmitZavery.webp";
import indianConsular from "../../assets/news_our_stories/Indian_Consular.webp";
import withJensen from "../../assets/news_our_stories/Jensen_CEO_NVIDIA.webp";
import withMadhusudhanSai from "../../assets/news_our_stories/MadhusudhanSai.webp";
import withMuralidharan from "../../assets/news_our_stories/Muralidharan.webp";
import withVishalSikka from "../../assets/news_our_stories/VishalSikka.webp";
import withJimmyPanettaandDomingoCandelas from "../../assets/news_our_stories/Jimmy Panetta and Domingo Candelas.webp";
import leisuewithproductivity from "../../assets/news_our_stories/RameshMaturuAndRamanaYerneni.webp";
import withRajaKandRaoC from "../../assets/news_our_stories/withRajaKandRaoC_SiliconAndhra.webp";
import walmartSparkGood from "../../assets/news_our_stories/walmart_spark_good.webp";

// Rao Bhethanabotla's LinkedIn
const RAO_LINKEDIN = "https://www.linkedin.com/in/raobhethanabotla";

/**
 * "Our CEO" across the 10 supported languages.
 * Only the CEO role token is hyperlinked to Rao's LinkedIn.
 */
const OUR_CEO_PHRASES = [
  { phrase: "Our CEO", token: "CEO" },
  { phrase: "Nuestro CEO", token: "CEO" },
  { phrase: "Notre PDG", token: "PDG" },
  { phrase: "Unser CEO", token: "CEO" },
  { phrase: "Nosso CEO", token: "CEO" },
  {
    phrase: "Наш генеральный директор",
    token: "генеральный директор",
  },
  {
    phrase: "我们的首席执行官",
    token: "首席执行官",
  },
  { phrase: "我们的CEO", token: "CEO" },
  { phrase: "हमारे सीईओ", token: "सीईओ" },
  { phrase: "हमारे CEO", token: "CEO" },
  { phrase: "మా CEO", token: "CEO" },
  { phrase: "আমাদের সিইও", token: "সিইও" },
  { phrase: "আমাদের CEO", token: "CEO" },
];

/**
 * Renders translated text while hyperlinking specific names
 * and organizations.
 */
function renderLinkedTitle(title, linksMap, linkClassName = "news-name-link") {
  const nameLinks = linksMap || {};

  const ceoByPhrase = Object.fromEntries(
    OUR_CEO_PHRASES.map((item) => [item.phrase, item]),
  );

  const keys = [
    ...Object.keys(nameLinks).filter(Boolean),
    ...Object.keys(ceoByPhrase),
  ].sort((a, b) => b.length - a.length);

  if (keys.length === 0) return title;

  const escaped = keys.map((key) => key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));

  const regex = new RegExp(`(${escaped.join("|")})`, "g");

  return title.split(regex).map((part, index) => {
    // Special handling for "Our CEO" and its translations.
    const ceo = ceoByPhrase[part];

    if (ceo) {
      const position = part.indexOf(ceo.token);

      return (
        <React.Fragment key={`ceo-${index}`}>
          {part.slice(0, position)}

          <a
            href={RAO_LINKEDIN}
            target="_blank"
            rel="noopener noreferrer"
            className={linkClassName}
          >
            {ceo.token}
          </a>

          {part.slice(position + ceo.token.length)}
        </React.Fragment>
      );
    }

    // Hyperlink names and organizations.
    const href = nameLinks[part];

    if (href) {
      return (
        <a
          key={`${part}-${index}`}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={linkClassName}
        >
          {part}
        </a>
      );
    }

    return <React.Fragment key={`text-${index}`}>{part}</React.Fragment>;
  });
}

/**
 * Maps image identifiers from newsStories.json
 * to the actual imported image assets.
 */
const newsImages = {
  seventeenMileWalk,
  withAmitZavery,
  indianConsular,
  withJensen,
  withMadhusudhanSai,
  withMuralidharan,
  withVishalSikka,
  withJimmyPanettaandDomingoCandelas,
  leisuewithproductivity,
  withRajaKandRaoC,
  walmartSparkGood,
};

/**
 * Dynamically builds news stories using JSON data.
 */
const stories = newsStories.map((story) => ({
  ...story,
  image: newsImages[story.image],
  title: story.titleKey,
  description: story.descriptionKey,
  titleLinks: story.links,
}));

export default function NewsOurStories() {
  const { t } = useTranslation(["news"]);

  return (
    <div className="news-our-stories-container px-4 md:px-0">
      <section className="news-our-stories-hero">
        <h1 className="news-our-stories-title">{t("TITLE")}</h1>

        <p className="news-our-stories-subtitle">{t("SUBTITLE")}</p>

        <p className="news-our-stories-desc">{t("DESCRIPTION")}</p>
      </section>

      <section className="news-our-stories-section">
        <div className="news-grid">
          {stories.map((story) => (
            <div key={story.id} className="news-card">
              <div className="news-img-wrap">
                <img
                  src={story.image}
                  alt={t(story.title)}
                  className="news-img"
                />
              </div>

              <div className="news-card-body">
                {/* Date is currently hidden */}
                {/* <div className="news-date">{story.date}</div> */}

                <h2 className="news-title">
                  {renderLinkedTitle(t(story.title), story.titleLinks)}
                </h2>

                <p className="news-desc">
                  {renderLinkedTitle(t(story.description), story.titleLinks)}
                </p>

                {/* Read more only when a valid link exists */}
                {story.readMoreLink && story.readMoreLink !== "#" && (
                  <a
                    href={story.readMoreLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="news-link"
                  >
                    {t("READ_MORE")}
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="text-center mt-16 mb-16">
        <h2 className="text-3xl font-bold mb-4">{t("JOIN_TITLE")}</h2>

        <p className="text-base mb-8">{t("JOIN_BODY")}</p>

        <Link
          to="/contact"
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-full inline-block"
        >
          {t("JOIN_BUTTON")}
        </Link>
      </div>
    </div>
  );
}
