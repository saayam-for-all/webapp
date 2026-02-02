import React from "react";
import { useNavigate } from "react-router-dom";
import "./NewsOurStories.css";
import { useTranslation } from "react-i18next";

// ✅ Existing images (DO NOT DELETE)
import seventeenMileWalk from "../../assets/news_our_stories/17_Mile_walk.webp";
import communityUpliftment from "../../assets/news_our_stories/community_upliftment.webp";
import tieCon from "../../assets/news_our_stories/tie_con.webp";

// ✅ New images you downloaded (kept separately, not removing anything)
import indianConsular from "../../assets/news_our_stories/indian-consular.jpeg";
import withAmitZavery from "../../assets/news_our_stories/with_Amit_Zavery_from_IIT_Bay_Area_Conference.jpeg";
import withJensen from "../../assets/news_our_stories/with-jensen.jpeg";
import withMadhusudhanSai from "../../assets/news_our_stories/With_Madhusudhan_Sai.jpeg";
import withMuralidharan from "../../assets/news_our_stories/With_Muralidharan_CEO_of_Sankara_Eye_Foundation.jpeg";
import withVishalSikka from "../../assets/news_our_stories/with-vishal-sikka.jpeg";

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

// ✅ This is like “Our Team” page style: image + text under it
const inTheNewsGallery = [
  {
    image: indianConsular,
    caption: "With Indian Consular in San Francisco, CA",
  },
  {
    image: withAmitZavery,
    caption: "With Amit Zavery (IIT Bay Area Conference)",
  },
  {
    image: withJensen,
    caption: "With Jensen (CEO of NVIDIA)",
  },
  {
    image: withMadhusudhanSai,
    caption: "With Sri Madhusudhan Sai",
  },
  {
    image: withMuralidharan,
    caption: "With Muralidharan (CEO, Sankara Eye Foundation)",
  },
  {
    image: withVishalSikka,
    caption: "With Vishal Sikka (ex CEO, Infosys)",
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

      {/* ✅ Gallery Section (Our Team style) */}
      <section className="news-our-stories-section">
        <h2
          className="news-our-stories-story-title"
          style={{ marginBottom: "18px" }}
        >
          {t("In The News")}
        </h2>

        <div className="flex flex-wrap justify-center gap-10">
          {inTheNewsGallery.map((item, index) => (
            <div key={index} className="w-[180px] text-center">
              <div className="w-[200px] h-[140px] overflow-hidden rounded-lg mx-auto">
                <img
                  src={item.image}
                  alt={item.caption}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="font-semibold text-sm mt-3 text-left pl-1">
                {t(item.caption)}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Stories Section (your existing layout kept) */}
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

        {/* Next two stories */}
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
