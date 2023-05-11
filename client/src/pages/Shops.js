import React, { useState, useMemo, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import ShopCard from "../components/ShopCard";
import { FaSearch } from "react-icons/fa";
import instance from "../axiosConfig/axiosConfig";
import { useLocation } from "react-router-dom";

const ShopSelection = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const searchQueryFromURL = searchParams.get("q");
  const [selectedShop, setSelectedShop] = useState(null);
  const [searchQuery, setSearchQuery] = useState(searchQueryFromURL || "");
  const [currentPage, setCurrentPage] = useState(1);
  const [shopsPerPage] = useState(4);
  const navigate = useNavigate();

  useEffect(() => {
    const searchParams = new URLSearchParams();
    searchParams.set("q", searchQuery);
    const newURL = `${location.pathname}?${searchParams.toString()}`;
    window.history.replaceState(null, "", newURL);
  }, [searchQuery, location.pathname]);

  const [shops, setShops] = useState([]);
  useEffect(() => {
    instance.get("/managers/shops").then((response) => {
      setShops(response.data);
    });
  }, []);

  const handleShopSelection = (shop) => {
    const shopUrlSlug = decodeURIComponent(shop.urlSlug);
    setSelectedShop(shop);
    // Implement logic to navigate to the next page with the selected shop ID
    navigate(`/shops/${shopUrlSlug}`);
  };

  const handleSearchQueryChange = (event) => {
    setSearchQuery(event.target.value);
    setCurrentPage(1);
  };

  const filteredShops = useMemo(() => {
    return shops.filter((shop) =>
      shop.shopName.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [shops, searchQuery]);

  const indexOfLastShop = currentPage * shopsPerPage;
  const indexOfFirstShop = indexOfLastShop - shopsPerPage;
  const currentShops = filteredShops.slice(indexOfFirstShop, indexOfLastShop);

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(filteredShops.length / shopsPerPage); i++) {
    pageNumbers.push(i);
  }

  const handlePageChange = (event, pageNumber) => {
    setCurrentPage(Number(pageNumber));
  };

  const handlePrevClick = () => {
    setCurrentPage(currentPage - 1);
  };

  const handleNextClick = () => {
    setCurrentPage(currentPage + 1);
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="container mx-auto pt-10">
        <h1 className="text-5xl font-extrabold text-center text-gray-900 mb-8">
          Choose a Shop
        </h1>
        <div className="flex items-center justify-center mb-4">
          <input
            type="text"
            placeholder="Search shops"
            value={searchQuery}
            onChange={handleSearchQueryChange}
            className="py-2 px-4 sm:w-64 rounded-md border-gray-300 shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
          <FaSearch className="ml-2 text-gray-500" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4 px-4">
          {currentShops.map((shop, index) => (
            <div
              key={index}
              className="max-w-sm rounded overflow-hidden shadow-lg cursor-pointer mx-auto w-full"
              onClick={() => handleShopSelection(shop)}
            >
              {shop.profileImg ? (
                <div
                  className="w-full h-40 bg-no-repeat bg-cover bg-center"
                  style={{
                    backgroundImage: `url(http://localhost:4040/uploads/profile/${shop.profileImg})`,
                  }}
                ></div>
              ) : (
                <img
                  className="w-full h-40"
                  src="https://placehold.it/300x200"
                  alt="shop name"
                />
              )}

              <div className="px-6 py-4">
                <div className="font-bold text-xl mb-2">{shop.shopName}</div>
              </div>
            </div>
          ))}
        </div>
        {currentShops.length === 0 && (
          <div className="flex flex-col items-center justify-center mt-8">
            <div className="mb-4">
              <svg
                className="h-16 w-16 text-gray-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 3a7 7 0 100 14 7 7 0 000-14zM2.472 8.528A7 7 0 010 6a8 8 0 003.938 6.905l-1.466 1.466a10.001 10.001 0 015.895-5.895L9.462 7.04a8.018 8.018 0 00-6.99 1.489z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <p className="text-gray-500 mb-2">No result found</p>
            <p className="text-gray-500">
              Please adjust your search criteria and try again.
            </p>
          </div>
        )}
        <nav className="flex justify-center mt-4 pb-5">
          <button
            onClick={handlePrevClick}
            className={`${
              currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
            } bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-l-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
            disabled={currentPage === 1}
          >
            Prev
          </button>
          {pageNumbers.map((number) => (
            <button
              key={number}
              onClick={(event) => handlePageChange(event, number)}
              className={`
                ${
                  currentPage === number
                    ? "bg-indigo-600 text-white"
                    : "bg-white text-gray-500 hover:bg-gray-50"
                }
                border border-gray-300
                font-medium
                py-2 px-4
                focus:outline-none
                focus:ring-offset-2
                focus:ring-indigo-500
              `}
            >
              {number}
            </button>
          ))}
          <button
            onClick={handleNextClick}
            className={`${
              currentPage === pageNumbers.length
                ? "opacity-50 cursor-not-allowed"
                : ""
            } bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-r-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
            disabled={currentPage === pageNumbers.length}
          >
            Next
          </button>
        </nav>
        {selectedShop && (
          <Link to={`/booking-start`}>
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white text-xl font-medium py-4 px-8 rounded-full mt-8 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              Continue
            </button>
          </Link>
        )}
      </div>
    </div>
  );
};

export default ShopSelection;
