import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { HiHome, HiUser } from "react-icons/hi";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const handleSignOut = () => {
    localStorage.removeItem("ag_app_admin_token");
    navigate("/");
  };

  return (
    <header className="bg-gray-800 text-white py-4 px-6 flex justify-between items-center">
      <div className="flex items-center space-x-4">
        <button
          className="text-lg font-bold"
          onClick={() => {
            navigate("/");
          }}
        >
          {t('Admin Dashboard')}
        </button>
      </div>
      <div className="flex items-center space-x-4">
        <div className="relative">
          <button
            className="p-2"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <HiUser className="text-white text-xl" />
          </button>
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg">
              <div className="py-2">
                <p className="px-4 py-2 font-semibold text-gray-800">{t('Admin')}</p>
                <button
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                  onClick={handleSignOut}
                >
                  {t('Sign Out')}
                </button>
              </div>
            </div>
          )}
        </div>
        <button
          className="p-2"
          onClick={() => {
            navigate("/");
          }}
        >
          <HiHome className="text-white text-xl" />
        </button>
      </div>
    </header>
  );
};

export default Header;
