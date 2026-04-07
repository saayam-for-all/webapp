import React from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
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
import withRameshMaturu from "../../assets/news_our_stories/RameshMaturu.webp";
import leisuewithproductivity from "../../assets/news_our_stories/RameshMaturuAndRamanaYerneni.webp";

/**
 * Renders a title string but hyperlinks specific words/names inside it.
 * Keeps original title order (so "With" stays first).
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

const stories = [
  {
    date: "02/09/2026",
    title: "STORY_1_TITLE",
    image: withRameshMaturu,
    description: "STORY_1_DESC",
    titleLinks: {
      "Ramesh Maturu": "https://www.linkedin.com/in/rameshmaturu/",
      "Pyramid Consulting": "https://www.pyramidci.com/",
    },
    // ✅ Read more ONLY for this card (replace with exact article URL if needed)
    readMoreLink:
      "https://www.pyramidci.com/news/ramesh-maturu-named-to-the-2026-georgia-titan-100-list/",
  },
  {
    date: "05/02/2025",
    title: "STORY_2_TITLE",
    image: withJensen,
    description: "STORY_2_DESC",
    titleLinks: {
      "Jensen Huang": "https://www.linkedin.com/in/jenhsunhuang/",
      NVIDIA: "https://www.nvidia.com/",
    },
  },
  {
    date: "05/02/2025",
    title: "STORY_3_TITLE",
    image: withVishalSikka,
    description: "STORY_3_DESC",
    titleLinks: {
      "Vishal Sikka": "https://www.linkedin.com/in/vishal-sikka-869a6b2/",
      "Vianai Systems": "https://www.vian.ai/",
    },
  },
  {
    date: "02/09/2026",
    title: "STORY_4_TITLE",
    image: leisuewithproductivity,
    description: "STORY_4_DESC",
    titleLinks: {
      "Ramesh Maturu": "https://www.linkedin.com/in/rameshmaturu/",
      "Ramana Yerneni": "https://www.linkedin.com/in/ramanayerneni/",
      "Pyramid Consulting": "https://www.pyramidci.com/",
    },
  },
  {
    date: "05/02/2025",
    title: "STORY_5_TITLE",
    image: seventeenMileWalk,
    description: "STORY_5_DESC",
    titleLinks: {
      "Sateesh Mucharla": "https://www.linkedin.com/in/mucharla/",
    },
  },
  {
    date: "05/02/2025",
    title: "STORY_6_TITLE",
    image: indianConsular,
    description: "STORY_6_DESC",
    titleLinks: {
      "Dr. Srikar Reddy Koppula":
        "https://www.linkedin.com/in/srikar-reddy-koppula-b966aa293/",
      "Indian Consular": "https://www.cgisf.gov.in/",
    },
  },

  {
    date: "05/02/2025",
    title: "STORY_7_TITLE",
    image: withAmitZavery,
    description: "STORY_7_DESC",
    titleLinks: {
      "Amit Zavery": "https://www.linkedin.com/in/amitzavery/",
      ServiceNow: "https://www.servicenow.com/",
      Broadridge: "https://www.broadridge.com/",
    },
  },

  // ✅ Updated per Rao message:
  // - link BOTH person's LinkedIn + company URL
  // - add Anand Kuchibhotla (person on right side) + Aria University link
  {
    date: "05/02/2025",
    title: "STORY_8_TITLE",
    image: withMadhusudhanSai,
    description: "STORY_8_DESC",
    titleLinks: {
      "Madhusudhan Sai": "https://srimadhusudansai.com/",
      "Anand Kuchibhotla": "https://www.linkedin.com/in/anandkuchibhotla/",
      "Aria University": "https://www.aria.edu/",
    },
  },

  {
    date: "05/02/2025",
    title: "STORY_9_TITLE",
    image: withMuralidharan,
    description: "STORY_9_DESC",
    titleLinks: {
      "Murali Krishnamurthy":
        "https://www.linkedin.com/in/muralikrishnamurthy/",
      "Sankara Eye Foundation": "https://sankaraeye.com/",
    },
  },
  {
    date: "05/02/2025",
    title: "STORY_10_TITLE",
    image: withJimmyPanettaandDomingoCandelas,
    description: "STORY_10_DESC",
    titleLinks: {
      "Jimmy Panetta": "https://panetta.house.gov/",
      "Domingo Candelas": "https://www.domingocandelas.com/",
      "San José": "https://www.sanjoseca.gov/",
    },
  },
];

export default function NewsOurStories() {
  const { t } = useTranslation(["news"]);
  const navigate = useNavigate();

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
            <div key={story.title} className="news-card">
              <div className="news-img-wrap">
                <img src={story.image} alt={story.title} className="news-img" />
              </div>

              <div className="news-card-body">
                <div className="news-date">{story.date}</div>

                <h2 className="news-title">
                  {renderLinkedTitle(t(story.title), story.titleLinks)}
                </h2>

                <p className="news-desc">
                  {renderLinkedTitle(t(story.description), story.titleLinks)}
                </p>

                {/* ✅ Read more ONLY when readMoreLink is provided (Titan news only) */}
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
