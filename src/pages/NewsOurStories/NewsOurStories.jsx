import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import "./NewsOurStories.css";

/* Images */
import rajaKrishnamoorthi from "../../assets/news_our_stories/RajaKrishnamoorthi.jpeg";
import walmartSparkGood from "../../assets/news_our_stories/WalmartSparkGood.jpg";
import seventeenMileWalk from "../../assets/news_our_stories/17_Mile_walk.webp";
import withAmitZavery from "../../assets/news_our_stories/AmitZavery.webp";
import indianConsular from "../../assets/news_our_stories/Indian_Consular.webp";
import withJensen from "../../assets/news_our_stories/Jensen_CEO_NVIDIA.webp";
import withMadhusudhanSai from "../../assets/news_our_stories/MadhusudhanSai.webp";
import withMuralidharan from "../../assets/news_our_stories/Muralidharan.webp";
import withVishalSikka from "../../assets/news_our_stories/VishalSikka.webp";
import withJimmyPanettaandDomingoCandelas from "../../assets/news_our_stories/Jimmy Panetta and Domingo Candelas.webp";
import leisuewithproductivity from "../../assets/news_our_stories/RameshMaturuAndRamanaYerneni.webp";

/**
 * Renders a title string but hyperlinks specific words/names inside it.
 * Keeps original title order (so "With" stays first).
 *
 * NOTE: matching is by literal substring, so the names in `titleLinks` must
 * appear verbatim in the translated string. Translations therefore keep people
 * and organisation names in Latin script.
 */
function renderLinkedTitle(title, linksMap, linkClassName = "news-name-link") {
  if (!linksMap || Object.keys(linksMap).length === 0) return title;

  const keys = Object.keys(linksMap)
    .filter(Boolean)
    .sort((a, b) => b.length - a.length); // longer first

  if (keys.length === 0) return title;

  const escaped = keys.map((k) => k.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  const regex = new RegExp(`(${escaped.join("|")})`, "g");

  return title.split(regex).map((part, idx) => {
    const href = linksMap[part];
    if (href) {
      return (
        <a
          key={`${part}-${idx}`}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={linkClassName}
        >
          {part}
        </a>
      );
    }
    return <React.Fragment key={`${part}-${idx}`}>{part}</React.Fragment>;
  });
}

/**
 * Structural data only. Copy lives in the `news` i18n namespace as
 * STORY_<n>_TITLE / STORY_<n>_DESC so it can be translated per locale.
 */
const storyMeta = [
  {
    id: 1,
    image: rajaKrishnamoorthi,
    titleLinks: {
      "Raja Krishnamoorthi":
        "https://en.wikipedia.org/wiki/Raja_Krishnamoorthi",
      "Rao Charagondla": "https://www.linkedin.com/in/charagondla/",
    },
  },
  {
    id: 2,
    image: walmartSparkGood,
    titleLinks: {},
  },
  {
    id: 3,
    date: "05/02/2025",
    image: withJensen,
    titleLinks: {
      "Jensen Huang": "https://www.linkedin.com/in/jenhsunhuang/",
      NVIDIA: "https://www.nvidia.com/",
    },
  },
  {
    id: 4,
    date: "05/02/2025",
    image: withVishalSikka,
    titleLinks: {
      "Vishal Sikka": "https://www.linkedin.com/in/vishal-sikka-869a6b2/",
      "Vianai Systems": "https://www.vian.ai/",
    },
  },
  {
    id: 5,
    date: "02/09/2026",
    image: leisuewithproductivity,
    titleLinks: {
      "Ramesh Maturu": "https://www.linkedin.com/in/rameshmaturu/",
      "Ramana Yerneni": "https://www.linkedin.com/in/ramanayerneni/",
      "Pyramid Consulting": "https://www.pyramidci.com/",
    },
  },
  {
    id: 6,
    date: "05/02/2025",
    image: seventeenMileWalk,
    titleLinks: {
      "Sateesh Mucharla": "https://www.linkedin.com/in/mucharla/",
    },
  },
  {
    id: 7,
    date: "05/02/2025",
    image: indianConsular,
    titleLinks: {
      "Dr. Srikar Reddy Koppula":
        "https://www.linkedin.com/in/srikar-reddy-koppula-b966aa293/",
      "Indian Consular": "https://www.cgisf.gov.in/",
    },
  },
  {
    id: 8,
    date: "05/02/2025",
    image: withAmitZavery,
    titleLinks: {
      "Amit Zavery": "https://www.linkedin.com/in/amitzavery/",
      ServiceNow: "https://www.servicenow.com/",
      Broadridge: "https://www.broadridge.com/",
    },
  },
  {
    id: 9,
    date: "05/02/2025",
    image: withMadhusudhanSai,
    titleLinks: {
      "Madhusudhan Sai": "https://srimadhusudansai.com/",
      "Anand Kuchibhotla": "https://www.linkedin.com/in/anandkuchibhotla/",
      "Aria University": "https://www.aria.edu/",
    },
  },
  {
    id: 10,
    date: "05/02/2025",
    image: withMuralidharan,
    titleLinks: {
      "Murali Krishnamurthy":
        "https://www.linkedin.com/in/muralikrishnamurthy/",
      "Sankara Eye Foundation": "https://sankaraeye.com/",
    },
  },
  {
    id: 11,
    date: "05/02/2025",
    image: withJimmyPanettaandDomingoCandelas,
    titleLinks: {
      "Jimmy Panetta": "https://panetta.house.gov/",
      "Domingo Candelas": "https://www.domingocandelas.com/",
      "San José": "https://www.sanjoseca.gov/",
    },
  },
];

export default function NewsOurStories() {
  const { t } = useTranslation(["news", "translation"]);

  const stories = useMemo(
    () =>
      storyMeta.map((story) => ({
        ...story,
        title: t(`STORY_${story.id}_TITLE`),
        description: t(`STORY_${story.id}_DESC`),
      })),
    [t],
  );

  return (
    <div className="news-our-stories-container px-4 md:px-0">
      <section className="news-our-stories-hero">
        <h1 className="news-our-stories-title">{t("News: Our Stories")}</h1>
        <p className="news-our-stories-subtitle">
          {t(
            "Explore how Saayam for All is making headlines and gaining recognition for its work in uplifting communities, empowering volunteers, and building an inclusive support network.",
          )}
        </p>
        <p className="news-our-stories-desc">
          {t(
            "From local stories to national features, discover how our mission is resonating beyond the platform and into the world.",
          )}
        </p>
      </section>

      <section className="news-our-stories-section">
        <div className="news-grid">
          {stories.map((story) => (
            <div key={story.id} className="news-card">
              <div className="news-img-wrap">
                <img src={story.image} alt={story.title} className="news-img" />
              </div>

              <div className="news-card-body">
                {/* <div className="news-date">{story.date}</div> */}

                <h2 className="news-title">
                  {renderLinkedTitle(story.title, story.titleLinks)}
                </h2>

                <p className="news-desc">
                  {renderLinkedTitle(story.description, story.titleLinks)}
                </p>

                {story.readMoreLink && story.readMoreLink !== "#" && (
                  <a
                    href={story.readMoreLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="news-link"
                  >
                    {t("Read More")}
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="text-center mt-16 mb-16">
        <h2 className="text-3xl font-bold mb-4">{t("Want to join us?")}</h2>
        <p className="text-base mb-8">
          {t(
            "Chat with our community and get in touch with different charity organizations!",
          )}
        </p>
        <Link
          to="/contact"
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-full inline-block"
        >
          {t("Join the community")}
        </Link>
      </div>
    </div>
  );
}
