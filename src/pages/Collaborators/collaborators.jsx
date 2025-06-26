import React from "react";
import { useTranslation } from "react-i18next";
import VolunteerMatchLogo from "../../assets/Collab_logos/volunteer-match.png"; // You'll need to add these images
import IdealistLogo from "../../assets/Collab_logos/idealist.jpeg";
import RedCrossLogo from "../../assets/Collab_logos/red-cross.jpeg";
import { Link } from "react-router-dom";

function Collaborators() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center p-8 min-h-screen bg-white">
      <div className="w-full max-w-6xl">
        {/* <h1 className="text-4xl font-bold text-center mb-6">
          Our Collaborators
        </h1> */}

        <p className="text-lg text-center mb-12 text-gray-700">
          In some cases, our volunteers partner with local NGOs, community
          groups, and service organizations to ensure that every request is
          fulfilled effectively. Saayam For All builds a collaborative ecosystem
          that strengthens community support—because helping hands are stronger
          together.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {/* Volunteer Match */}
          <div className="flex flex-col items-center">
            <img
              src={VolunteerMatchLogo}
              alt="Volunteer Match"
              className="w-40 h-40 object-contain mb-4"
            />
            <h3 className="text-xl font-semibold mb-2">Volunteer Match</h3>
            <p className="text-center text-gray-600 text-sm">
              U.S based nonprofit organization which provides a national digital
              infrastructure to serve volunteers and nonprofits organization.
            </p>
          </div>

          {/* Idealist */}
          <div className="flex flex-col items-center">
            <img
              src={IdealistLogo}
              alt="Idealist (Action without Borders)"
              className="w-40 h-40 object-contain mb-4"
            />
            <h3 className="text-xl font-semibold mb-2">
              Idealist (Action without Borders)
            </h3>
            <p className="text-center text-gray-600 text-sm">
              Action Without Borders also known as Idealist is a non-profit
              service organization based in New York City.
            </p>
          </div>

          {/* American RedCross */}
          <div className="flex flex-col items-center">
            <img
              src={RedCrossLogo}
              alt="American RedCross"
              className="w-40 h-40 object-contain mb-4"
            />
            <h3 className="text-xl font-semibold mb-2">American RedCross</h3>
            <p className="text-center text-gray-600 text-sm">
              Red Cross volunteers and staff work to deliver vital services –
              from providing relief and support to those in crisis.
            </p>
          </div>
        </div>

        <div className="text-center mt-16 mb-16">
          <h2 className="text-3xl font-bold mb-4">Want to join us?</h2>
          <p className="text-lg mb-8">
            Chat with our community and get in touch with different charity
            organizations!
          </p>
          <Link
            to="/contact"
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-full inline-block"
          >
            Join the community
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Collaborators;
