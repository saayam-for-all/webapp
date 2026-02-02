import React from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "./NewsOurStories.css";

/* ✅ EXACT FILENAMES — DO NOT CHANGE */
import seventeenMileWalk from "../../assets/news_our_stories/seventeenMileWalk.webp";
import communityUpliftment from "../../assets/news_our_stories/communityupliftment.webp";
import tieCon from "../../assets/news_our_stories/tieCon.webp";

import indianConsular from "../../assets/news_our_stories/indian-consular.jpeg";
import withAmitZavery from "../../assets/news_our_stories/with_Amit_Zavery_from_IIT_Bay_Area_Conference.jpeg";
import withMadhusudhanSai from "../../assets/news_our_stories/With_Madhusudhan_Sai.jpeg";
import withMuralidharan from "../../assets/news_our_stories/With_Muralidharan_CEO_of_Sankara_Eye_Foundation.jpeg";
import withJensen from "../../assets/news_our_stories/with-jensen.jpeg";
import withVishalSikka from "../../assets/news_our_stories/with-vishal-sikka.jpeg";

/* ===============================
   STORIES DATA
   =============================== */
const stories = [
  {
    date: "05/02/2025",
    title: "Saayam for All CEO Represents at TiEcon AiVerse 2025, Santa Clara",
    image: tieCon,
    description:
      "Our CEO, Rao K Bhethanabotla, attended TiEcon 2025 at Santa Clara, engaging with global leaders and innovators while sharing Saayam’s mission and impact.",
    link: "#",
  },
  {
    date: "05/02/2025",
    title:
      "Saayam x Sri Madhusudan Sai: Collaboration for Community Upliftment",
    image: withMadhusudhanSai,
    description:
      "Saayam collaborated with Sri Madhusudan Sai to strengthen initiatives in healthcare, education, and rural upliftment.",
    link: "#",
  },
  {
    date: "05/02/2025",
    title: "Indian Consular Meet – San Francisco",
    image: indianConsular,
    description:
      "Saayam leadership met with the Indian Consulate in San Francisco to discuss community welfare and collaboration opportunities.",
    link: "#",
  },
  {
    date: "05/02/2025",
    title: "With Amit Zavery – IIT Bay Area Conference",
    image: withAmitZavery,
    description:
      "Saayam leadership with Amit Zavery at the IIT Bay Area Conference, exchanging insights on technology and social impact.",
    link: "#",
  },
  {
    date: "05/02/2025",
    title: "With Muralidharan – CEO, Sankara Eye Foundation",
    image: withMuralidharan,
    description:
      "A meaningful interaction with Muralidharan, CEO of Sankara Eye Foundation, exploring collaborations in healthcare outreach.",
    link: "#",
  },
  {
    date: "05/02/2025",
    title: "With Jensen – CEO of NVIDIA",
    image: withJensen,
    description:
      "A memorable moment with Jensen, CEO of NVIDIA, discussing innovation, leadership, and the role of technology in social good.",
    link: "#",
  },
  {
    date: "05/02/2025",
    title: "With Vishal Sikka – ex CEO of Infosys",
    image: withVishalSikka,
    description:
      "Interaction with Vishal Sikka, former CEO of Infosys, sharing perspectives on leadership and purpose-driven innovation.",
    link: "#",
  },
  {
    date: "05/02/2025",
    title: "In Step with the Community: A 17-Mile Walk",
    image: seventeenMileWalk,
    description:
      "Our leadership participated in a 17-mile community walk promoting wellness, unity, and service.",
    link: "#",
  },
  {
    date: "05/02/2025",
    title: "Community Upliftment Initiatives",
    image: communityUpliftment,
    description:
      "Saayam continues to drive impactful community upliftment programs through collaboration and grassroots engagement.",
    link: "#",
  },
];

export default function NewsOurStories() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="news-our-stories-container px-4 md:px-0">
      {/* HERO */}
      <section className="news-our-stories-hero">
        <h1 className="news-our-stories-title">{t("News: Our Stories")}</h1>
        <p className="news-our-stories-subtitle">
          {t(
            "Explore how Saayam for All is making headlines and building impact across communities.",
          )}
        </p>
      </section>

      {/* STORIES */}
      <section className="news-our-stories-section">
        {stories.map((story, index) => (
          <div key={index} className="news-our-stories-story">
            <img
              src={story.image}
              alt={story.title}
              className="news-our-stories-img-lg"
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
      </section>

      {/* CTA */}
      <section className="news-our-stories-cta">
        <h2 className="news-our-stories-cta-title">{t("Want to join us?")}</h2>
        <p className="news-our-stories-cta-desc">
          {t("Get involved and connect with our growing community.")}
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
