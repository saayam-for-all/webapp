import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import "./NewsOurStories.css";

import newsCards from "./newsCards.json";
import NewsLinkedText from "./NewsLinkedText";

// Rao Bhethanabotla's LinkedIn — linked from the word "CEO" in "Our CEO".
const RAO_LINKEDIN = "https://www.linkedin.com/in/raobhethanabotla";

/**
 * "Our CEO" across the 10 supported languages. Only the role token inside the
 * phrase (e.g. "CEO", "PDG") is hyperlinked to Rao's LinkedIn. Matching the
 * full phrase keeps unrelated CEO mentions (e.g. "CEO of NVIDIA") untouched.
 * Some languages have two forms of the role word, both are listed.
 */
const OUR_CEO_PHRASES = [
  { phrase: "Our CEO", token: "CEO" }, // en
  { phrase: "Nuestro CEO", token: "CEO" }, // es
  { phrase: "Notre PDG", token: "PDG" }, // fr
  { phrase: "Unser CEO", token: "CEO" }, // de
  { phrase: "Nosso CEO", token: "CEO" }, // pt
  { phrase: "Наш генеральный директор", token: "генеральный директор" }, // ru
  { phrase: "我们的首席执行官", token: "首席执行官" }, // zh
  { phrase: "我们的CEO", token: "CEO" }, // zh
  { phrase: "हमारे सीईओ", token: "सीईओ" }, // hi
  { phrase: "हमारे CEO", token: "CEO" }, // hi
  { phrase: "మా CEO", token: "CEO" }, // te
  { phrase: "আমাদের সিইও", token: "সিইও" }, // bn
  { phrase: "আমাদের CEO", token: "CEO" }, // bn
  { phrase: "رئيسنا التنفيذي", token: "رئيسنا التنفيذي" }, // ar
  { phrase: "ہمارے CEO", token: "CEO" }, // ur
];

/**
 * Renders a title string but hyperlinks specific words/names inside it.
 * Keeps original title order (so "With" stays first).
 */
function renderLinkedTitle(title, linksMap, linkClassName = "news-name-link") {
  const nameLinks = linksMap || {};
  const ceoByPhrase = Object.fromEntries(
    OUR_CEO_PHRASES.map((c) => [c.phrase, c]),
  );

  const keys = [
    ...Object.keys(nameLinks).filter(Boolean),
    ...Object.keys(ceoByPhrase),
  ].sort((a, b) => b.length - a.length); // longer first

  if (keys.length === 0) return title;

  const escaped = keys.map((k) => k.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  const regex = new RegExp(`(${escaped.join("|")})`, "g");

  return title.split(regex).map((part, idx) => {
    // "Our CEO" phrase: hyperlink only the role token inside it, leaving the
    // rest of the phrase (e.g. "Our ", "Notre ") as plain text.
    const ceo = ceoByPhrase[part];
    if (ceo) {
      const at = part.indexOf(ceo.token);
      return (
        <React.Fragment key={`ceo-${idx}`}>
          {part.slice(0, at)}
          <a
            href={RAO_LINKEDIN}
            target="_blank"
            rel="noopener noreferrer"
            className={linkClassName}
          >
            {ceo.token}
          </a>
          {part.slice(at + ceo.token.length)}
        </React.Fragment>
      );
    }

    const href = nameLinks[part];
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
  const { t, i18n } = useTranslation(["news"]);
  const language = (i18n.resolvedLanguage || i18n.language || "en").split(
    "-",
  )[0];
  const isRtl = ["ar", "ur"].includes(language);

  return (
    <div
      className="news-our-stories-container px-4 md:px-0"
      lang={language}
      dir={isRtl ? "rtl" : "ltr"}
    >
      <section className="news-our-stories-hero">
        <h1 className="news-our-stories-title">{t("TITLE")}</h1>
        <p className="news-our-stories-subtitle">{t("SUBTITLE")}</p>
        <p className="news-our-stories-desc">{t("DESCRIPTION")}</p>
      </section>

      <section className="news-our-stories-section">
        <div className="news-grid">
          {newsCards.map((story) => (
            <div key={story.id} className="news-card">
              <div className="news-img-wrap">
                <img
                  src={story.image}
                  alt={t(story.titleKey)}
                  className="news-img"
                />
              </div>

              <div className="news-card-body">
                {/* <div className="news-date">{story.date}</div> */}

                <h2 className="news-title">
                  {story.links ? (
                    <NewsLinkedText
                      translationKey={story.titleKey}
                      links={story.links}
                    />
                  ) : (
                    renderLinkedTitle(t(story.titleKey), story.titleLinks)
                  )}
                </h2>

                <p className="news-desc">
                  {story.links ? (
                    <NewsLinkedText
                      translationKey={story.descriptionKey}
                      links={story.links}
                    />
                  ) : (
                    renderLinkedTitle(t(story.descriptionKey), story.titleLinks)
                  )}
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
          to="/login"
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-full inline-block"
        >
          {t("JOIN_BUTTON")}
        </Link>
      </div>
    </div>
  );
}
