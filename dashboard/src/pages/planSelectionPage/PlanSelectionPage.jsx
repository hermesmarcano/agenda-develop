import React, { useState, useEffect } from 'react';
import { FaCheck, FaTimes } from 'react-icons/fa';
import instance from '../../axiosConfig/axiosConfig';
import { useNavigate } from 'react-router-dom';

export default function PlanSelectionPage() {
  const [plans, setPlans] = useState([]);
  const token = localStorage.getItem('ag_app_shop_token');
  const navigate = useNavigate()

  const checkout = (plan) => {
    instance
      .post("managers/create-subscription-checkout-session", JSON.stringify({ plan: plan}), {
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

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-4xl font-bold mb-10">Choose Your Plan</h1>
      <div className="flex flex-wrap justify-center items-center">
        {plans.map((plan, index) => (
          <PlanCard key={index} plan={plan} onClick={() => checkout(plan.name)} />
        ))}
      </div>
    </div>
  );
}

const PlanCard = ({ plan, onClick }) => {
  return (
    <div className="flex-1 min-w-[250px] flex flex-col max-w-lg items-center p-4 border rounded-lg shadow-lg bg-teal-500 m-4">
      <h3 className="text-lg font-bold text-white">{plan.name.toUpperCase()}</h3>
      <p className="text-xl font-bold mt-2 text-white">
        <span>$</span>
        {plan.price} <span className="self-end">/mo</span>
      </p>
      {/* <p className="text-md font-bold mt-2 text-white">
        Promotional Price: <span>$</span>
        {plan.promotionalPrice} <span className="self-end">/mo</span>
      </p> */}
      <p className="text-md font-bold mt-2 text-white">
        Annual Price: <span>$</span>
        {plan.annualPrice}
      </p>
      <ul className="mt-4 text-sm text-white list-none">
        <li className="flex items-center">
          <FaCheck className="mr-2 text-gray-700" />
          {plan.professionals} professionals
        </li>
        <li className="flex items-center">
          <FaCheck className="mr-2 text-gray-700" />
          {plan.customers} customers
        </li>
        <li className="flex items-center">
          {plan.agenda ? <FaCheck className="mr-2 text-gray-700" /> : <FaTimes className="mr-2 text-red-700" />}
          {plan.agenda ? "Agenda management" : "No agenda management"}
        </li>
        <li className="flex items-center">
          {plan.businessAdmin ? <FaCheck className="mr-2 text-gray-700" /> : <FaTimes className="mr-2 text-red-700" />}
          {plan.businessAdmin ? "Business administration" : "No business administration"}
        </li>
        <li className="flex items-center">
          {plan.agendaLinkPage ? <FaCheck className="mr-2 text-gray-700" /> : <FaTimes className="mr-2 text-red-700" />}
          {plan.agendaLinkPage ? "Reservation page" : "No Reservation page"}
        </li>
        <li className="flex items-center">
          {plan.whatsAppIntegration ? <FaCheck className="mr-2 text-gray-700" /> : <FaTimes className="mr-2 text-red-700" />}
          {plan.whatsAppIntegration ? "WhatsApp integration" : "No WhatsApp integration"}
        </li>
        <li className="flex items-center">
          {plan.appointmentReminders ? <FaCheck className="mr-2 text-gray-700" /> : <FaTimes className="mr-2 text-red-700" />}
          {plan.appointmentReminders ? "Appointment reminders" : "No appointment reminders"}
        </li>
      </ul>
      <button
        className="mt-4 px-4 py-2 rounded-md font-semibold bg-white border border-teal-600 text-teal-500 shadow-lg hover:bg-green-500 hover:text-white hover:opacity-80 transition-opacity duration-300"
        onClick={onClick}
      >
        Subscribe Now
      </button>
    </div>
  );
};

