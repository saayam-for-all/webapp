export function Vision() {
  return (
    <section className="bg-[#F3FBFF] py-16">
      <div className="max-w-[1100px] mx-auto flex flex-col md:flex-row justify-between items-start px-4 gap-6">
        {/* Left Text Block */}
        <div className="w-full md:w-[42%]">
          <h2 className="text-2xl font-bold mb-4">Our Vision</h2>
          <p className="text-gray-700 text-base leading-relaxed">
            Our vision is to cultivate a community where the ethos of "Manava
            Sevaye Madhava Seva" (Service to mankind is Service to God) and
            "Sarve jana sukhino bhavantu" (May all live happily) guides our
            actions, driving positive change and fostering a more compassionate
            and equitable world for all.
          </p>
        </div>

        {/* Right Image Grid */}
        <div className="grid grid-cols-2 gap-2 w-full md:w-[50%]">
          <img
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/9e489c91f28508597741986fff385e42dcf07f04"
            alt="Vision image 1"
            className="object-cover h-[150px] w-[95%] md:w-[70%] ml-[10px] md:ml-[50px] rounded-tl-[20px]  md:rounded-tl-none" // 👈 aligned right
          />
          <img
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/96f2577da3ff33600f091becd5353f37e9ec91fd"
            alt="Vision image 2"
            className="object-cover h-[210px] w-full md:ml-[-20px] rounded-tr-[20px]  md:rounded-tr-none"
          />
          <img
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/d69a9a1b73ece3f214ca700fdad2926ac86ffb47"
            alt="Vision image 3"
            className="object-cover h-[150px] w-[95%] md:w-[70%] mt-[-50px] ml-[10px] md:ml-[50px] rounded-bl-[20px]  md:rounded-bl-none" // 👈 aligned right
          />
          <img
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/7eed748020e8f83d968948c1754918c0f51ff363"
            alt="Vision image 4"
            className="object-cover h-[100px] w-full md:ml-[-20px] rounded-br-[20px]  md:rounded-br-none"
          />
        </div>
      </div>
    </section>
  );
}
