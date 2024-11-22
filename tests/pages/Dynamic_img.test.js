import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Images from '../../src/pages/LandingPage/components/Dynamic_img';
import React from 'react'

import Employment from "../../../assets/Landingpage_images/Employment.gif";
import Matrimonial from "../../../assets/Landingpage_images/Matrimonial.gif";
import Stocks from "../../../assets/Landingpage_images/Stocks.gif";
import Education from "../../../assets/Landingpage_images/education.gif";
import Finance from "../../../assets/Landingpage_images/Finance.gif";
import School from "../../../assets/Landingpage_images/School.gif";
import Clothes from "../../../assets/Landingpage_images/clothes.gif";
import Housing from "../../../assets/Landingpage_images/housing.gif";
import Food from "../../../assets/Landingpage_images/Food.gif";
import Shopping from "../../../assets/Landingpage_images/Shopping.gif";
import College_admissions from "../../../assets/Landingpage_images/college_admissions.gif";
import Gardening from "../../../assets/Landingpage_images/Gardening.gif";
import Sports from "../../../assets/Landingpage_images/Sports.gif";
import Cooking from "../../../assets/Landingpage_images/cooking.gif";
import { MemoryRouter } from 'react-router';

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
  Cooking
];

test('checks if images are rendered', () => {
  render(
  <MemoryRouter>
  <Images />
  </MemoryRouter>);

  const imgElements = screen.getAllByRole('img');
  
  expect(imgElements).toHaveLength(images.length);
  
  imgElements.forEach((img, index) => {
    expect(img).toHaveAttribute('src', images[index]);
  });
});
