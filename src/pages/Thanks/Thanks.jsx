import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Thanks = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="bg-gray-100 flex flex-col justify-center items-center m-5 p-5">
      <h1 className="text-4xl font-bold px-5">{t("THANKS")}</h1>
      <div className="flex flex-wrap items-center gap-2 m-4 justify-center items-center">
        <span className="text-xl">{t("EMAIL_SENT_SUCCESSFULLY")}</span>
        <button
          className="bg-blue-500 text-white py-2 px-4 rounded-full hover:bg-blue-600"
          onClick={() => navigate("/")}
        >
          {t("HOME")}
        </button>
      </div>
    </div>
  );
};

export default Thanks;
