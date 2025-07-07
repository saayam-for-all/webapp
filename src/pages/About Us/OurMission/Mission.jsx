import { useTranslation } from "react-i18next";
export function Mission() {
  const { t } = useTranslation();
  return (
    <section className="flex justify-center items-center py-10 bg-white">
      <div className="w-full max-w-[1100px] md:h-auto rounded-[30px] p-6 border-blue-200 flex flex-col justify-between">
        {/* Header Row: Our Mission + Paragraph in single row */}
        <div className="flex flex-col md:flex-row mb-2 justify-center items-center text-center md:text-left">
          <h2 className="text-2xl font-bold mb-2 md:mb-0 md:mr-4 whitespace-nowrap">
            {t("Our Mission")}
          </h2>
          <p className="text-gray-600 text-base leading-relaxed">
            {t(
              "Our mission is to provide timely and targeted assistance to those,",
            )}
            <br />
            {t(
              "facing challenges in their lives, fostering a culture of compassion,",
            )}
            <br />
            {t("solidarity, and service to humanity.")}
          </p>
        </div>
        {/* Image Row */}
        <div className="flex flex-col md:flex-row justify-center items-center gap-4 mt-4">
          <img
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/587ed268b2153793efab648656556a802eb62ad9"
            alt="Mission image 1"
            className="w-full md:w-[28%] h-[250px] md:h-[300px] object-cover rounded-[20px]"
          />
          <img
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/67c999ae47a8163906957ca47ca9b1d509b125ac"
            alt="Mission image 2"
            className="w-full md:w-[28%] h-[250px] md:h-[300px] object-cover rounded-[20px]"
          />
          <img
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/4a2a77f3953d04155e4de9a3f393c7266b008dae"
            alt="Mission image 3"
            className="w-full md:w-[28%] h-[250px] md:h-[300px] object-cover rounded-[20px]"
          />
        </div>
      </div>
    </section>
  );
}
