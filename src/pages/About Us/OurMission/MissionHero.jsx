import "@fontsource/poppins";
import img1 from "../../../assets/about_Us/bot.png";
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
      titleLine1: "Address Basic",
      titleLine2: "Necessities",
      description1: "Focus on food, clothing,",
      description2: "shelter, education,",
      description3: "medical, healthcare.",
    },
    {
      icon: img4, // 🤝 Inclusivity
      titleLine1: "Inclusivity and ",
      titleLine2: "Respect",
      description1: "Open to all, regardless of beliefs,",
      description2: " religion, location, country, or politics,",
      description3: "without desecrating any beliefs.",
    },
    {
      icon: img7, // 🤝 Collaboration
      titleLine1: "Collaboration,",
      titleLine2: "Not Competition",

      description1: "Match Requestors with existing",
      description2: "voluntary organizations without",
      description3: "starting new ones that compete.",
    },
    {
      icon: img2, // 🏢
      titleLine1: "No Infrastructure or",
      titleLine2: " Money Distribution",

      description1: "No building of schools or hospitals and",
      description2: "no direct distribution of money.",
    },
    {
      icon: img6, // 👐
      titleLine1: "Volunteer-Based",
      description1: "Purely volunteer-driven with no pay or",
      description2: "benefits; cost reimbursement is allowed.",
    },
    {
      icon: img8, // 🏆
      titleLine1: "Motivation",
      description1: "Use Saayam Dollars to motivate",
      description2: "volunteers.",
    },
    {
      icon: img1, // 🤖
      titleLine1: "Automation",
      description1: "Implement a software solution with",
      description2: "minimal human intervention.",
    },
    {
      icon: img3, // 💲
      titleLine1: "Cost-Efficiency",
      description1: "Utilize free resources like WhatsApp,",
      description2: " Zoom, and GitHub to keep costs low.",
    },
  ];
  return (
    <section className="flex justify-center items-center py-10 bg-white">
      <div className="w-[945px]  text-center ">
        <h2 className="text-2xl font-bold mb-2">Our Values</h2>
        <p className="text-gray-600 text-base leading-relaxed mb-6 mx-auto whitespace-nowrap">
          At Saayam For All, our shared values keep us connected and guide us as
          one team.
        </p>
        <div className="max-w-2xl mx-auto grid grid-cols-3 sm:grid-cols-2 gap-4">
          {values.map((item, index) => (
            <div
              key={index}
              className="bg-blue-50 rounded-2xl p-6 text-center shadow-sm border border-blue-100 w-[320px] h-[320px] flex flex-col justify-center items-center"
            >
              <div className="mb-12">
                <img
                  src={item.icon}
                  alt={item.title}
                  className="w-12 h-12 mx-auto"
                />
              </div>

              <h3 className="text-xl font-bold text-gray-900 mb-1 leading-tight">
                {item.titleLine1} <br /> {item.titleLine2}
              </h3>

              <p className="text-sm text-gray-600">
                {item.description1}
                <br /> {item.description2}
                <br /> {item.description3}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
