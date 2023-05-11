import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { animateScroll } from "react-scroll";
import websiteTitleContext from "../context/WebsiteTitleContext";

function Navbar() {
  const [isOpen, setIsOpen] = React.useState(false);
  const { websiteTitle } = useContext(websiteTitleContext);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="mx-auto px-4 py-2 max-w-screen-lg flex items-center justify-between">
        <div className="flex items-center">
          <Link to="/" className="text-gray-800 font-bold text-lg">
            {websiteTitle}
          </Link>
          <button
            className="ml-4 md:hidden text-gray-800 focus:outline-none"
            onClick={toggleMenu}
          >
            <svg
              className="h-6 w-6 fill-current"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                className={`${isOpen ? "hidden" : "block"}`}
                d="M4 6h16M4 12h16M4 18h16"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                className={`${isOpen ? "block" : "hidden"}`}
                d="M6 18L18 6M6 6l12 12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
        <div className={`hidden md:flex md:flex-row items-center`}>
          <Link
            to="#"
            className="py-2 px-4 text-gray-800 md:mx-2 transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-110"
            // onClick={()=>scrollToSection()}
          >
            Home
          </Link>
          <button
            onClick={() => animateScroll.scrollTo(650)}
            className="py-2 px-4 text-gray-800 md:mx-2 transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-110"
          >
            Shops
          </button>
          <button
            onClick={() => animateScroll.scrollTo(1100)}
            className="py-2 px-4 text-gray-800 md:mx-2 transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-110"
          >
            Articles
          </button>
          <button
            onClick={() => animateScroll.scrollTo(2500)}
            className="py-2 px-4 text-gray-800 md:mx-2 transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-110"
          >
            Services
          </button>
          <Link
            to="/shops"
            className="py-2 px-4 text-white rounded-full bg-gray-800 md:mx-2 transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-110"
          >
            Find Shops
          </Link>
        </div>
      </div>
      {/* Mobile menu */}
      <div className={`${isOpen ? "block" : "hidden"} md:hidden  py-2`}>
        <Link
          to="#"
          className="block py-2 px-4 text-gray-800 text-center transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-110"
          // onClick={()=>scrollToSection()}
        >
          Home
        </Link>
        <button
          onClick={() => animateScroll.scrollTo(800)}
          className="block w-full py-2 px-4 text-gray-800 text-center transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-110"
          // onClick={scrollToShopSection}
        >
          Shops
        </button>
        <button
          onClick={() => animateScroll.scrollTo(1300)}
          className="block w-full py-2 px-4 text-gray-800 text-center transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-110"
        >
          Articles
        </button>
        <button
          onClick={() => animateScroll.scrollTo(3550)}
          className="block w-full py-2 px-4 text-gray-800 text-center transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-110"
        >
          Services
        </button>
        <Link
          to="/shops"
          className="block py-2 px-4 mx-auto w-fit text-white rounded-full bg-gray-800 md:mx-2 transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-110"
        >
          Find Shops
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;
