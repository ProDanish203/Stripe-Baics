"use client";
import { CheckoutPage } from "@/components/CheckoutPage";
import { convertToSubcurrency } from "@/lib/utils";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import React from "react";

if (process.env.NEXT_PUBLIC_STRIPE_PUBLIC_kEY === undefined)
  throw new Error("Missing Stripe public key");

// const stripePromise = loadStripe(
//   `${process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY}`
// );
const stripePromise = loadStripe(
  "pk_test_51OsPELCXnnkcNgqqHCrGJn8yNCVepSSkWppZ6Ptpjx58zWaz6qVUIIgPrmj3yckAgQX0GYB1gSfdZcyrhrPc0JWj00b8ZkRc5t"
);

const StripePayment = () => {
  console.log(stripePromise);
  const amount = 10.0;
  return (
    <section className="min-h-screen flex items-center justify-center -mt-20">
      <div className="flex flex-col items-center justify-center max-w-5xl rounded-lg bg-white shadow-lg border border-secondaryCol p-10 w-full text-secondaryCol min-h-80">
        <div className="mb-10">
          <h2 className="text-5xl font-bold mb-2">Danish</h2>
          <p className="text-lg font-semibold">Has requrestd: ${amount}</p>
        </div>

        <Elements
          stripe={stripePromise}
          options={{
            mode: "payment",
            amount: convertToSubcurrency(amount),
            currency: "usd",
          }}
        >
          <CheckoutPage amount={amount} />
        </Elements>
      </div>
    </section>
  );
};

export default StripePayment;
