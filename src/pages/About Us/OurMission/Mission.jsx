export function Mission() {
  return (
    <section className="flex justify-center items-center py-10 bg-white">
      <div className="w-[1100px] h-[565px] rounded-[30px] p-6 shadow-md border border-blue-200 flex flex-col justify-between">
        {/* Header Row: Our Mission + Paragraph in single row */}
        <div className="flex mb-6">
          <h2
            className="text-2xl font-bold mr-4 whitespace-nowrap"
            style={{ fontFamily: "Josefin Sans" }}
          >
            Our Mission
          </h2>
          <p
            className="text-gray-600 text-base leading-relaxed"
            style={{ fontFamily: "Josefin Sans" }}
          >
            Our mission is to provide timely and targeted assistance to those
            facing challenges in their lives, fostering a culture of compassion,
            solidarity, and service to humanity.
          </p>
        </div>

        {/* Image Row */}
        <div className="flex justify-between gap-4">
          <img
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/587ed268b2153793efab648656556a802eb62ad9"
            alt="Mission image 1"
            className="w-1/3 h-[350px] object-cover rounded-[20px]"
          />
          <img
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/67c999ae47a8163906957ca47ca9b1d509b125ac"
            alt="Mission image 2"
            className="w-1/3 h-[350px] object-cover rounded-[20px]"
          />
          <img
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/4a2a77f3953d04155e4de9a3f393c7266b008dae"
            alt="Mission image 3"
            className="w-1/3 h-[350px] object-cover rounded-[20px]"
          />
        </div>
      </div>
    </section>
  );
}
