import { useState, useEffect, useRef } from "react";
import { Trans, useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

const TermsConditions = ({ isAcknowledged, setIsAcknowledged }) => {
  const { t } = useTranslation("terms");
  const [isCheckboxEnabled, setIsCheckboxEnabled] = useState(false);
  const scrollBoxRef = useRef(null);

  const handleCheckboxChange = () => {
    setIsAcknowledged(!isAcknowledged);
  };

  useEffect(() => {
    const scrollBox = scrollBoxRef.current;
    if (scrollBox) {
      const handleScroll = () => {
        const isAtBottom =
          Math.abs(
            scrollBox.scrollHeight -
              scrollBox.scrollTop -
              scrollBox.clientHeight,
          ) <= 5;
        if (isAtBottom) {
          setIsCheckboxEnabled(true);
        }
      };

      // Run initial check (in case content fits without scrolling)
      handleScroll();

      scrollBox.addEventListener("scroll", handleScroll);
      window.addEventListener("resize", handleScroll);

      return () => {
        scrollBox.removeEventListener("scroll", handleScroll);
        window.removeEventListener("resize", handleScroll);
      };
    }
  }, []);

  const sectionsList = Array.from({ length: 20 }, (_, i) => i + 1);

  const renderSectionContent = (num) => {
    if (num === 7) {
      return (
        <Trans
          i18nKey="SECTION_7_CONTENT"
          ns="terms"
          components={{
            1: (
              <Link
                className="text-blue-600 underline font-medium"
                to="/privacy-policy"
              />
            ),
          }}
        />
      );
    }
    if (num === 20) {
      return (
        <Trans
          i18nKey="SECTION_20_CONTENT"
          ns="terms"
          components={{
            1: (
              <a
                className="text-blue-600 underline font-medium"
                href="mailto:info@saayamforall.org"
              />
            ),
          }}
        />
      );
    }
    return t(`SECTION_${num}_CONTENT`);
  };

  return (
    <div className="document-acknowledgment p-6">
      <h2 className="text-2xl font-bold mb-4">{t("TITLE")}</h2>
      <p className="mb-4 text-gray-600">{t("SUBTITLE")}</p>

      <div
        ref={scrollBoxRef}
        className="scrolling-box mt-4 mb-4 p-4 border border-gray-300 rounded-lg bg-white"
        style={{ height: "350px", overflowY: "auto" }}
      >
        <h3 className="font-bold text-lg mb-4 text-slate-950 border-b pb-2">
          {t("HEADER")}
        </h3>
        <div>
          {sectionsList.map((num) => (
            <div key={num} className="mb-6">
              <h4 className="font-bold text-base mb-2 text-slate-800">
                {num}. {t(`SECTION_${num}_TITLE`)}
              </h4>
              <p className="text-slate-600 leading-relaxed text-sm">
                {renderSectionContent(num)}
              </p>
            </div>
          ))}

          {/* Standardized Section 21 Implementation */}
          <div className="mb-6" id="terms-section-21">
            <h4 className="font-bold text-base mb-2 text-slate-800">
              21. {t("SECTION_21_TITLE")}
            </h4>
            <p className="text-slate-600 leading-relaxed text-sm">
              {t("SECTION_21_CONTENT")}
            </p>
          </div>
        </div>
      </div>

      <div className="checkbox-container mt-6 flex items-center">
        <input
          type="checkbox"
          id="acknowledge"
          checked={isAcknowledged}
          onChange={handleCheckboxChange}
          className="mr-3 h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer disabled:cursor-not-allowed"
          disabled={!isCheckboxEnabled}
        />
        <label
          htmlFor="acknowledge"
          className="text-slate-700 font-medium select-none cursor-pointer disabled:text-gray-400"
        >
          {t("CHECKBOX_LABEL")}
        </label>
      </div>
    </div>
  );
};

TermsConditions.propTypes = {
  isAcknowledged: PropTypes.bool.isRequired,
  setIsAcknowledged: PropTypes.func.isRequired,
};

export default TermsConditions;
