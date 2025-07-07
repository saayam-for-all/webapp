import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

export function JoinCTA() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  return (
    <section className="flex flex-col items-center justify-center py-16 bg-white text-center">
      <h2 className="text-[24px] font-bold mb-1">{t("Looking to join us?")}</h2>
      <p className="text-gray-600 text-sm leading-snug max-w-md mb-4">
        {t("Chat with our community and get in touch with different charity")}{" "}
        {t("organizations!")}
      </p>
      <button
        className="bg-[#00B2FF] text-white text-xs font-semibold px-5 py-2 rounded-full hover:bg-[#009ee0] transition"
        onClick={() => naviate("/contact")}
      >
        {t("Join the community")}
      </button>
    </section>
  );
}
