import React from "react";
import { useTranslation } from "react-i18next";
import { FiArrowLeft } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const CheckEmail = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="max-w-md w-full px-6 py-8 bg-white shadow-md rounded-md">
        <h1 className="text-2xl font-bold mb-6">{t("Check Your Email")}</h1>
        <p className="text-gray-600 mb-6">
          {t(
            "An email has been sent to your registered email address with a reset link. Please check your inbox and follow the instructions to reset your password."
          )}
        </p>
        <button
          className="flex items-center text-sm text-gray-600 hover:text-gray-800"
          onClick={handleBack}
        >
          <FiArrowLeft className="mr-1" />
          {t("Back")}
        </button>
      </div>
    </div>
  );
};

export default CheckEmail;
