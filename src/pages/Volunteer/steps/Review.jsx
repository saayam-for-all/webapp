import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Review = ({ isStewardReview = false, applicant = null }) => {
  const { t } = useTranslation();

  const combinedName = [applicant?.firstName, applicant?.lastName]
    .filter(Boolean)
    .join(" ");

  const applicantName =
    applicant?.fullName ||
    applicant?.name ||
    combinedName ||
    applicant?.userId ||
    applicant?.["User Id"] ||
    "Applicant";

  const applicantPhone =
    applicant?.whatsappNumber ||
    applicant?.phoneNumber ||
    applicant?.mobileNumber ||
    applicant?.phone ||
    "";

  // WhatsApp requires the country code and digits only.
  const whatsappNumber = String(applicantPhone).replace(/\D/g, "");

  const hasValidWhatsAppNumber = whatsappNumber.length >= 8;

  const handleSendMessage = () => {
    if (!hasValidWhatsAppNumber) {
      return;
    }

    const message = encodeURIComponent(
      `Hello ${applicantName}, we are contacting you regarding your Saayam For All volunteer application.`,
    );

    const whatsappUrl = `https://wa.me/${whatsappNumber}` + `?text=${message}`;

    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="container md:mt-6">
      <div className="flex flex-col items-center">
        <div className="text-yellow-500">
          <svg
            className="h-24 w-24"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" />
          </svg>
        </div>

        <div className="mt-3 text-xl font-semibold uppercase text-yellow-600">
          {t("IN_REVIEW")}
        </div>

        <div className="mt-4 max-w-md px-4 text-center text-gray-600">
          <p>{t("REVIEW_STATUS_MESSAGE")}</p>

          <p className="mt-2">{t("REVIEW_APPROVAL_MESSAGE")}</p>
        </div>

        {isStewardReview && applicant && (
          <div className="mt-8 w-full max-w-md px-4">
            <div className="rounded-lg border border-gray-200 p-5 shadow-sm">
              <div className="text-center">
                <span className="text-gray-600">Applicant: </span>

                <Link
                  to="/applicantprofile"
                  state={applicant}
                  className="font-semibold text-blue-600 underline hover:text-blue-800"
                >
                  {applicantName}
                </Link>
              </div>

              <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
                <button
                  type="button"
                  className="rounded bg-green-600 px-5 py-2 text-white hover:bg-green-700"
                >
                  Promote
                </button>

                <button
                  type="button"
                  className="rounded bg-red-600 px-5 py-2 text-white hover:bg-red-700"
                >
                  Reject
                </button>

                <button
                  type="button"
                  onClick={handleSendMessage}
                  disabled={!hasValidWhatsAppNumber}
                  title={
                    hasValidWhatsAppNumber
                      ? "Send WhatsApp message"
                      : "Applicant phone number is unavailable"
                  }
                  className={`rounded px-5 py-2 text-center ${
                    hasValidWhatsAppNumber
                      ? "cursor-pointer bg-green-500 text-white hover:bg-green-600"
                      : "cursor-not-allowed bg-gray-300 text-gray-600"
                  }`}
                >
                  Send Message
                </button>
              </div>

              {!hasValidWhatsAppNumber && (
                <p className="mt-3 text-center text-sm text-red-500">
                  Phone number is unavailable for this applicant.
                </p>
              )}
            </div>
          </div>
        )}

        <Link to="/dashboard">
          <button
            type="button"
            className="mx-auto mt-12 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-700"
          >
            {t("CLOSE")}
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Review;
