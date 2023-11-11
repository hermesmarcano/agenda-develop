import React, { useEffect, useState } from "react";
import {  useNavigate, useParams } from "react-router-dom";
import instance from "../../axiosConfig/axiosConfig";
import { FaBook } from "react-icons/fa";
import ShopFooter from "./components/shopFooter";
import { useTranslation } from "react-i18next";

const Shop = () => {
  const { t } = useTranslation();
  const params = useParams();
  const navigate = useNavigate()

  const [currentShop, setCurrentShop] = useState({});
  useEffect(() => {
    instance.get(`/managers/shop?urlSlug=${params.id}`).then((response) => {
      console.log(response.data);
      setCurrentShop(response.data);
    });
  }, []);

const handleStartBooking = () => {
  localStorage.clear();
  navigate(`/shops/${params.id}/wizard`)
}

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="mt-auto">
        <div className="w-fit mx-auto rounded overflow-hidden shadow-lg mb-4">
          {currentShop.profileImg ? (
            <div
            className="w-[300px] h-[200px] bg-no-repeat bg-cover bg-center"
            style={{
              backgroundImage: `url(${currentShop.profileImg})`,
            }}
          ></div>
          
          ) : (
            <img
              className="w-full"
              src="https://placehold.it/300x200"
              alt="shop name"
            />
          )}
        </div>
        <h1 className="text-5xl font-extrabold mb-8 text-gray-900">
          {t('Start Booking Now!')}
        </h1>
        <div className="flex items-center justify-center space-x-4">
            <button onClick={handleStartBooking} className="flex items-center bg-teal-600 hover:bg-teal-700 text-white text-xl font-medium py-3 px-6 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              {t('Book Now')}
              <span className="ml-2">
                <FaBook />
              </span>
            </button>
        </div>
      </div>
      <div className="mt-auto">
        <ShopFooter />
      </div>
    </div>
  );
};

export default Shop;
