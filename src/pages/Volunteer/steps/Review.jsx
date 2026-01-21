import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Review = () => {
  const { t } = useTranslation();

  return (
    <div className="container md:mt-6">
      <div className="flex flex-col items-center">
        <div className="text-yellow-500">
          <svg
            className="w-24 h-24"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" />
          </svg>
        </div>
        <div className="mt-3 text-xl font-semibold uppercase text-yellow-600">
          {t("IN_REVIEW") || "In Review"}
        </div>
        <div className="mt-4 text-center text-gray-600 max-w-md px-4">
          <p>
            {t("REVIEW_STATUS_MESSAGE") ||
              "Your volunteer application has been submitted and is currently under review by an administrator."}
          </p>
          <p className="mt-2">
            {t("REVIEW_APPROVAL_MESSAGE") ||
              "Once approved, you will become a volunteer and can start helping others."}
          </p>
        </div>
        <button className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700 mx-auto mt-12">
          <Link to="/dashboard">{t("CLOSE") || "Close"}</Link>
        </button>
      </div>
    </div>
  );
};

export default Review;
