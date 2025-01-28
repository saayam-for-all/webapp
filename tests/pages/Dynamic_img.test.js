import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Images from "../../src/pages/LandingPage/components/Dynamic_img";
import React from "react";

import Employment from "../../src/assets/Landingpage_images/Employment.gif";
import Matrimonial from "../../src/assets/Landingpage_images/Matrimonial.gif";
import Stocks from "../../src/assets/Landingpage_images/Stocks.gif";
import Education from "../../src/assets/Landingpage_images/education.gif";
import Finance from "../../src/assets/Landingpage_images/Finance.gif";
import School from "../../src/assets/Landingpage_images/School.gif";
import Clothes from "../../src/assets/Landingpage_images/clothes.gif";
import Housing from "../../src/assets/Landingpage_images/housing.gif";
import Food from "../../src/assets/Landingpage_images/Food.gif";
import Shopping from "../../src/assets/Landingpage_images/Shopping.gif";
import College_admissions from "../../src/assets/Landingpage_images/college_admissions.gif";
import Gardening from "../../src/assets/Landingpage_images/Gardening.gif";
import Sports from "../../src/assets/Landingpage_images/Sports.gif";
import Cooking from "../../src/assets/Landingpage_images/cooking.gif";
import { MemoryRouter } from "react-router";

const images = [
  Employment,
  Matrimonial,
  Stocks,
  Education,
  Finance,
  School,
  Clothes,
  Housing,
  Food,
  Shopping,
  College_admissions,
  Gardening,
  Sports,
  Cooking,
];

test("checks if images are rendered", () => {
  render(
    <MemoryRouter>
      <Images />
    </MemoryRouter>,
  );

  const imgElements = screen.getAllByRole("img");

  expect(imgElements).toHaveLength(images.length);

  imgElements.forEach((img, index) => {
    expect(img).toHaveAttribute("src", images[index]);
  });
});
