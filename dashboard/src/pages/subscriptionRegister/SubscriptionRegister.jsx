import React, { useState } from 'react';
// import the icons from react-icons
import { FaCheck } from 'react-icons/fa';

const SubscriptionRegister = () => {
  const [step, setStep] = useState(1);
  const [subscriptionType, setSubscriptionType] = useState(null);
  const subscriptions = [
    { type: 'Basic', price: 10, features: ['Feature 1', 'Feature 2'] },
    { type: 'Premium', price: 20, features: ['Feature 1', 'Feature 2', 'Feature 3'] },
    { type: 'Ultimate', price: 30, features: ['Feature 1', 'Feature 2', 'Feature 3', 'Feature 4'] },
  ];

  const handleSubscriptionSelect = (subscription) => {
    setSubscriptionType(subscription);
    setStep(2);
  };

  const handlePayment = () => {
    // handle payment logic here
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {step === 1 ? (
        <div>
          <h2 className="text-3xl font-bold text-center mb-4">Select a Subscription</h2>
          <div className="flex flex-wrap justify-center">
            {subscriptions.map((subscription, index) => (
              // add some tailwind classes for styling the cards
              <div
                key={index}
                className="max-w-sm rounded overflow-hidden shadow-lg m-4 p-4 bg-white"
              >
                <h3 className="text-xl font-semibold text-center mb-2">{subscription.type}</h3>
                <p className="text-lg font-medium text-center mb-4">
                  Price: {subscription.price}
                </p>
                <ul className="list-none mb-4">
                  {subscription.features.map((feature, index) => (
                    // use the react icon component to display a check mark
                    <li key={index} className="flex items-center mb-2">
                      <FaCheck className="text-green-500 mr-2" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => handleSubscriptionSelect(subscription)}
                  className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                  Select
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div>
          <h2 className="text-3xl font-bold text-center mb-4">Subscription Details</h2>
          <p className="text-lg font-medium text-center mb-2">
            Type: {subscriptionType.type}
          </p>
          <p className="text-lg font-medium text-center mb-4">
            Price: {subscriptionType.price}
          </p>
          <ul className="list-none mb-4">
            {subscriptionType.features.map((feature, index) => (
              <li key={index} className="flex items-center mb-2 justify-center">
                <FaCheck className="text-green-500 mr-2" />
                {feature}
              </li>
            ))}
          </ul>
          <button
            onClick={handlePayment}
            className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Proceed to Payment
          </button>
        </div>
      )}
    </div>
  );
};

export default SubscriptionRegister;
