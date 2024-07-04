import { CheckCircle, XCircle } from "lucide-react";
import React from "react";

const PaymentSuccesPage = ({
  searchParams,
}: {
  searchParams: { mode: string };
}) => {
  const { mode } = searchParams;
  return (
    <section className="min-h-screen flex items-center justify-center -mt-20">
      <div className="bg-white shadow-xl rounded-lg p-10 flex flex-col item-center">
        {mode === "success" ? (
          <CheckCircle className="text-green-600 size-16 text-center mx-auto" />
        ) : (
          <XCircle className="text-red-600 size-16 text-center mx-auto" />
        )}
        <p className="text-lg font-semibold mt-5">
          {mode === "success" ? "Payment Successful" : "Payment Failed"}
        </p>
      </div>
    </section>
  );
};

export default PaymentSuccesPage;
