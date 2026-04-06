import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaGlobe,
  FaEnvelope,
} from "react-icons/fa";
import { useTranslation } from "react-i18next";

const OrganizationDetails = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const organization = location.state?.organizationData;

  if (!organization) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-lg font-semibold text-gray-700 mb-4">
          Organization not found
        </p>
        <button
          onClick={() => navigate(-1)}
          className="text-blue-600 hover:text-blue-800 font-semibold"
        >
          ← Go Back
        </button>
      </div>
    );
  }

  // Calculate star count from rating (out of 5)
  const rating = organization.rating || 0;
  const fullStars = Math.floor(rating);

  return (
    <div>
      {/* Back button */}
      <div className="w-full px-4 mt-4 mb-4">
        <button
          onClick={() => navigate(-1)}
          className="text-blue-600 hover:text-blue-800 font-semibold text-lg flex items-center"
        >
          <span className="text-2xl mr-2">&lt;</span> {t("BACK") || "Back"}
        </button>
      </div>

      <div className="flex justify-center items-center min-h-screen">
        <div className="w-full max-w-5xl p-12 bg-white rounded-lg shadow-lg mx-4 lg:mx-auto">
          {/* Organization Name and Category */}
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
                {organization.Name}
              </h1>

              {/* Category Badge */}
              {organization.category && (
                <div className="flex gap-2 flex-wrap">
                  <span className="bg-blue-100 text-blue-600 py-1 px-3 rounded-full text-sm">
                    {organization.category}
                  </span>
                </div>
              )}

              {/* Website, Address, Phone, Email */}
              <div className="mt-6 space-y-4">
                {organization.url && (
                  <div className="flex items-center gap-3">
                    <FaGlobe className="text-blue-500" />
                    <a
                      href={organization.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 underline"
                    >
                      {organization.url}
                    </a>
                  </div>
                )}

                {organization.address && (
                  <div className="flex items-center gap-3">
                    <FaMapMarkerAlt className="text-red-500" />
                    <p className="text-gray-600">{organization.address}</p>
                  </div>
                )}

                {organization.phone && (
                  <div className="flex items-center gap-3">
                    <FaPhoneAlt className="text-green-500" />
                    <p className="text-gray-600">{organization.phone}</p>
                  </div>
                )}

                {organization.email && (
                  <div className="flex items-center gap-3">
                    <FaEnvelope className="text-purple-500" />
                    <a
                      href={`mailto:${organization.email}`}
                      className="text-blue-500 underline"
                    >
                      {organization.email}
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Rating */}
            {rating > 0 && (
              <div className="bg-blue-50 p-6 rounded-lg shadow-sm text-center w-48">
                <h2 className="text-5xl font-bold text-gray-800">{rating}</h2>
                <p className="text-lg font-semibold mt-2 text-gray-600">
                  Rating
                </p>
                <div className="flex justify-center mt-3">
                  {[...Array(fullStars)].map((_, i) => (
                    <span key={i} className="text-blue-600 text-2xl">
                      ★
                    </span>
                  ))}
                  {[...Array(5 - fullStars)].map((_, i) => (
                    <span key={i} className="text-gray-300 text-2xl">
                      ★
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Organization Mission */}
          {organization.mission && (
            <div className="mt-10">
              <h3 className="text-2xl font-bold text-gray-800 mb-3">
                Organization Mission
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {organization.mission}
              </p>
            </div>
          )}

          {/* Collaborator Representative Section */}
          {organization.Collaborator && organization.Representative && (
            <div className="mt-10 p-6 bg-green-50 rounded-lg border border-green-200">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                Collaborator Contact
              </h3>
              <div className="space-y-3">
                {organization.Representative.PersonName && (
                  <p className="text-gray-700">
                    <span className="font-semibold">Person in Charge:</span>{" "}
                    {organization.Representative.PersonName}
                  </p>
                )}
                {organization.Representative.Phone && (
                  <div className="flex items-center gap-3">
                    <FaPhoneAlt className="text-green-500" />
                    <p className="text-gray-600">
                      {organization.Representative.Phone}
                    </p>
                  </div>
                )}
                {organization.Representative.Email && (
                  <div className="flex items-center gap-3">
                    <FaEnvelope className="text-purple-500" />
                    <a
                      href={`mailto:${organization.Representative.Email}`}
                      className="text-blue-500 underline"
                    >
                      {organization.Representative.Email}
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrganizationDetails;
