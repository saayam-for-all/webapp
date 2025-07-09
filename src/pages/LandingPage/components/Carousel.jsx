import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
// Keep only one useTranslation import. This one is sufficient.
import { useTranslation } from "react-i18next";

// Import Swiper styles and modules
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";

import carouselFive from "../../../assets/landingPageImages/carousel_five.jpg";
import carouselFour from "../../../assets/landingPageImages/carousel_four.jpg";
import carouselOne from "../../../assets/landingPageImages/carousel_one.jpg";
import carouselSix from "../../../assets/landingPageImages/carousel_six.jpg";
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
  const { t } = useTranslation();

  const carouselTitles = [
    "Food and Essentials Support",       
    "Clothing Support",                  
    "Education and Career Support",      
    "Healthcare and Wellbeing Support",  
    "Housing Support",                   
    "General Support",                   
  ];

  return (
    <div className="flex flex-col items-center justify-center w-full bg-white mb-12 ">
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
        className="mySwiper h-[350px] md:h-[350px]"
      >
        {[
          carouselOne,
          carouselTwo,
          carouselThree,
          carouselFour,
          carouselFive,
          carouselSix,
        ].map((src, i) => (
          <SwiperSlide
            key={i}
            className="flex items-center justify-center relative w-[240px] sm:w-[280px] md:w-[300px] aspect-[3/2]"
          >
            <img
              src={src}
              className="h-full w-full object-cover rounded-lg"
              alt={`${t("CAROUSEL_SLIDE_ALT_PREFIX")} ${i + 1}`}
            />
            <div className="absolute bottom-[5%] left-1/2 transform -translate-x-1/2 text-white font-bold text-xl sm:text-2xl md:text-3xl text-center px-3 py-1 rounded-2xl">
              {t(carouselTitles[i])}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="w-fit flex justify-center items-center mt-4 px-6 text-xl font-bold gap-5">
        <button className="custom-swiper-button-prev text-gray-600 text-4xl hover:text-gray-600">
          ‹
        </button>
        <button className="custom-swiper-button-next text-gray-600 text-4xl hover:text-gray-600">
          ›
        </button>
      </div>
    </div>
  );
}