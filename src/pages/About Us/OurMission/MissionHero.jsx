import "@fontsource/poppins";
import img1 from "../../../assets/about_Us/bot1.png";
import img2 from "../../../assets/about_Us/building-2.png";
import img3 from "../../../assets/about_Us/circle-dollar-sign.png";
import img4 from "../../../assets/about_Us/diversity_4.png";
import img5 from "../../../assets/about_Us/droplet.png";
import img6 from "../../../assets/about_Us/hand-heart.png";
import img7 from "../../../assets/about_Us/handshake.png";
import img8 from "../../../assets/about_Us/trophy.png";

export function MissionHero() {
  const values = [
    {
      icon: img5, // 💧
      title: "Address Basic Necessities",
      description:
        "Focus on food, clothing, shelter, education, medical, healthcare.",
    },
    {
      icon: img4, // 🤝 Inclusivity
      title: "Inclusivity and Respect",
      description:
        "Open to all, regardless of beliefs, religion, location, country, or politics, without desecrating any beliefs.",
    },
    {
      icon: img7, // 🤝 Collaboration
      title: "Collaboration, Not Competition",
      description:
        "Focus on food, clothing, shelter, education, medical, healthcare.",
    },
    {
      icon: img2, // 🏢
      title: "No Infrastructure or Money Distribution",
      description:
        "No building of schools or hospitals and no direct distribution of money.",
    },
    {
      icon: img6, // 👐
      title: "Volunteer-Based",
      description:
        "Purely volunteer-driven with no or nominal payments; cost reimbursement is allowed.",
    },
    {
      icon: img8, // 🏆
      title: "Motivation",
      description: "Use Saayam Dollars to motivate volunteers.",
    },
    {
      icon: img1, // 🤖
      title: "Automation",
      description:
        "Implement a software solution with minimal human intervention.",
    },
    {
      icon: img3, // 💲
      title: "Cost-Efficiency",
      description:
        "Utilize free resources like WhatsApp, Zoom, and GitHub to keep costs low.",
    },
  ];
  return (
    <section className="flex justify-center items-center py-10 bg-white">
      <div className="w-[945px]  text-center ">
        <h2 className="text-2xl font-bold mb-2">Our Values</h2>
        <p className="text-gray-600 text-base leading-relaxed mb-6 max-w-xl mx-auto">
          At Saayam For All, our shared values keep us connected and guide us as
          one team.
        </p>
        <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-6">
          {values.map((item, index) => (
            <div
              key={index}
              className="bg-blue-50 rounded-2xl p-5 text-center shadow-sm border border-blue-100 aspect-square flex flex-col justify-center w-68 h-68"
            >
              <div className="mb-4">
                <img
                  src={item.icon}
                  alt={item.title}
                  className="w-12 h-12 mx-auto"
                />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {item.title}
              </h3>
              <p className="text-sm text-gray-600">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
