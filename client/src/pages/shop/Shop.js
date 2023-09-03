import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import instance from "../../axiosConfig/axiosConfig";
import { FiArrowRightCircle } from "react-icons/fi";
import ShopFooter from "./components/shopFooter";

const Shop = () => {
  const params = useParams();

  const [currentShop, setCurrentShop] = useState({});
  useEffect(() => {
    instance.get(`/managers/shop?urlSlug=${params.id}`).then((response) => {
      console.log(response.data);
      setCurrentShop(response.data);
    });
  }, []);
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
          Start Booking Now!
        </h1>
        <div className="flex items-center justify-center space-x-4">
          <Link to={`/shops/${params.id}/wizard`}>
            <button className="flex items-center bg-indigo-600 hover:bg-indigo-700 text-white text-xl font-medium py-3 px-6 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              Book Now
              <span className="ml-2">
                <FiArrowRightCircle />
              </span>
            </button>
          </Link>
        </div>
      </div>
      <div className="mt-auto">
        <ShopFooter />
      </div>
    </div>
  );
};

export default Shop;
