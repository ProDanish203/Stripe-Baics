"use client";
import React from "react";
import { motion } from "framer-motion";
import WordPullUp from "../ui/word-pull-up";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";

interface PriceCardProps {
  title: string;
  desc: string;
  price: string;
  features: {
    included: boolean;
    name: string;
  }[];
  delay: number;
  paymentLink: string | undefined;
}

const PriceCard = ({
  title,
  desc,
  price,
  features,
  delay,
  paymentLink,
}: PriceCardProps) => {
  const router = useRouter();
  const { user } = useKindeBrowserClient();
  const handlePaymentRoute = () => {
    if (!user) return toast.error("Please login to your acccount first");
    paymentLink
      ? router.push(paymentLink + `?prefilled_email=${user.email}`)
      : toast.error("Something went wrong");
    return;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: delay, duration: 1, type: "spring" }}
      className="divide-y divide-gray-200 rounded-2xl border border-gray-200 shadow-sm"
    >
      <div className="p-6 sm:px-8">
        <h2 className="text-lg font-medium text-gray-900">
          {title}
          <span className="sr-only">Plan</span>
        </h2>

        <p className="mt-2 text-gray-700">{desc}</p>

        <p className="mt-2 sm:mt-4">
          <strong className="text-3xl font-bold text-gray-900 sm:text-4xl">
            {" "}
            {price}${" "}
          </strong>

          <span className="text-sm font-medium text-gray-700">/month</span>
        </p>
        <button
          onClick={handlePaymentRoute}
          className="group relative inline-flex w-full h-12 mt-5 items-center justify-center overflow-hidden rounded-md border border-neutral-200 px-6 font-medium text-text bg-primaryCol transition-all duration-100 [box-shadow:5px_5px_rgb(235_220_255)] active:translate-x-[3px] active:translate-y-[3px] active:[box-shadow:0px_0px_rgb(235_233_252)]"
        >
          Get Started
        </button>
      </div>

      <div className="p-6 sm:px-8">
        <p className="text-lg font-medium text-gray-900 sm:text-xl">
          What&apos;s included:
        </p>

        <ul className="mt-2 space-y-2 sm:mt-4">
          {features.map((feature) => (
            <li key={feature.name} className="flex items-center gap-1">
              {feature.included ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="size-5 text-indigo-700"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.5 12.75l6 6 9-13.5"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="size-5 text-red-700"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              )}

              <span className="text-gray-700"> {feature.name} </span>
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
};

export const Pricing = () => {
  return (
    <div className="max-w-screen-xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
      <div className="mx-auto">
        <WordPullUp
          words="Unlock Full Potential"
          className="text-4xl font-bold"
        />
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 1, type: "spring" }}
          className="text-center text-neutral-700 max-w-2xl mx-auto mt-4"
        >
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Repellat
          nobis maiores cumque enim aut quo inventore doloribus fugiat id nihil.
        </motion.p>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:items-stretch lg:grid-cols-3 md:gap-8 mt-10">
        <PriceCard
          title="Starter"
          price="30"
          features={[
            { included: true, name: "10 users" },
            { included: true, name: "2GB of storage" },
            { included: true, name: "Email support" },
            { included: false, name: "Help center access" },
            { included: false, name: "Phone support" },
            { included: false, name: "Community Access" },
          ]}
          desc="Lorem ipsum dolor sit amet consectetur adipisicing elit. Incidunt, omnis!"
          delay={0.3}
          paymentLink={process.env.NEXT_PUBLIC_STRIPE_STARTER_LINK}
        />

        <PriceCard
          title="Pro"
          price="50"
          features={[
            { included: true, name: "10 users" },
            { included: true, name: "2GB of storage" },
            { included: true, name: "Email support" },
            { included: true, name: "Help center access" },
            { included: false, name: "Phone support" },
            { included: false, name: "Community Access" },
          ]}
          desc="Lorem ipsum dolor sit amet consectetur adipisicing elit. Incidunt, omnis!"
          delay={0.5}
          paymentLink={process.env.NEXT_PUBLIC_STRIPE_PRO_LINK}
        />

        <PriceCard
          title="Enterprise"
          price="80"
          features={[
            { included: true, name: "10 users" },
            { included: true, name: "2GB of storage" },
            { included: true, name: "Email support" },
            { included: true, name: "Help center access" },
            { included: true, name: "Phone support" },
            { included: true, name: "Community Access" },
          ]}
          desc="Lorem ipsum dolor sit amet consectetur adipisicing elit. Incidunt, omnis!"
          delay={0.7}
          paymentLink={process.env.NEXT_PUBLIC_STRIPE_ENTERPRISE_LINK}
        />
      </div>
    </div>
  );
};
