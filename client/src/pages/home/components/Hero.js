import React, { useContext } from "react";
import { FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { HeroContext } from "../../../context/HeroContext";
import { useTranslation } from "react-i18next";

const Hero = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { heroData } = useContext(HeroContext);

  const handleSubmit = (event) => {
    event.preventDefault();
    const searchQuery = event.target.value.trim();
    navigate(`/shops?q=${encodeURIComponent(searchQuery)}`);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSubmit(event);
    }
  };

  // function ImageSlider() {
  //   const settings = {
  //     dots: true,
  //     infinite: true,
  //     speed: 500,
  //     slidesToShow: 1,
  //     slidesToScroll: 1,
  //     autoplay: true,
  //     autoplaySpeed: 3000,
  //   };

  //   return (
  //     <div className="overflow-x-hidden" style={{ minHeight: "510px" }}>
  //       <Slider {...settings}>
  //         {heroData.sliderDataImgs.map((sliderImg) => {
  //           return (
  //             <div>
  //               <img
  //                 src={sliderImg}
  //                 alt="slider"
  //                 className="w-full object-cover"
  //               />
  //             </div>
  //           );
  //         })}
  //       </Slider>
  //     </div>
  //   );
  // }

  return (
    <>
      {/* {heroData.heroStyle !== "slider" ? ( */}
      <div
        className={`bg-${heroData?.heroBgColor || "gray-800"} h-screen flex flex-col justify-center items-center`}
        // style={{ height: "calc(100vh - 56px)" }}
      >
        <h1 className={`text-5xl text-white bg-${"gray-800" || "gray-800"} font-bold mb-8`}>
          {heroData?.heroText || t("Find The Right Shop for Your Need")}
        </h1>
        <div className="w-2/3 md:w-1/3 lg:w-1/4 relative">
          <input
            type="text"
            name="search"
            placeholder={t("Search for a shop")}
            className="w-full py-3 pl-3 pr-2 text-white rounded-full bg-gray-700 focus:outline-none focus:shadow-outline"
            onKeyDown={handleKeyDown}
          />
          <FaSearch className="h-6 w-6 absolute top-0 right-0 mt-3 mr-3 text-gray-500" />
        </div>
      </div>
      {/* ) : (
        <ImageSlider />
      )} */}
    </>
  );
};

export default Hero;
