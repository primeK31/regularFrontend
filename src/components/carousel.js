// src/components/Carousel.js

import React from 'react';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Carousel = ({ items }) => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: true
  };

  return (
    <div className="justify-center items-center">
      <Slider {...settings}>
        {items.map((item, index) => (
          <div key={index} className="px-2"> {/* Add horizontal padding to create spacing */}
            <div className="w-full flex justify-center items-center h-48">
              {item}
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default Carousel;
