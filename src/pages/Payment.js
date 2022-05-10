import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import React from "react";
import StripeCheckout from "../components/StripeCheckout";
import "../stripe.css";
const promise = loadStripe(process.env.REACT_APP_STRIPE_KEY);
const Payment = () => {
  return (
    <div className="">
      <h4>Complete your purchase</h4>
      <Elements stripe={promise}>
        <div className="col-md-8 offset-md-2">
          <p>Stripe checkout component</p>
          <StripeCheckout />
        </div>
      </Elements>
    </div>
  );
};

export default Payment;
