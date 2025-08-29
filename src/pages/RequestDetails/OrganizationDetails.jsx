import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { voluntaryOrganizationsData } from "./dummyData";
import { FaMapMarkerAlt, FaPhoneAlt, FaGlobe } from "react-icons/fa";

const OrganizationDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const organization = voluntaryOrganizationsData.find(
    (org) => org.id === parseInt(id),
  );

  if (!organization) {
    return <div>Organization not found</div>;
  }

  // Dummy data for contact, address, and mission
  const contactNumber = "434-977-4090";
  const address = "120 Garrett Street, Suite 400, Charlottesville VA 22902";
  const mission =
    "The mission of the organization is to protect the basic right to clean air, clean water, and a livable climate; to preserve our region’s natural treasures and rich biodiversity; and to provide a healthy environment for all.";

  return (
    <div>
      {/* Add back button here, aligned to the left like in Image 2 */}
      <div className="w-full px-4 mt-4 mb-4">
        <button
          onClick={() => navigate(-1)}
          className="text-blue-600 hover:text-blue-800 font-semibold text-lg flex items-center"
        >
          <span className="text-2xl mr-2">&lt;</span> Back
        </button>
      </div>
      <div className="flex justify-center items-center min-h-screen">
        <div className="w-full max-w-5xl p-12 bg-white rounded-lg shadow-lg mx-4 lg:mx-auto">
          {/* Organization Name and Tags */}
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
                {organization.name}
              </h1>
              <div className="flex gap-2 flex-wrap">
                {organization.causes.split(", ").map((cause, index) => (
                  <span
                    key={index}
                    className="bg-blue-100 text-blue-600 py-1 px-3 rounded-full text-sm"
                  >
                    {cause}
                  </span>
                ))}
              </div>

              {/* Website, Address, and Contact */}
              <div className="mt-6 space-y-4">
                <div className="flex items-center gap-3">
                  <FaGlobe className="text-blue-500" />
                  <a
                    href={organization.website || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 underline"
                  >
                    {organization.website || "www.example.org"}
                  </a>
                </div>

                <div className="flex items-center gap-3">
                  <FaMapMarkerAlt className="text-red-500" />
                  <p className="text-gray-600">{address}</p>
                </div>

                <div className="flex items-center gap-3">
                  <FaPhoneAlt className="text-green-500" />
                  <p className="text-gray-600">{contactNumber}</p>
                </div>
              </div>
            </div>

            {/* Rating */}
            <div className="bg-blue-50 p-6 rounded-lg shadow-sm text-center w-48">
              <h2 className="text-5xl font-bold text-gray-800">
                {organization.rating}%
              </h2>
              <p className="text-lg font-semibold mt-2 text-gray-600">Rating</p>
              <div className="flex justify-center mt-3">
                {[...Array(4)].map((_, i) => (
                  <span key={i} className="text-blue-600 text-2xl">
                    ★
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Organization Mission */}
          <div className="mt-10">
            <h3 className="text-2xl font-bold text-gray-800 mb-3">
              Organization Mission
            </h3>
            <p className="text-gray-700 leading-relaxed">{mission}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrganizationDetails;
