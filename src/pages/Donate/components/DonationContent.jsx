import React from "react";
import { useTranslation } from "react-i18next";
import { FaCheckCircle } from "react-icons/fa";
import QRIMG from "../../../assets/QR.png";
import HandsTogetherImg from "../../../assets/hands-together.png";

const DonationContent = () => {
  const { t } = useTranslation();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="relative h-[600px]">
        <img
          src={HandsTogetherImg}
          alt="People helping each other"
          className="w-full h-full object-cover rounded-lg shadow-sm"
        />
      </div>

      <div className="h-[600px] flex flex-col justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-3 text-gray-800">
            {t("MAKE_DONATION")}
          </h1>
          <p className="text-sm text-gray-600 mb-6">{t("DONATION_SUBTITLE")}</p>

          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <div className="flex items-start gap-3 mb-3">
              <FaCheckCircle className="text-blue-600 text-sm mt-1 flex-shrink-0" />
              <p className="text-sm text-gray-700">
                {t("DONATION_ACHIEVEMENT_1")}
              </p>
            </div>
            <div className="flex items-start gap-3 mb-3">
              <FaCheckCircle className="text-blue-600 text-sm mt-1 flex-shrink-0" />
              <p className="text-sm text-gray-700">
                {t("DONATION_ACHIEVEMENT_2")}
              </p>
            </div>
            <div className="flex items-start gap-3">
              <FaCheckCircle className="text-blue-600 text-sm mt-1 flex-shrink-0" />
              <p className="text-sm text-gray-700">
                {t("DONATION_ACHIEVEMENT_3")}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <a
            href="https://www.paypal.com/donate/?hosted_button_id=4KLWNM5JWKJ4S"
            className="block w-full py-3 px-6 bg-blue-600 text-white text-center rounded-full font-semibold text-sm shadow-sm hover:bg-blue-700 hover:text-white hover:shadow-md transition-all"
            target="_blank"
            rel="noopener noreferrer"
          >
            {t("DONATE_VIA_PAYPAL")}
          </a>

          <div className="bg-gray-50 p-6 rounded-lg text-center">
            <h2 className="text-sm font-semibold mb-3 text-gray-800">
              {t("SCAN_QR_CODE")}
            </h2>
            <img
              src={QRIMG}
              alt="QR Code for donation"
              className="w-32 h-32 mx-auto mb-3 rounded shadow-sm"
            />
            <p className="text-xs text-gray-600">{t("QR_CODE_DESCRIPTION")}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonationContent;
