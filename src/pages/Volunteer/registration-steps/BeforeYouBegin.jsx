import { useTranslation } from "react-i18next";
import { FiExternalLink } from "react-icons/fi";

const RESOURCE_LINKS = [
  {
    id: "overview",
    title: "Saayam Overview Video",
    url: "https://www.youtube.com/watch?v=saayam-overview",
  },
  {
    id: "proposal",
    title: "Proposal Slides",
    url: "https://docs.google.com/presentation/d/saayam-proposal",
  },
  {
    id: "onboarding",
    title: "Onboarding Video",
    url: "https://www.youtube.com/watch?v=saayam-onboarding",
  },
  {
    id: "wiki",
    title: "Volunteer Onboarding Wiki",
    url: "https://wiki.saayam.org/volunteer-onboarding",
  },
  {
    id: "aws",
    title: "AWS Services Overview",
    url: "https://docs.saayam.org/aws-services",
  },
];

const BeforeYouBegin = ({ materialsReviewed, setMaterialsReviewed }) => {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          {t("BEFORE_YOU_BEGIN") || "Before You Begin"}
        </h2>
        <p className="text-gray-600">
          {t("REVIEW_MATERIALS_DESCRIPTION") ||
            "Please review the following materials to understand our organization and volunteer expectations."}
        </p>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <p className="text-blue-800 text-sm">
          <strong>{t("IMPORTANT") || "Important"}:</strong>{" "}
          {t("LINKS_OPEN_NEW_TAB") ||
            "All links will open in a new tab. Please take time to review each resource before proceeding."}
        </p>
      </div>

      <div className="space-y-3">
        {RESOURCE_LINKS.map((link) => (
          <a
            key={link.id}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-blue-400 transition-all group"
          >
            <span className="font-medium text-gray-700 group-hover:text-blue-600">
              {link.title}
            </span>
            <FiExternalLink
              className="text-gray-400 group-hover:text-blue-500"
              size={20}
            />
          </a>
        ))}
      </div>

      <div className="mt-8 pt-6 border-t border-gray-200">
        <label className="flex items-start gap-3 cursor-pointer group">
          <input
            type="checkbox"
            checked={materialsReviewed}
            onChange={(e) => setMaterialsReviewed(e.target.checked)}
            className="mt-1 w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
          />
          <span className="text-gray-700 group-hover:text-gray-900">
            <strong className="text-red-500">*</strong>{" "}
            {t("MATERIALS_REVIEWED_ACKNOWLEDGMENT") ||
              "I have reviewed all the materials listed above and understand the expectations for volunteers."}
          </span>
        </label>

        {!materialsReviewed && (
          <p className="mt-2 ml-8 text-sm text-amber-600">
            {t("REVIEW_REQUIRED") ||
              "You must review all materials and check this box to proceed."}
          </p>
        )}
      </div>
    </div>
  );
};

export default BeforeYouBegin;
