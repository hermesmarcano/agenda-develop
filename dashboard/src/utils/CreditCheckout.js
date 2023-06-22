import { Outlet } from "react-router-dom";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe("pk_test_TYooMQauvdEDq54NiTphI7jx");

const CreditCheckout = () => {
  return (
    <>
      <Elements stripe={stripePromise}>
        <Outlet />
      </Elements>
    </>
  );
};

export default CreditCheckout;
