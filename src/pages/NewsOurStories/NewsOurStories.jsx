import React from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "./NewsOurStories.css";

/* Images (WEBP) */
import seventeenMileWalk from "../../assets/news_our_stories/17_Mile_walk.webp";
import withAmitZavery from "../../assets/news_our_stories/AmitZavery.webp";
import communityUpliftment from "../../assets/news_our_stories/community_upliftment.webp";
import indianConsular from "../../assets/news_our_stories/Indian_Consular.webp";
import withJensen from "../../assets/news_our_stories/Jensen_CEO_NVIDIA.webp";
import withMadhusudhanSai from "../../assets/news_our_stories/MadhusudhanSai.webp";
import withMuralidharan from "../../assets/news_our_stories/Muralidharan.webp";
import withVishalSikka from "../../assets/news_our_stories/VishalSikka.webp";

const stories = [
  {
    date: "05/02/2025",
    title: "With Jensen Huang, CEO of NVIDIA",
    image: withJensen,
    description:
      "A meaningful interaction with Jensen Huang, discussing technology leadership, innovation, and the future of mission-driven platforms.",
    link: "#",
  },
  {
    date: "05/02/2025",
    title: "With Vishal Sikka – Former CEO of Infosys",
    image: withVishalSikka,
    description:
      "An insightful exchange with Vishal Sikka on leadership, purpose-driven innovation, and building organizations that create long-term impact.",
    link: "#",
  },
  {
    date: "05/02/2025",
    title: "In Step with the Community: A 17-Mile Walk in San Ramon",
    image: seventeenMileWalk,
    description:
      "Our CEO and Sateesh Mucharla participated in a 17-mile walk through San Ramon, California, championing wellness, unity, and public service.",
    link: "#",
  },
  {
    date: "05/02/2025",
    title: "With Indian Consular",
    image: indianConsular,
    description:
      "A moment with the Indian Consular team during a community engagement event.",
    link: "#",
  },
  {
    date: "05/02/2025",
    title: "With Amit Zavery – IIT Bay Area",
    image: withAmitZavery,
    description:
      "Interaction during the IIT Bay Area Conference discussing leadership, innovation, and community impact.",
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
        <div className="news-grid">
          {stories.map((story) => (
            <div key={story.title} className="news-card">
              <div className="news-img-wrap">
                <img src={story.image} alt={story.title} className="news-img" />
              </div>

              <div className="news-card-body">
                <div className="news-date">{story.date}</div>
                <h2 className="news-title">{t(story.title)}</h2>
                <p className="news-desc">{t(story.description)}</p>

                {/* optional Read More */}
                {story.link && story.link !== "#" && (
                  <a
                    href={story.link}
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
