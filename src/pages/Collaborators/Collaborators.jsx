import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import HorizontalAd from "#components/Ads/HorizontalAd";
import { collaborators } from "../../data/collaboratorsData";

function Collaborators() {
  const { t } = useTranslation();

  const firstRow = collaborators.slice(0, 3);
  const secondRow = collaborators.slice(3);

  return (
    <>
      <div className="flex flex-col items-center p-8 min-h-screen bg-white">
        <div className="w-full max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-4">
            {t("Our Collaborators")}
          </h2>

          <p className="text-base text-center mb-12 text-gray-700">
            {t(
              "In some cases, our volunteers partner with local NGOs, community groups, and service organizations to ensure that every request is fulfilled effectively. Saayam For All builds a collaborative ecosystem that strengthens community support—because helping hands are stronger together.",
            )}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 mb-10 place-items-center">
            {firstRow.map((collab) => (
              <a
                key={collab.name}
                href={collab.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center max-w-md text-blue-700 hover:underline focus:outline-none"
              >
                <img
                  src={collab.logo}
                  alt={collab.name}
                  className="w-40 h-40 object-contain mb-4"
                />
                <h3 className="text-xl font-semibold mb-2">{collab.name}</h3>
                {collab.description ? (
                  <p className="text-center text-gray-600 text-sm">
                    {t(collab.description)}
                  </p>
                ) : null}
              </a>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-10 mb-16">
            {secondRow.map((collab) => (
              <a
                key={collab.name}
                href={collab.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center max-w-md text-blue-700 hover:underline focus:outline-none"
              >
                <img
                  src={collab.logo}
                  alt={collab.name}
                  className="w-40 h-40 object-contain mb-4"
                />
                <h3 className="text-xl font-semibold mb-2">{collab.name}</h3>
                {collab.description ? (
                  <p className="text-center text-gray-600 text-sm">
                    {t(collab.description)}
                  </p>
                ) : null}
              </a>
            ))}
          </div>

          <div className="text-center mt-16 mb-16">
            <h2 className="text-3xl font-bold mb-4">{t("Want to join us?")}</h2>
            <p className="text-base mb-8">
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
      <div className="overflow-hidden mt-2">
        <HorizontalAd />
      </div>
    </>
  );
}

export default Collaborators;
