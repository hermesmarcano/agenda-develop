import React, { useState, useEffect, useRef } from "react";
import { MdKeyboardArrowRight, MdKeyboardArrowLeft } from "react-icons/md";


let count = 0;
let slideInterval;
export default function Carousel(props) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const slideRef = useRef();

  const removeAnimation = () => {
    slideRef.current.classList.remove("animate-fade-anim");
  };

  useEffect(() => {
    slideRef.current.addEventListener("animationend", removeAnimation);
    slideRef.current.addEventListener("mouseenter", pauseSlider);
    slideRef.current.addEventListener("mouseleave", startSlider);

    startSlider();
    return () => {
      pauseSlider();
    };
    // eslint-disable-next-line
  }, []);

  const startSlider = () => {
    slideInterval = setInterval(() => {
      handleOnNextClick();
    }, 3000);
  };

  const pauseSlider = () => {
    clearInterval(slideInterval);
  };

  const handleOnNextClick = () => {
    count = (count + 1) % props.sliderImages.length;
    setCurrentIndex(count);
    slideRef.current.classList.add("animate-fade-anim");
  };
  const handleOnPrevClick = () => {
    const productsLength = props.sliderImages.length;
    count = (currentIndex + productsLength - 1) % productsLength;
    setCurrentIndex(count);
    slideRef.current.classList.add("animate-fade-anim");
  };

  return (
    <div ref={slideRef} className="w-full select-none relative z-10">
      <div className="aspect-w-16 aspect-h-9">
        <img src={props.sliderImages[currentIndex]} alt="" />
      </div>

      <div className="absolute w-full top-1/2 transform -translate-y-1/2 px-3 flex justify-between items-center">
        <button
          className="bg-white shadow-2xl text-black p-1 rounded-full hover:bg-black hover:text-white cursor-pointer hover:bg-opacity-100 transition"
          onClick={handleOnPrevClick}
        >
          <MdKeyboardArrowLeft size={30} />
        </button>
        <button
          className="bg-white shadow-2xl text-black p-1 rounded-full hover:bg-black hover:text-white cursor-pointer hover:bg-opacity-100 transition"
          onClick={handleOnNextClick}
        >
          <MdKeyboardArrowRight size={30} />
        </button>
      </div>
    </div>
  )
}