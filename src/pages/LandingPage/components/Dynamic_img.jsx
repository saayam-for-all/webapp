import React, { useState, useEffect } from 'react';
import "./Dynamic_img.css";
import FOOD1 from "../../../assets/carouselImages/food.jpg";
import FOOD2 from "../../../assets/carouselImages/food3.jpg";
import HANDS from "../../../assets/carouselImages/hands.jpg";
import HANDS2 from "../../../assets/carouselImages/hands2.jpg";
import HEALTH from "../../../assets/carouselImages/health.jpg";
import HEALTH2 from "../../../assets/carouselImages/health2.jpg";
import CLOTHES from "../../../assets/carouselImages/clothes.jpg";
import EDUCATION from "../../../assets/carouselImages/education3.jpg";
import REFERRALS from "../../../assets/carouselImages/referrals.jpeg";


const images = [
  FOOD1,
	FOOD2,
	HANDS,
	HEALTH,
	HANDS2,
	HEALTH2,
	CLOTHES,
	EDUCATION,
	REFERRALS,
];

const Images = () => {
  return (
    <div className="images">
      <div className="images-slide">
        {images.map((image) => (
          <img key={image} src={image}/>
        ))}
      </div>
    </div>
  );
};

export default Images;