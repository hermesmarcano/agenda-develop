import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import instance from "../axiosConfig/axiosConfig";

const Booking = () => {
  const params = useParams();

  const [currentShop, setCurrentShop] = useState({});
  useEffect(() => {
    instance.get(`/managers/shopname?urlSlug=${params.id}`).then((response) => {
      console.log(response.data);
      setCurrentShop(response.data);
    });
  }, []);
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 py-3">
      <div className="max-w-sm rounded overflow-hidden shadow-lg mb-4">
        {currentShop.profileImg ? (
          <div
            className="w-[300px] h-[200px] bg-no-repeat bg-cover bg-center"
            style={{
              backgroundImage: `url(http://localhost:4040/uploads/profile/${currentShop.profileImg})`,
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
        <Link to={`/shops/${params.id}/booking-service`}>
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white text-xl font-medium py-4 px-8 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            Book Now
          </button>
        </Link>
        <Link to={`/shops/${params.id}/signIn`}>
          <button className="bg-gray-700 hover:bg-gray-800 text-white text-xl font-medium py-4 px-8 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
            Sign In
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Booking;
