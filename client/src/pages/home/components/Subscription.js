import React from "react";
import SubscriptionCard from "./SubscriptionCard";
import { FaCheckCircle } from "react-icons/fa";

const Subscription = () => {
  const businessPlan = {
    name: "business",
    price: 50,
    professionals: 10,
    customers: 50000,
    agenda: true,
    businessAdmin: true,
    whatsAppIntegration: true,
    appointmentReminders: true,
  };
  const professionalPlan = {
    name: "professional",
    price: 30,
    professionals: 10,
    customers: 600,
    agenda: true,
    businessAdmin: true,
    whatsAppIntegration: true,
    appointmentReminders: false,
  };
  const personalPlan = {
    name: "personal",
    price: 10,
    professionals: 10,
    customers: 250,
    agenda: true,
    businessAdmin: true,
    whatsAppIntegration: false,
    appointmentReminders: false,
  };
  return (
    <div className="flex flex-wrap justify-center items-center gap-10 bg-gradient-to-r from-gray-500 to-gray-600 rounded-xl py-14 shadow-lg text-white">
      <div className="text-center mb-10">
        <h2 className="text-4xl font-bold mb-4">Choose Your Plan</h2>
        <p className="text-lg">
          We offer three different subscription plans to best fit your needs.
          Explore them.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <SubscriptionCard plan={businessPlan} />
        <SubscriptionCard plan={professionalPlan} />
        <SubscriptionCard plan={personalPlan} />
      </div>
      <div className="text-center mt-10">
        <FaCheckCircle className="mx-auto text-4xl mb-2" />
        <h3 className="text-2xl font-bold mb-2">30-Day Money-Back Guarantee</h3>
        <p className="text-lg">
          If you're not satisfied, we're not satisfied. That's why we offer a
          30-day money-back guarantee.
        </p>
      </div>
    </div>
  );
};

export default Subscription;
