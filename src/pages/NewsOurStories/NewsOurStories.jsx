import React from "react";
import { useNavigate } from "react-router-dom";
import "./NewsOurStories.css";
import { useTranslation } from "react-i18next";

/* ✅ EXACT FILENAMES from src/assets/news_our_stories (DO NOT CHANGE) */
import communityupliftment from "../../assets/news_our_stories/communityupliftment.webp";
import indianConsular from "../../assets/news_our_stories/indian-consular.jpeg";
import seventeenMileWalk from "../../assets/news_our_stories/seventeenMileWalk.webp";
import withAmitZavery from "../../assets/news_our_stories/with_Amit_Zavery_from_IIT_Bay_Area_Conference.jpeg";
import withMadhusudhanSai from "../../assets/news_our_stories/With_Madhusudhan_Sai.jpeg";
import withMuralidharan from "../../assets/news_our_stories/With_Muralidharan_CEO_of_Sankara_Eye_Foundation.jpeg";
import withJensen from "../../assets/news_our_stories/with-jensen.jpeg";
import withVishalSikka from "../../assets/news_our_stories/with-vishal-sikka.jpeg";

const stories = [
  {
    date: "05/02/2025",
    title:
      "Saayam x Sri Madhusudan Sai: Collaboration for Community Upliftment",
    image: communityupliftment,
    description:
      "Saayam is proud to collaborate with Sri Madhusudan Sai, a global humanitarian known for his work in healthcare, education, and rural upliftment. This partnership strengthens our shared commitment to serving communities with compassion, integrity, and purpose.",
    link: "#",
  },
  {
    date: "05/02/2025",
    title: "In Step with the Community: A 17-Mile Walk in San Ramon",
    image: seventeenMileWalk,
    description:
      "Our CEO and Sateesh Mucharla recently participated in a 17-mile walk through San Ramon, California, championing wellness, unity, and public service. Their commitment to engaging with the local community exemplifies Saayam's mission of stepping forward—both literally and figuratively—for meaningful impact.",
    link: "#",
  },

  /* ✅ New / extra images (keep them, you can edit text later) */
  {
    date: "05/02/2025",
    title: "With Indian Consular in San Francisco, CA",
    image: indianConsular,
    description:
      "A moment with the Indian Consular team during a community engagement event in the Bay Area.",
    link: "#",
  },
  {
    date: "05/02/2025",
    title: "With Amit Zavery from IIT Bay Area Conference",
    image: withAmitZavery,
    description:
      "Interaction during the IIT Bay Area Conference, discussing leadership, innovation, and community impact.",
    link: "#",
  },
  {
    date: "05/02/2025",
    title: "With Madhusudhan Sai",
    image: withMadhusudhanSai,
    description:
      "A meaningful meeting highlighting values of service, compassion, and purpose-driven initiatives.",
    link: "#",
  },
  {
    date: "05/02/2025",
    title: "With Muralidharan – CEO of Sankara Eye Foundation",
    image: withMuralidharan,
    description:
      "Discussion on social impact, healthcare accessibility, and collaborations that uplift communities.",
    link: "#",
  },
  {
    date: "05/02/2025",
    title: "With Jensen",
    image: withJensen,
    description:
      "A conversation on technology, leadership, and building mission-driven initiatives.",
    link: "#",
  },
  {
    date: "05/02/2025",
    title: "With Vishal Sikka – ex CEO of Infosys",
    image: withVishalSikka,
    description:
      "Interaction with Vishal Sikka, sharing perspectives on leadership and purpose-driven innovation.",
    link: "#",
  },
];

export default function NewsOurStories() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="news-our-stories-container px-4 md:px-0">
      {/* Hero Section */}
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

      {/* ✅ 3-per-row grid */}
      <section className="news-our-stories-grid">
        {stories.map((story) => (
          <div key={story.title} className="news-story-card">
            <div className="news-story-imageWrap">
              <img
                src={story.image}
                alt={story.title}
                className="news-story-img"
              />
            </div>

            <div className="news-story-date">{story.date}</div>

            <h2 className="news-story-title">{t(story.title)}</h2>

            <p className="news-story-desc">{t(story.description)}</p>

            <a href={story.link} className="news-story-link">
              {t("Read More")}
            </a>
          </div>
        ))}
      </section>

      {/* Call to Action Section */}
      <section className="news-our-stories-cta">
        <h2 className="news-our-stories-cta-title">{t("Want to join us?")}</h2>
        <p className="news-our-stories-cta-desc">
          {t(
            "Chat with our community and get in touch with different charity organizations!",
          )}
        </p>
        <button
          className="news-our-stories-cta-btn"
          onClick={() => navigate("/contact")}
        >
          {t("Join the community")}
        </button>
      </section>
    </div>
  );
}
