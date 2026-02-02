import React from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "./NewsOurStories.css";

/* Images */
import withJensen from "../../assets/news_our_stories/with-jensen.jpeg";
import withVishalSikka from "../../assets/news_our_stories/with-vishal-sikka.jpeg";
import seventeenMileWalk from "../../assets/news_our_stories/17_Mile_walk.webp";
import communityUpliftment from "../../assets/news_our_stories/community_upliftment.webp";
import indianConsular from "../../assets/news_our_stories/indian_consular.jpeg";
import withAmitZavery from "../../assets/news_our_stories/with_amit_zavery.jpeg";
import withMadhusudhanSai from "../../assets/news_our_stories/with_madhusudhan_sai.jpeg";
import withMuralidharan from "../../assets/news_our_stories/with_muralidharan.jpeg";

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
    title:
      "Saayam x Sri Madhusudan Sai: Collaboration for Community Upliftment",
    image: communityUpliftment,
    description:
      "A collaboration focused on compassion, service, and empowering communities through collective action.",
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
    title: "With Indian Consular in San Francisco, CA",
    image: indianConsular,
    description:
      "A moment with the Indian Consular team during a community engagement event in the Bay Area.",
    link: "#",
  },
  {
    date: "05/02/2025",
    title: "With Amit Zavery – IIT Bay Area Conference",
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
        {/* First story: featured */}
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
        </div>

        {/* Remaining stories */}
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
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
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
