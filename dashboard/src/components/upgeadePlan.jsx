import React, { useEffect, useState } from "react";
import { FaArrowUp, FaInfoCircle } from "react-icons/fa";
import { Link } from "react-router-dom";
import instance from "../axiosConfig/axiosConfig";

const UpgradePlan = () => {
  const [currentSubscription, setCurrentSubscription] = useState("");
  useEffect(() => {
    instance
      .get("managers/plan", {
        headers: {
          Authorization: localStorage.getItem("ag_app_shop_token"),
        },
      })
      .then((response) => {
        setCurrentSubscription(response.data.subscription.name);
      });
  }, []);
  return (
    <div className="bg-white rounded-lg p-6 w-full">
      <h2 className="text-2xl font-semibold text-gray-700 mb-4 flex items-center">
        <FaInfoCircle className="inline-block mr-2" />
        You've Reached the Limit of Your Current Plan
      </h2>
      <p className="text-gray-600 mb-6">
        {`To unlock additional features and increase your limit, consider upgrading to our ${
          currentSubscription === "personal"
            ? "Professional or Business plan"
            : "Business plan"
        }.`}
      </p>
      <Link
        to="/subscribe"
        className="flex items-center justify-center bg-teal-500 text-white rounded-md px-4 py-2 mt-4 hover:bg-teal-600 transition-colors duration-200"
      >
        <FaArrowUp className="mr-2" />
        Upgrade Plan
      </Link>
    </div>
  );
};

export default UpgradePlan;
