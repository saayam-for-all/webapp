import "@fontsource/poppins";

export function AboutHero() {
  return (
    <section className="flex justify-center items-center py-10 bg-white">
      <div className="w-[945px] rounded-[20px] p-6 border border-blue-200 text-center shadow-md">
        <h2
          className="text-2xl font-bold mb-2"
          style={{ fontFamily: "Josefin Sans" }}
        >
          About Us
        </h2>
        <p
          className="text-gray-600 text-base leading-relaxed mb-6 max-w-xl mx-auto"
          style={{ fontFamily: "Josefin Sans" }}
        >
          At Saayam For All, we believe in the power of helping hands reaching
          out to those facing challenges.
        </p>
        <img
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/0284d0e04129ce41074d243ba3a3636a0a8a7c7c"
          alt="Helping hands"
          className="rounded-[20px] mx-auto w-full max-w-full object-cover"
        />
      </div>
    </section>
  );
}
