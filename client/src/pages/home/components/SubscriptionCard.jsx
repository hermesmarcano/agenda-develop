import React from "react";
import { Link } from "react-router-dom";

function CheckIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
      className="h-3 w-3"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4.5 12.75l6 6 9-13.5"
      />
    </svg>
  );
}

export function SubscriptionCard({ plan }) {
  return (
    <div className="w-full max-w-[20rem] p-8 bg-gradient-to-r from-gray-600 to-gray-800 rounded-lg shadow">
      <div className="m-0 mb-8 rounded-none border-b border-white/10 pb-8 text-center">
        <p className="font-normal uppercase text-white text-sm">{plan.name}</p>
        <div className="mt-6 flex justify-center gap-1 text-7xl font-normal text-white">
          <span className="mt-2 text-4xl">$</span>
          {plan.price} <span className="self-end text-4xl">/mo</span>
        </div>
      </div>
      <div className="p-0">
        <ul className="flex flex-col gap-4">
          <li className="flex items-center gap-4">
            <span className="rounded-full border border-white/20 bg-white/20 p-1">
              <CheckIcon />
            </span>
            <p className="font-normal text-white">
              {plan.professionals} professionals
            </p>
          </li>
          <li className="flex items-center gap-4">
            <span className="rounded-full border border-white/20 bg-white/20 p-1">
              <CheckIcon />
            </span>
            <p className="font-normal text-white">{plan.customers} customers</p>
          </li>
          <li className="flex items-center gap-4">
            <span className="rounded-full border border-white/20 bg-white/20 p-1">
              <CheckIcon />
            </span>
            <p
              className={`font-normal text-white ${
                !plan.agenda && "line-through"
              }`}
            >
              Agenda
            </p>
          </li>
          <li className="flex items-center gap-4">
            <span className="rounded-full border border-white/20 bg-white/20 p-1">
              <CheckIcon />
            </span>
            <p
              className={`font-normal text-white ${
                !plan.businessAdmin && "line-through"
              }`}
            >
              Business Admin
            </p>
          </li>
          <li className="flex items-center gap-4">
            <span className="rounded-full border border-white/20 bg-white/20 p-1">
              <CheckIcon />
            </span>
            <p
              className={`font-normal text-white ${
                !plan.whatsAppIntegration && "line-through"
              }`}
            >
              WhatsApp Integration
            </p>
          </li>
          <li className="flex items-center gap-4">
            <span className="rounded-full border border-white/20 bg-white/20 p-1">
              <CheckIcon />
            </span>
            <p
              className={`font-normal text-white ${
                !plan.appointmentReminders && "line-through"
              }`}
            >
              Appointment Reminders
            </p>
          </li>
        </ul>
      </div>
      <div className="mt-12 p-0 flex justify-center items-center cursor-pointer">
        <Link to={`${process.env.REACT_APP_DASHBOARD_DEV}register`} className="w-full py-2 px-20 text-center bg-white font-semibold text-black hover:scale-[1.02] focus:scale-[1.02] active:scale-100 rounded-md">
          Register
        </Link>
      </div>
    </div>
  );
}

export default SubscriptionCard;
