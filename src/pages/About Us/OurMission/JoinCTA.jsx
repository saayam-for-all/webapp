import { useNavigate } from "react-router-dom";

export function JoinCTA() {
  const naviate = useNavigate();
  return (
    <section className="flex flex-col items-center justify-center py-16 bg-white text-center">
      <h2
        className="text-[24px] font-bold mb-1"
        style={{ fontFamily: "Josefin Sans" }}
      >
        Looking to join us?
      </h2>
      <p
        className="text-gray-400 text-sm leading-snug max-w-md mb-4"
        style={{ fontFamily: "Josefin Sans" }}
      >
        Chat with our community and get in touch with different charity
        organizations!
      </p>
      <button
        className="bg-[#00B2FF] text-white text-xs font-semibold px-5 py-2 rounded-full hover:bg-[#009ee0] transition"
        style={{ fontFamily: "Josefin Sans" }}
        onClick={() => naviate("/contact")}
      >
        Join the community
      </button>
    </section>
  );
}
