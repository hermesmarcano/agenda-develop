import React, { useState, useEffect } from "react";
import { FaCheckCircle, FaStore } from "react-icons/fa";
import SubscriptionCard from "./SubscriptionCard";
import instance from "../../../axiosConfig/axiosConfig";
import background from "../../../assets/sun-tornado.svg";

const Subscription = () => {
  const [plans, setPlans] = useState([]);

  useEffect(() => {
    instance.get("admin/plans").then((response) => {
      const plansData = response.data.plans;
      const plansArray = Object.keys(plansData).map((key) => ({
        ...plansData[key],
        name: key,
      }));
      setPlans(plansArray);
    });
  }, []);

  return (
    <div
      className="flex flex-col justify-center items-center gap-10 bg-gradient-to-r from-gray-500 to-gray-600 rounded-xl py-14 shadow-lg text-white"
      style={{
        backgroundImage: `url(${background})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
      }}
    >
      <div className="text-center mb-10">
        <h2 className="text-4xl font-bold mb-4">
          Register Your Shop with a Plan
        </h2>
        <p className="text-lg">
          We offer three different subscription plans to best fit your needs and
          budget. Choose the one that suits your shop the most.
        </p>
      </div>
      <div className="flex flex-wrap justify-center gap-6 w-full">
        {plans.map((plan, index) => (
          <SubscriptionCard key={index} plan={plan} />
        ))}
      </div>
      <div className="text-center mt-10 flex flex-col items-center">
        <FaStore className="text-6xl mb-4" />
        <FaCheckCircle className="text-4xl mb-2" />
        <h3 className="text-2xl font-bold mb-2">30-Day Money-Back Guarantee</h3>
        <p className="text-lg">
          If you’re not satisfied, we’re not satisfied. That’s why we offer a
          30-day money-back guarantee for all our plans.
        </p>
      </div>
    </div>
  );
};

export default Subscription;
