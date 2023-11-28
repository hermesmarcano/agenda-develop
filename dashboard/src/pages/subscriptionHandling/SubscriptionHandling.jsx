import React, { useEffect, useState } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import {
  useStripe,
  useElements,
  PaymentElement,
  LinkAuthenticationElement,
} from '@stripe/react-stripe-js';
import { FaRegCreditCard, FaHome } from 'react-icons/fa';
import 'tailwindcss/tailwind.css';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_API_KEY);

const SubscriptionHandling = () => {
  const [step, setStep] = useState(1);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [clientSecret, setClientSecret] = useState(null);

  useEffect(() => {
    fetch('http://localhost:4040/create-payment-intent')
      .then((response) => response.json())
      .then((data) => setClientSecret(data.clientSecret));
  }, []);

  const nextStep = () => {
    setStep(step + 1);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="p-4 bg-white rounded shadow-md w-96">
        <h2 className="text-2xl font-bold mb-4">Subscription</h2>
        {step === 1 && <SubscriptionForm onNext={nextStep} />}
        {step === 2 && (
          <Elements stripe={stripePromise} options={{ clientSecret }}>
            <CheckoutForm
              onNext={nextStep}
              onPaymentStatus={setPaymentStatus}
            />
          </Elements>
        )}
        {step === 3 && <PaymentStatus status={paymentStatus} />}
      </div>
    </div>
  );
};

const SubscriptionForm = ({ onNext }) => {
  // Add your form handling logic here
  return (
    <form onSubmit={onNext} className="flex flex-col">
      {/* Add your form fields here */}
      <button
        type="submit"
        className="mt-4 w-full py-2 px-4 bg-teal-600 text-white rounded flex items-center justify-center"
      >
        Next <FaRegCreditCard className="inline ml-2" />
      </button>
    </form>
  );
};

const CheckoutForm = ({ onNext, onPaymentStatus }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const [clientSecret, setClientSecret] = useState(null);

  useEffect(() => {
    fetch('http://localhost:4040/create-payment-intent')
      .then((response) => response.json())
      .then((data) => setClientSecret(data.clientSecret));
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements || !clientSecret) {
      return;
    }

    setIsLoading(true);

    const result = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: 'https://example.com/order/123/complete',
        payment_method_data: {
          billing_details: {
            name: 'Your Customer Name',
          },
        },
        amount:
          (Number(localStorage.getItem('ag_subscription_amount')) || 50) * 100,
        currency: 'usd',
      },
    });

    if (result.error) {
      console.log(result.error.message);
      onPaymentStatus('failed');
    } else {
      onPaymentStatus('succeeded');
    }

    setIsLoading(false);
    onNext();
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col">
      <LinkAuthenticationElement id="link-authentication-element" />
      <PaymentElement id="payment-element" />
      <button
        disabled={isLoading || !stripe || !elements}
        id="submit"
        className="mt-4 w-full py-2 px-4 bg-teal-600 text-white rounded flex items-center justify-center"
      >
        {isLoading ? <div className="spinner" id="spinner"></div> : 'Pay now'}
      </button>
    </form>
  );
};

const PaymentStatus = ({ status }) => {
  return (
    <div className="flex flex-col items-center">
      {status === 'succeeded' && (
        <div className="text-green-600">
          <h3 className="text-xl font-semibold mb-2">
            Payment completed successfully!
          </h3>
          <p className="text-sm">Your subscription has been activated.</p>
        </div>
      )}
      {status === 'failed' && (
        <div className="text-red-600">
          <h3 className="text-xl font-semibold mb-2">Payment failed.</h3>
          <p className="text-sm">Please try again.</p>
        </div>
      )}
      <button className="mt-4 w-full py-2 px-4 bg-teal-600 text-white rounded flex items-center justify-center" onClick={() => (window.location.href = '/')}>
        Go to Home <FaHome className="inline ml-2" />
      </button>
    </div>
  );
};

export default SubscriptionHandling;
