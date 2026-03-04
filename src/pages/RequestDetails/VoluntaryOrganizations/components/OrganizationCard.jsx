import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import {
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaGlobe,
  FaBuilding,
} from "react-icons/fa";
import { HiOutlineExternalLink } from "react-icons/hi";
import SourceBadge from "./SourceBadge";

const OrganizationCard = ({ org }) => {
  const { t } = useTranslation();

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-100 hover:shadow-lg hover:border-primary-200 transition-all duration-300 overflow-hidden group">
      {/* Card Header */}
      <div className="bg-gradient-to-r from-primary-500 to-primary-600 p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="bg-white/20 backdrop-blur-sm p-3 rounded-lg flex-shrink-0">
              <FaBuilding className="text-white text-xl" />
            </div>
            <h3 className="text-lg font-bold text-white line-clamp-2">
              {org.name}
            </h3>
          </div>
          <div className="flex-shrink-0">
            <SourceBadge dbOrAi={org.db_or_ai} />
          </div>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5 space-y-4">
        {/* Location */}
        {org.location && (
          <div className="flex items-start gap-3">
            <div className="mt-0.5">
              <FaMapMarkerAlt className="text-red-500" />
            </div>
            <p className="text-gray-600 text-sm">{org.location}</p>
          </div>
        )}

        {/* Contact */}
        {org.contact && (
          <div className="flex items-start gap-3">
            <div className="mt-0.5">
              <FaPhoneAlt className="text-green-500" />
            </div>
            <a
              href={`tel:${org.contact.replace(/[^0-9+]/g, "")}`}
              className="text-gray-600 text-sm hover:text-primary-600 transition-colors"
            >
              {org.contact}
            </a>
          </div>
        )}

        {/* Email */}
        {org.email && (
          <div className="flex items-start gap-3">
            <div className="mt-0.5">
              <FaEnvelope className="text-blue-500" />
            </div>
            <a
              href={`mailto:${org.email}`}
              className="text-gray-600 text-sm hover:text-primary-600 transition-colors truncate"
            >
              {org.email}
            </a>
          </div>
        )}

        {/* Mission (if available) */}
        {org.mission && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <p className="text-gray-500 text-sm line-clamp-3 italic">
              "{org.mission}"
            </p>
          </div>
        )}
      </div>

      {/* Card Footer - Website Link */}
      {org.web_url && (
        <div className="px-5 pb-5">
          <a
            href={org.web_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-primary-50 hover:bg-primary-100 text-primary-700 font-medium rounded-lg transition-colors group-hover:bg-primary-100"
          >
            <FaGlobe className="text-sm" />
            <span>{t("VISIT_WEBSITE")}</span>
            <HiOutlineExternalLink className="text-sm" />
          </a>
        </div>
      )}
    </div>
  );
};

OrganizationCard.propTypes = {
  org: PropTypes.shape({
    name: PropTypes.string.isRequired,
    location: PropTypes.string,
    contact: PropTypes.string,
    email: PropTypes.string,
    web_url: PropTypes.string,
    mission: PropTypes.string,
    db_or_ai: PropTypes.string,
  }).isRequired,
};

export default OrganizationCard;
