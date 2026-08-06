"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, EffectFade } from "swiper/modules";
import slide1 from "../../assets/slides/slide1.jpg"
import slide2 from "../../assets/slides/slide2.jpg"
import slide3 from "../../assets/slides/slide3.jpg"

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import { useUser } from "../../store/useUser";
import OrangeButton from "../../ui/OrangeButton";


const slides = [
  {
    id: 1,
    image: slide1,
    title: "Flavor Worth Savoring",
    subtitle: "Freshly prepared dishes made to turn every bite into a moment.",
  },
  {
    id: 2,
    image: slide2,
    title: "Crafted From the Finest",
    subtitle: "Quality ingredients, thoughtful recipes, and flavors made with care.",
  },
  {
    id: 3,
    image: slide3,
    title: "Made for Every Craving",
    subtitle: "Comforting favorites and bold tastes, served fresh every time.",
  },
];

const ImageCarousel = () => {

  return (
    <div className={"w-full relative h-150"}>
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
            <div className="relative h-full w-full">
              {/* Background Image */}
              <img
                draggable="false"
                src={slide.image}
                alt={slide.title}
                className="h-full w-full object-cover"
              />

              {/* Dark Overlay */}
              <div className="absolute inset-0 bg-black/40" />

              {/* Text Content */}
              <div className="absolute inset-0 flex flex-col items-start justify-center ml-10 px-6 text-center text-white">
                <h3 className="animate-fadeIn mb-4 text-sm">WELCOME</h3>
                <h2 className="animate-fadeIn mb-4 text-4xl font-bold md:text-5xl">
                  {slide.title}
                </h2>
                <p className="animate-fadeUp mb-4 text-gray-300 max-w-2xl text-lg md:text-lg">
                  {slide.subtitle}
                </p>

                <OrangeButton text={"Order Now"}/>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default ImageCarousel;
