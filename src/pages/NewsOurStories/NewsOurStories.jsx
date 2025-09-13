import React from "react";
import seventeenMileWalk from "../../assets/news_our_stoires/17_Mile_walk.png";
import communityUpliftment from "../../assets/news_our_stoires/community_upliftment.png";
import tieCon from "../../assets/news_our_stoires/tie_con.png";
import { useNavigate } from "react-router-dom";
import "./NewsOurStories.css";
import { useTranslation } from "react-i18next";

const stories = [
  {
    date: "05/02/2025",
    title: "Saayam for All CEO Represents at TiEcon AiVerse 2025, Santa Clara",
    image: tieCon,
    description:
      "Our CEO, Rao K Bhehanabobla recently attended TiEcon 2025 at the Santa Clara Convention Center, one of the premier global gatherings for entrepreneurs and innovators. He shared Saayam's journey in leveraging technology to build a support-driven community platform. The event spotlighted Saayam's mission and growing influence in the social impact ecosystem.",
    link: "#",
  },
  {
    date: "05/02/2025",
    title:
      "Saayam x Sri Madhusudan Sai: Collaboration for Community Upliftment",
    image: communityUpliftment,
    description:
      "Saayam is proud to collaborate with Sri Madhusudan Sai, a global humanitarian known for his work in healthcare, education, and rural upliftment. This partnership strengthens our shared commitment to serving communities with compassion, integrity, and purpose.",
    link: "#",
  },
  {
    date: "05/02/2025",
    title: "In Step with the Community: A 17-Mile Walk in San Ramon",
    image: seventeenMileWalk,
    description:
      "Our CEO and Satesth Mudrala recently participated in a 17-mile walk through San Ramon, California, championing wellness, unity, and public service. Their commitment to engaging with the local community exemplifies Saayam's mission of stepping forward—both literally and figuratively—for meaningful impact.",
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

      {/* Stories Section */}
      <section className="news-our-stories-section">
        {/* First story: full width image and text */}
        <div className="news-our-stories-story">
          <img
            src={stories[0].image}
            alt={stories[0].title}
            className="news-our-stories-img-lg"
          />
          <div className="news-our-stories-date">{stories[0].date}</div>
          <h2 className="news-our-stories-story-title">
            {t(stories[0].title)}
          </h2>
          <p className="news-our-stories-story-desc">
            {t(stories[0].description)}
          </p>
          <a href={stories[0].link} className="news-our-stories-link">
            {t("Read More")}
          </a>
        </div>
        {/* Next two stories: two columns on desktop, stacked on mobile, no card effect */}
        <div className="news-our-stories-row">
          {stories.slice(1).map((story) => (
            <div key={story.title} className="news-our-stories-col">
              <img
                src={story.image}
                alt={story.title}
                className="news-our-stories-img-sm"
              />
              <div className="news-our-stories-date">{story.date}</div>
              <h2 className="news-our-stories-story-title">{t(story.title)}</h2>
              <p className="news-our-stories-story-desc">
                {t(story.description)}
              </p>
              <a href={story.link} className="news-our-stories-link">
                {t("Read More")}
              </a>
            </div>
          ))}
        </div>
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
