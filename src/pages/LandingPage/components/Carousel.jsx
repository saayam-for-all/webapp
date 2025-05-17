import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles and modules
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";

import carouselFive from "../../../assets/landingPageImages/carousel_five.jpg";
import carouselFour from "../../../assets/landingPageImages/carousel_four.jpg";
import carouselOne from "../../../assets/landingPageImages/carousel_one.jpg";
import carouselThree from "../../../assets/landingPageImages/carousel_three.jpg";
import carouselTwo from "../../../assets/landingPageImages/carousel_two.jpg";
import "./Carousel.css";

import {
  Autoplay,
  EffectCoverflow,
  Navigation,
  Pagination,
} from "swiper/modules";

export default function Carousel() {
  return (
    // <div className="flex flex-col items-center justify-center w-full bg-white mb-10 h-[400px]">
    //   <Swiper
    //     effect={"coverflow"}
    //     grabCursor={true}
    //     centeredSlides={true}
    //     slidesPerView={2}
    //     coverflowEffect={{
    //       rotate: 0,
    //       stretch: 0,
    //       depth: 100,
    //       modifier: 3,
    //       slideShadows: false,
    //     }}
    //     autoplay={{
    //       delay: 2500,
    //       disableOnInteraction: false,
    //     }}
    //     pagination={{
    //       el: ".swiper-custom-pagination",
    //     }}
    //     loop={true}
    //     navigation={{
    //       nextEl: ".custom-swiper-button-next",
    //       prevEl: ".custom-swiper-button-prev",
    //     }}
    //     modules={[Autoplay, EffectCoverflow, Pagination, Navigation]}
    //     className="mySwiper h-[400px]"
    //   >
    //     <SwiperSlide className="h-[400px] flex items-center justify-center">
    //       <div className="h-full w-full flex items-center justify-center">
    //         <img
    //           src={carouselOne}
    //           className="h-full w-full object-contain"
    //           alt="Smiling children joyfully pose with peace signs in hand, their faces close together, conveying a playful and cheerful atmosphere on a sunny day."
    //         />
    //         <div className="absolute bottom-1/4 left-[100px] transform -translate-x-1/2 text-white font-bold text-4xl px-3 py-1 rounded">
    //           School
    //         </div>
    //       </div>
    //     </SwiperSlide>
    //     <SwiperSlide className="h-[400px] flex items-center justify-center">
    //       <div className="h-full w-full flex items-center justify-center">
    //         <img
    //           src={carouselTwo}
    //           className="h-full w-full object-contain"
    //           alt="A volunteer in a colorful shirt and red cap faces away, holding up a smartphone. "
    //         />
    //         <div className="absolute bottom-1/4 left-[140px] transform -translate-x-1/2 text-white font-bold text-4xl px-3 py-1 rounded">
    //           General Help
    //         </div>
    //       </div>
    //     </SwiperSlide>
    //     <SwiperSlide className="h-[400px] flex items-center justify-center">
    //       <div className="h-full w-full flex items-center justify-center">
    //         <img
    //           src={carouselThree}
    //           className="h-full w-full object-contain"
    //           alt="A person wearing a mask and a green sweater sorts through paper bags in a food pantry."
    //         />
    //         <div className="absolute bottom-1/4 left-[140px] transform -translate-x-1/2 text-white font-bold text-4xl px-3 py-1 rounded">
    //           Giving
    //         </div>
    //       </div>
    //     </SwiperSlide>
    //     <SwiperSlide className="h-[400px] flex items-center justify-center">
    //       <div className="h-full w-full flex items-center justify-center">
    //         <img
    //           src={carouselFour}
    //           className="h-full w-full object-contain"
    //           alt="A group of children sit on the floor indoors, smiling and looking ahead, with adults in the background."
    //         />
    //         <div className="absolute bottom-1/4 left-[140px] transform -translate-x-1/2 text-white font-bold text-4xl px-3 py-1 rounded">
    //           Laughter
    //         </div>
    //       </div>
    //     </SwiperSlide>
    //     <SwiperSlide className="h-[400px] flex items-center justify-center">
    //       <div className="h-full w-full flex items-center justify-center">
    //         <img
    //           src={carouselFive}
    //           className="h-full w-full object-contain"
    //           alt="Two people gently touch hands, conveying comfort and connection."
    //         />
    //         <div className="absolute bottom-1/4 left-[140px] transform -translate-x-1/2 text-white font-bold text-4xl px-3 py-1 rounded">
    //           Connection
    //         </div>
    //       </div>
    //     </SwiperSlide>
    //   </Swiper>
    //   {/* Minimal Arrows */}
    //   <div className="w-fit flex justify-center items-center px-6 z-10 text-xl font-bold gap-5">
    //     <button className="custom-swiper-button-prev text-gray-400 text-4xl hover:text-gray-600">
    //       ‹
    //     </button>
    //     <button className="custom-swiper-button-next text-gray-400 text-4xl hover:text-gray-600">
    //       ›
    //     </button>
    //   </div>
    // </div>
    <div className="flex flex-col items-center justify-center w-full bg-white mb-10 ">
      <Swiper
        effect={"coverflow"}
        grabCursor={true}
        centeredSlides={true}
        slidesPerView={1.2}
        breakpoints={{
          640: { slidesPerView: 1.5 },
          768: { slidesPerView: 2 },
        }}
        coverflowEffect={{
          rotate: 0,
          stretch: 0,
          depth: 100,
          modifier: 3,
          slideShadows: true,
        }}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        pagination={{ el: ".swiper-custom-pagination" }}
        loop={true}
        navigation={{
          nextEl: ".custom-swiper-button-next",
          prevEl: ".custom-swiper-button-prev",
        }}
        modules={[Autoplay, EffectCoverflow, Pagination, Navigation]}
        className="mySwiper h-[300px] md:h-[500px]"
      >
        {[
          carouselOne,
          carouselTwo,
          carouselThree,
          carouselFour,
          carouselFive,
        ].map((src, i) => (
          <SwiperSlide
            key={i}
            className="h-[300px] md:h-[400px] flex items-center justify-center relative w-[240px] sm:w-[280px] md:w-[300px] aspect-[3/2]"
          >
            <img
              src={src}
              className="h-full w-full object-cover rounded-lg"
              alt={`Slide ${i + 1}`}
            />
            <div className="absolute bottom-[20%] left-1/2 transform -translate-x-1/2 text-white font-bold text-xl sm:text-2xl md:text-4xl text-center px-3 py-1 rounded-2xl">
              {
                ["School", "General Help", "Giving", "Laughter", "Connection"][
                  i
                ]
              }
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Arrows */}
      <div className="w-fit flex justify-center items-center mt-4 px-6 text-xl font-bold gap-5">
        <button className="custom-swiper-button-prev text-gray-400 text-4xl hover:text-gray-600">
          ‹
        </button>
        <button className="custom-swiper-button-next text-gray-400 text-4xl hover:text-gray-600">
          ›
        </button>
      </div>
    </div>
  );
}
