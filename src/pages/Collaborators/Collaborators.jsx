import React, { useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import VolunteerMatchLogo from "../../assets/Collab_logos/volunteer-match.png";

function Collaborators() {
  const { t } = useTranslation();
  const volunteerLinkRef = useRef(null);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible" && volunteerLinkRef.current) {
        volunteerLinkRef.current.blur();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  return (
    <div className="flex flex-col items-center p-8 min-h-screen bg-white">
      <div className="w-full max-w-6xl">
        <h1 className="text-4xl font-bold text-center mb-6">
          {t("Our Collaborators")}
        </h1>

        <p className="text-lg text-center mb-12 text-gray-700">
          {t(
            "In some cases, our volunteers partner with local NGOs, community groups, and service organizations to ensure that every request is fulfilled effectively. Saayam For All builds a collaborative ecosystem that strengthens community support—because helping hands are stronger together.",
          )}
        </p>

        <div className="flex justify-center mb-16">
          <a
            ref={volunteerLinkRef}
            href="https://www.volunteermatch.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center max-w-md text-blue-700 hover:underline focus:outline-none"
          >
            <img
              src={VolunteerMatchLogo}
              alt="Volunteer Match"
              className="w-40 h-40 object-contain mb-4"
            />
            <h3 className="text-xl font-semibold mb-2">
              {t("Volunteer Match")}
            </h3>
            <p className="text-center text-gray-600 text-sm">
              {t(
                "U.S based nonprofit organization which provides a national digital infrastructure to serve volunteers and nonprofits organization.",
              )}
            </p>
          </a>
        </div>

        <div className="text-center mt-16 mb-16">
          <h2 className="text-3xl font-bold mb-4">{t("Want to join us?")}</h2>
          <p className="text-lg mb-8">
            {t(
              "Chat with our community and get in touch with different charity organizations!",
            )}
          </p>
          <Link
            to="/contact"
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-full inline-block"
          >
            {t("Join the community")}
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Collaborators;
