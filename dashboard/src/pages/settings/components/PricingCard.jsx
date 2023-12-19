import { useState } from 'react';
import { FaCheck, FaTimes } from 'react-icons/fa';

const CardDescription = ({ title, description }) => {	
	return (
		<div className="p-4 mt-7">
			<h2 className="text-2xl text-center text-gray-700 capitalize">{ title }</h2>
			<p className="mt-2 text-gray-500">{ description }</p>
		</div>
	);
};

const CardBilling = ({ price, recurrency }) => {
	return (
		<div className="p-4 border-t border-gray-200 bg-gray-100">
			<p className="text-3xl text-center font-semibold text-gray-700">
				<span className="mr-1">$</span>{ recurrency }<span className="text-gray-500 text-sm"></span>
			</p>
			<p className="mt-2 text-gray-500">
				Billed Anually or	$ { price }/monthly
			</p>
		</div>
	);
};

const CardFeatures = ({ data }) => {	
	return (
		<div className="p-4 border-t border-gray-200">
			<ul className="space-y-2">
				{ 
					data.map((item, index) => {
						return (
							<li key={index} className="flex justify-center items-center space-x-2">
								{/* {item && <FaCheck className="text-green-500" />} */}
								<span>{item}</span>
							</li>
						)
					})
				}
			</ul>
		</div>
	);
};

const CardAction = ({ currentPlan, type, clickMe }) => {
	return (
		<div className="w-full p-4 mt-auto border-t border-gray-200">
			<button
				className={`w-full px-4 py-2 border-2 rounded-md focus:outline-none ${currentPlan === type ? "bg-teal-500 text-white border-teal-500 hover:bg-white hover:text-teal-500 focus:bg-white" : "text-teal-500 border-teal-500 hover:bg-teal-500 hover:text-white focus:bg-teal-500"}`}
				onClick={clickMe}
			>
				{currentPlan === type ? "REPURCHASE" : "SUBSCRIBE NOW"}
			</button>
		</div>
	);
};

const PricingCard = (props) => {	
	const { 
    name,
    price,
    // promotionalPrice,
    annualPrice,
    professionals,
    customers,
    agenda,
    businessAdmin,
    agendaLinkPage,
    whatsAppIntegration,
    appointmentReminders,
    currentPlan,
    clickMe
  } = props;

  const features = [
    `${professionals} professionals`,
    `${customers} customers`,
    agenda ? "Agenda management" : "",
    businessAdmin ? "Business administration" : "",
    agendaLinkPage ? "Reservation page" : "",
    whatsAppIntegration ? "WhatsApp integration" : "",
    appointmentReminders ? "Appointment reminders" : ""
  ];
	return (
		<div className={`relative flex flex-col items-center rounded-lg overflow-hidden border border-t-4 border-teal-500 min-h-[530px]`}>
            { (name === 'professional') ? 
            <span className="most-popular">Most Popular</span> 
            :
             null 
             }
			<CardDescription title={name} description={``} />
			<CardBilling price={price} recurrency={annualPrice} />
			<CardFeatures data={features} />
			<CardAction currentPlan={currentPlan} type={name} clickMe={clickMe} />
		</div>
	);
};

export default PricingCard