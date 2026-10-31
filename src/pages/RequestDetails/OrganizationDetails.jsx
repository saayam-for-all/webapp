import { useNavigate, useLocation } from "react-router-dom";
import {
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaGlobe,
  FaEnvelope,
  FaArrowLeft,
} from "react-icons/fa";

const OrganizationDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const organization = location.state?.organizationData || {};
  const organizationName =
    organization?.Name ||
    organization?.name ||
    location.state?.organizationName;

  if (!organizationName) {
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

  const website =
    organization.web_url ||
    organization.url ||
    organization.Web_Url ||
    organization.webUrl;
  const address =
    organization.location ||
    organization.address ||
    organization.Location ||
    organization.Address;
  const phone =
    organization.contact ||
    organization.phone ||
    organization.Contact ||
    organization.Phone;
  const email = organization.email || organization.Email;
  const mission = organization.mission || organization.Mission;
  const category =
    organization.category ||
    organization.Category ||
    organization["Org-type"] ||
    organization.organization_type;

  // Format website url for anchor href
  const websiteHref =
    website && (website.startsWith("http://") || website.startsWith("https://"))
      ? website
      : `https://${website}`;

  // Calculate star count from rating (out of 5)
  const ratingValue = Number(organization.rating || organization.Rating) || 0;
  const fullStars = Math.min(5, Math.floor(ratingValue));

  return (
    <div className="min-h-screen py-8 bg-gray-50">
      <div className="w-full max-w-5xl mx-auto px-4">
        {/* Back navigation button */}
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 mb-6 text-blue-600 hover:text-blue-800 font-medium cursor-pointer"
        >
          <FaArrowLeft className="text-sm" />
          <span>Back to Organizations</span>
        </button>

        <div className="p-8 lg:p-12 bg-white rounded-lg shadow-md border border-gray-100">
          {/* Organization Name, Category & Rating */}
          <div className="flex flex-col md:flex-row justify-between items-start gap-6">
            <div className="flex-1">
              <h1 className="text-3xl lg:text-4xl font-extrabold text-gray-900 mb-3">
                {organizationName}
              </h1>

              {/* Category Badge */}
              {category && category !== "N/A" && (
                <div className="flex gap-2 flex-wrap mb-4">
                  <span className="bg-blue-100 text-blue-700 py-1 px-3 rounded-full text-xs font-semibold uppercase tracking-wider">
                    {category}
                  </span>
                </div>
              )}

              {/* Website, Address, Phone, Email */}
              <div className="mt-6 space-y-3">
                {website && (
                  <div className="flex items-center gap-3">
                    <FaGlobe className="text-blue-500 shrink-0" />
                    <a
                      href={websiteHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline break-all"
                    >
                      {website}
                    </a>
                  </div>
                )}

                {address && address !== "N/A" && (
                  <div className="flex items-start gap-3">
                    <FaMapMarkerAlt className="text-red-500 shrink-0 mt-1" />
                    <p className="text-gray-700">{address}</p>
                  </div>
                )}

                {phone && phone !== "N/A" && (
                  <div className="flex items-center gap-3">
                    <FaPhoneAlt className="text-green-500 shrink-0" />
                    <a
                      href={`tel:${phone}`}
                      className="text-gray-700 hover:text-blue-600"
                    >
                      {phone}
                    </a>
                  </div>
                )}

                {email && (
                  <div className="flex items-center gap-3">
                    <FaEnvelope className="text-purple-500 shrink-0" />
                    <a
                      href={`mailto:${email}`}
                      className="text-blue-600 hover:underline break-all"
                    >
                      {email}
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Rating */}
            {ratingValue > 0 && (
              <div className="bg-blue-50 p-6 rounded-lg border border-blue-100 text-center w-full md:w-44 shrink-0">
                <h2 className="text-4xl font-extrabold text-gray-800">
                  {ratingValue}
                </h2>
                <p className="text-sm font-semibold mt-1 text-gray-600">
                  Rating
                </p>
                <div
                  className="flex justify-center mt-2"
                  aria-label={`Rating: ${ratingValue} out of 5 stars`}
                >
                  {[...Array(fullStars)].map((_, i) => (
                    <span key={`full-${i}`} className="text-yellow-500 text-xl">
                      ★
                    </span>
                  ))}
                  {[...Array(Math.max(0, 5 - fullStars))].map((_, i) => (
                    <span key={`empty-${i}`} className="text-gray-300 text-xl">
                      ★
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Organization Mission */}
          {mission && (
            <div className="mt-8 pt-8 border-t border-gray-200">
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                Organization Mission
              </h3>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {mission}
              </p>
            </div>
          )}

          {/* Collaborator Representative Section */}
          {organization.Collaborator && organization.Representative && (
            <div className="mt-8 p-6 bg-green-50 rounded-lg border border-green-200">
              <h3 className="text-xl font-bold text-gray-800 mb-3">
                Collaborator Contact
              </h3>
              <div className="space-y-2">
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
