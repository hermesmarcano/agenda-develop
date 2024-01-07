import React, { useContext, useState } from "react";
import { MdClose } from "react-icons/md";
import { DarkModeContext } from "../context/DarkModeContext";

const Drawer = ({ modelState, setModelState, title, children }) => {
  const [closing, setClosing] = useState(false);
  const { isDarkMode } = useContext(DarkModeContext);

  const closeDrawer = () => {
    setClosing(true);
    setTimeout(() => {
      setModelState(false);
    }, 250);
  };

  const onAnimationEnd = () => {
    if (closing) {
      setClosing(false);
    }
  };

  return (
    <>
      <div
        className={`${
          modelState
            ? "overflow-y-hidden ease-in duration-300 fixed right-0 top-0 w-full h-screen bg-black/70 flex flex-col z-40"
            : "absolute top-0 left-[100%] ease-in duration-500"
        }`}
        onClick={closeDrawer}
      ></div>
      <div
        className={`${
          modelState
            ? `animate-drawer overflow-y-auto fixed right-0 top-0 w-[90%] sm:w-[60%] md:w-[40%] h-screen bg-${
              isDarkMode ? "gray-700" : "white"
            } shadow-xl flex flex-col z-50 ${
                closing ? "animate-drawer-out" : ""
              }`
            : "absolute top-0 animate-drawer-out left-[100%] ease-in duration-500"
        }`}
        onAnimationEnd={onAnimationEnd}
      >
        {modelState && (
          <div className="h-full w-full">
            <div className="h-full w-full flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between px-3 py-5 border-b border-b-gray-300">
                  <h1 className="text-lg  font-semibold  whitespace-nowrap">
                    {title}
                  </h1>
                  <button
                    onClick={closeDrawer}
                    className="text-sm p-3 flex items-center justify-center font-semibold rounded-full hover:bg-sky-100"
                  >
                    
                    <MdClose />
                  </button>
                </div>
                <div className="w-full h-full overflow-y-auto">{children}</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Drawer;
