import React, { useState, useEffect } from 'react';
import { FaCheck, FaTimes } from 'react-icons/fa';
import instance from '../../axiosConfig/axiosConfig';
import { useNavigate } from 'react-router-dom';
import './PlanSelectionPage.css'
import { IoMdClose } from 'react-icons/io';

export default function PlanSelectionPage() {
  const [plans, setPlans] = useState([]);
  const [planType, setPlanType] = useState([]);
  const token = localStorage.getItem('ag_app_shop_token');
  const navigate = useNavigate()

  const checkout = (plan) => {
    instance
      .post("managers/create-subscription-checkout-session", JSON.stringify({ plan: plan, type: planType}), {
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      })
      .then((response) => {
        if (response.status === 200){
          window.location = response.data.session.url;
        }else{
          return response.json().then((json) => Promise.reject(json));
        }
      })
      .catch((e) => {
        console.log(e.error);
      });
  };


  useEffect(() => {
    if(!token){
      navigate('/login')
    }
  }, [token])

  useEffect(() => {
    instance
      .get("admin/plans")
      .then((response) => {
        const plansArr = Object.keys(response.data.plans).map((key) => {
          return { name: key, ...response.data.plans[key] };
        });
        setPlans(plansArr);
      })
      .catch((error) => console.log(error));
  }, []);

  const [isMonthly, setIsMonthly] = useState(planType === 'monthly');

  const handleSwitch = () => {
    setIsMonthly(!isMonthly);
    setPlanType(isMonthly ? 'yearly' : 'monthly');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-68px)] bg-gray-100">
  <h1 className="text-4xl font-bold mb-10">Choose Your Plan</h1>
  <div className="flex items-center space-x-4">
    <div className="relative w-80 h-16 bg-gray-300 rounded-full flex items-center justify-between px-4 cursor-pointer" onClick={handleSwitch}>
      <span className={`text-gray-600 w-1/2 text-left font-bold text-xl pl-5 ${isMonthly ? "opacity-0" : ""}`}>Monthly</span>
      <div className={`absolute left-[50% ] w-40 h-16 font-bold text-xl text-white bg-teal-500 rounded-full flex items-center justify-center transform transition duration-200 ease-in-out ${isMonthly ? "-translate-x-[15px]" : "translate-x-[143px]"}`}>
        {isMonthly ? "Monthly" : "Yearly"}
      </div>
      <span className={`text-gray-600 w-1/2 text-right font-bold text-xl pr-5 ${isMonthly ? "" : "opacity-0"}`}>Yearly</span>
    </div>
  </div>
  <div className="flex flex-wrap justify-center items-center">
    {plans.map((plan, index) => (
      <PlanCard key={index} plan={plan} isMonthly={isMonthly} handleSwitch={handleSwitch} onClick={() => checkout(plan.name)} />
    ))}
  </div>
</div>
  );
}

const PlanCard = ({ plan, onClick, isMonthly, handleSwitch }) => {
  

  return (
    <div className="flex-1 min-w-[300px] flex flex-col max-w-lg items-center p-6 bg-white rounded-xl shadow-md space-y-6 m-4">
      <h2 className="text-2xl font-semibold text-gray-700 capitalize">{plan.name}</h2>
      <p className="text-xl text-gray-500">
        ${isMonthly ? plan.price : plan.annualPrice} <span className="text-sm">{isMonthly ? '/mo' : '/yr'}</span>
      </p>
      {/* <ul className="space-y-4">
        {Object.keys(plan.features).map((feature, index) => (
          <li key={index} className="flex items-center space-x-2">
            {plan.features[feature] ? <FaCheck className="text-green-500" /> : <FaTimes className="text-red-500" />}
            <span>{feature}</span>
          </li>
        ))}
      </ul> */}
      <ul className="space-y-4">
        <li className="flex items-center space-x-2">
          <FaCheck className="mr-1 text-green-500" />
          {plan.professionals} professionals
        </li>
        <li className="flex items-center space-x-2">
          <FaCheck className="mr-1 text-green-500" />
          {plan.customers} customers
        </li>
        <li className="flex items-center space-x-2">
          {plan.agenda ? <FaCheck className="mr-1 text-green-500" /> : <FaTimes className="mr-1 text-red-500" />}
          {plan.agenda ? "Agenda management" : "No agenda management"}
        </li>
        <li className="flex items-center space-x-2">
          {plan.businessAdmin ? <FaCheck className="mr-1 text-green-500" /> : <FaTimes className="mr-1 text-red-500" />}
          {plan.businessAdmin ? "Business administration" : "No business administration"}
        </li>
        <li className="flex items-center space-x-2">
          {plan.agendaLinkPage ? <FaCheck className="mr-1 text-green-500" /> : <FaTimes className="mr-1 text-red-500" />}
          {plan.agendaLinkPage ? "Reservation page" : "No Reservation page"}
        </li>
        <li className="flex items-center space-x-2">
          {plan.whatsAppIntegration ? <FaCheck className="mr-1 text-green-500" /> : <FaTimes className="mr-1 text-red-500" />}
          {plan.whatsAppIntegration ? "WhatsApp integration" : "No WhatsApp integration"}
        </li>
        <li className="flex items-center space-x-2">
          {plan.appointmentReminders ? <FaCheck className="mr-1 text-green-500" /> : <FaTimes className="mr-1 text-red-500" />}
          {plan.appointmentReminders ? "Appointment reminders" : "No appointment reminders"}
        </li>
      </ul>
      <button
        className="px-4 py-2 text-white bg-teal-500 rounded-md hover:bg-teal-600 focus:outline-none focus:bg-teal-600"
        onClick={onClick}
      >
        Subscribe Now
      </button>
    </div>
  );
};

