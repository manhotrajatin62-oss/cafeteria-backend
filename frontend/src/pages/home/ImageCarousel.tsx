"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, EffectFade } from "swiper/modules";
import slide1 from "../../assets/slides/slide1.jpg"
import slide2 from "../../assets/slides/slide2.jpg"
import slide3 from "../../assets/slides/slide3.jpg"

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

const slides = [
  {
    id: 1,
    image: slide1,
    title: "Fresh & Delicious",
    subtitle: "Experience premium taste every day",
  },
  {
    id: 2,
    image: slide2,
    title: "Crafted With Passion",
    subtitle: "Quality ingredients. Perfect flavors.",
  },
  {
    id: 3,
    image: slide3,
    title: "Made For Food Lovers",
    subtitle: "Serving happiness on every plate.",
  },
];

const ImageCarousel = () => {
  return (
    <div className="relative h-100 w-200">
      <Swiper
        modules={[Autoplay, Pagination, EffectFade]}
        effect="fade"
        loop={true}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        pagination={{ clickable: true }}
        className="h-full"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div className="relative h-100 w-full">
              {/* Background Image */}
              <img
                src={slide.image}
                alt={slide.title}
                className="h-full w-full object-cover"
              />

              {/* Dark Overlay */}
              <div className="absolute inset-0 bg-black/40" />

              {/* Text Content */}
              <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center text-white">
                <h2 className="animate-fadeIn mb-4 text-4xl font-bold md:text-5xl">
                  {slide.title}
                </h2>
                <p className="animate-fadeUp max-w-2xl text-lg md:text-xl">
                  {slide.subtitle}
                </p>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default ImageCarousel;
