import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

function NotFound() {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
            404
          </h1>
          <p className="mt-2 text-2xl font-medium text-gray-600 sm:text-3xl">
            {t("Page not found")}
          </p>
          <p className="mt-2 text-base text-gray-500">
            {t("Sorry, we couldn't find the page you're looking for.")}
          </p>
          <div className="mt-6">
            <Link
              to="/"
              className="bg-sky-500 hover:bg-sky-600 text-white font-bold py-2 px-4 rounded mt-8"
            >
              {t("Return to Dashboard")}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NotFound;
