import React from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
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
    title: "Ramesh Maturu Named to the 2026 Georgia Titan 100 List",
    image: withRameshMaturu,
    description:
      "Pyramid Consulting is pleased to announce that its President and Co-founder Ramesh Maturu, has been named a 2026 Georgia Titan 100, his second recognition following his initial selection in 2024.The Titan 100 program honors Georgia’s Top 100 CEOs and C-level executives who exemplify exceptional leadership, vision, and passion.",
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
    title: "With Jensen Huang, CEO of NVIDIA",
    image: withJensen,
    description:
      "A meaningful interaction with Jensen Huang, discussing technology leadership, innovation, and the future of mission-driven platforms.",
    titleLinks: {
      "Jensen Huang": "https://www.linkedin.com/in/jenhsunhuang/",
      NVIDIA: "https://www.nvidia.com/",
    },
  },
  {
    date: "05/02/2025",
    title: "With Vishal Sikka, Founder & CEO of Vianai Systems",
    image: withVishalSikka,
    description:
      "An insightful exchange with Vishal Sikka on leadership, purpose-driven innovation, and building organizations that create long-term impact.",
    titleLinks: {
      "Vishal Sikka": "https://www.linkedin.com/in/vishal-sikka-869a6b2/",
      "Vianai Systems": "https://www.vian.ai/",
    },
  },
  {
    date: "02/09/2026",
    title:
      "With Ramesh Maturu and Ramana Yerneni on Carmel-by-the-Sea, CA beach",
    image: leisuewithproductivity,
    description:
      "A memorable moment at Carmel-by-the-Sea, California, reflecting on meaningful conversations and connections with Ramesh Maturu and Ramana Yerneni by the Pacific coast.",
    titleLinks: {
      "Ramesh Maturu": "https://www.linkedin.com/in/rameshmaturu/",
      "Ramana Yerneni": "https://www.linkedin.com/in/ramanayerneni/",
      "Pyramid Consulting": "https://www.pyramidci.com/",
    },
  },
  {
    date: "05/02/2025",
    title: "In Step with the Community: A 17-Mile Walk in San Ramon",
    image: seventeenMileWalk,
    description:
      "Our CEO and Sateesh Mucharla participated in a 17-mile walk through San Ramon, California, championing wellness, unity, and public service.",
    titleLinks: {},
  },
  {
    date: "05/02/2025",
    title: "With Dr. Srikar Reddy Koppula, Indian Consular in SF, CA",
    image: indianConsular,
    description:
      "A moment with the Indian Consular team during a community engagement event.",
    titleLinks: {
      "Dr. Srikar Reddy Koppula":
        "https://www.linkedin.com/in/srikar-reddy-koppula-b966aa293/",
      "Indian Consular": "https://www.cgisf.gov.in/",
    },
  },

  {
    date: "05/02/2025",
    title:
      "With Amit Zavery, President, CPO, and COO, ServiceNow; Board Member, Broadridge (NYSE:BR)",
    image: withAmitZavery,
    description:
      "Interaction during the IIT Bay Area Conference discussing leadership, innovation, and community impact.",
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
    title:
      "With Madhusudhan Sai, global humanitarian and spiritual leader and President of Aria University, Anand Kuchibhotla",
    image: withMadhusudhanSai,
    description:
      "A meaningful meeting highlighting values of service, compassion, and purpose-driven initiatives.",
    titleLinks: {
      "Madhusudhan Sai": "https://srimadhusudansai.com/",
      "Anand Kuchibhotla": "https://www.linkedin.com/in/anandkuchibhotla/",
      "Aria University": "https://www.aria.edu/",
    },
  },

  {
    date: "05/02/2025",
    title: "With Murali Krishnamurthy, CEO of Sankara Eye Foundation",
    image: withMuralidharan,
    description:
      "In conversation with Murali Krishnamurthy, CEO of Sankara Eye Foundation, on strengthening collaborations to improve healthcare accessibility and community impact.",
    titleLinks: {
      "Murali Krishnamurthy":
        "https://www.linkedin.com/in/muralikrishnamurthy/",
      "Sankara Eye Foundation": "https://sankaraeye.com/",
    },
  },
  {
    date: "05/02/2025",
    title:
      "With U.S. Representative, Jimmy Panetta and San José City Council member, Domingo Candelas",
    image: withJimmyPanettaandDomingoCandelas,
    description:
      "A productive discussion with U.S. Representative Jimmy Panetta and San José City Councilmember Domingo Candelas on social impact, healthcare accessibility, and collaborative efforts to uplift local communities.",
    titleLinks: {
      "Jimmy Panetta": "https://panetta.house.gov/",
      "Domingo Candelas": "https://www.domingocandelas.com/",
      "San José": "https://www.sanjoseca.gov/",
    },
  },
];

export default function NewsOurStories() {
  const { t } = useTranslation();
  const navigate = useNavigate();

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
            <div key={story.title} className="news-card">
              <div className="news-img-wrap">
                <img src={story.image} alt={story.title} className="news-img" />
              </div>

              <div className="news-card-body">
                <div className="news-date">{story.date}</div>

                <h2 className="news-title">
                  {renderLinkedTitle(story.title, story.titleLinks)}
                </h2>

                <p className="news-desc">{story.description}</p>

                {/* ✅ Read more ONLY when readMoreLink is provided (Titan news only) */}
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
