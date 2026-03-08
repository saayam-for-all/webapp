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

export default function NewsOurStories() {
  const { t } = useTranslation("news");
  const navigate = useNavigate();

  const storiesData = t("STORIES", { returnObjects: true });
  /**
   * Stories data comes from news.json.
   * Note:
   * Only the Titan 100 story currently contains a readMoreLink.
   * The "Read More" button renders only when this field exists.
  */

  const images = {
    ramesh_maturu: withRameshMaturu,
    jensen_huang: withJensen,
    vishal_sikka: withVishalSikka,
    ramesh_ramana: leisuewithproductivity,
    san_ramon_walk: seventeenMileWalk,
    srikar_reddy_koppula: indianConsular,
    amit_zavery: withAmitZavery,
    madhusudhan_sai: withMadhusudhanSai,
    murali_krishnamurthy: withMuralidharan,
    jimmy_panetta_domingo_candelas: withJimmyPanettaandDomingoCandelas,
  };

  const stories = Object.entries(storiesData).map(([key, story]) => ({
    ...story,
    image: images[key],
  }));

  return (
    <div className="news-our-stories-container px-4 md:px-0">
      <section className="news-our-stories-hero">
        <h1 className="news-our-stories-title">{t("PAGE_TITLE")}</h1>
        <p className="news-our-stories-subtitle">
          {t("HERO_SUBTITLE")}
        </p>
        <p className="news-our-stories-desc">
          {t("HERO_DESCRIPTION")}
        </p>
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
                  {renderLinkedTitle(story.title, story.titleLinks)}
                </h2>

                <p className="news-desc">
                  {renderLinkedTitle(story.description, story.titleLinks)}
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
        <p className="text-base mb-8">
          {t(
            "JOIN_DESCRIPTION",
          )}
        </p>
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
