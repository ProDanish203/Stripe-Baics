import prisma from "@/db/prisma";
import { stripe } from "@/lib/stripe";
import { NextResponse } from "next/server";
import Stripe from "stripe";

const WEBHOOK_SECRET = process.env.NEXT_PUBLIC_STRIPE_WEBHOOK_SECRET!;

export const POST = async (req: Request) => {
  const body = await req.text();

  const sig = req.headers.get("stripe-signature")!;
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, WEBHOOK_SECRET);
  } catch (err: any) {
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed":
        const session = await stripe.checkout.sessions.retrieve(
          (event.data.object as Stripe.Checkout.Session).id,
          {
            expand: ["line_items"],
          }
        );
        const customerId = session.customer as string;

        const customerDetails = session.customer_details;
        const customerEmail = customerDetails?.email as string;

        if (customerEmail) {
          const user = await prisma.user.findUnique({
            where: { email: customerEmail },
          });
          if (!user) throw new Error("User not found");
          if (!user.customerId) {
            await prisma.user.update({
              where: { id: user.id },
              data: { customerId },
            });
          }

          const lineItems = session.line_items?.data || [];
          for (const item of lineItems) {
            const priceId = item.price?.id;
            const isSubscription = item.price?.type === "recurring";
            if (isSubscription) {
              let endDate = new Date();

              if (
                priceId === process.env.NEXT_PUBLIC_STRIPE_STARTER_PRICEID ||
                priceId === process.env.NEXT_PUBLIC_STRIPE_PRO_PRICEID ||
                priceId === process.env.NEXT_PUBLIC_STRIPE_ENTERPRISE_PRICEID
              ) {
                endDate.setFullYear(endDate.getFullYear() + 1);
              } else {
                throw new Error("Invalid priceId");
              }

              await prisma.subsription.upsert({
                where: { userId: user.id! },
                create: {
                  userId: user.id,
                  startDate: new Date(),
                  endDate: endDate,
                  plan:
                    priceId === process.env.NEXT_PUBLIC_STRIPE_STARTER_PRICEID
                      ? "starter"
                      : priceId === process.env.NEXT_PUBLIC_STRIPE_PRO_PRICEID
                      ? "pro"
                      : "enterprise",
                  period: "monthly",
                },
                update: {
                  period: "monthly",
                  endDate: endDate,
                  startDate: new Date(),
                  plan:
                    priceId === process.env.NEXT_PUBLIC_STRIPE_STARTER_PRICEID
                      ? "starter"
                      : priceId === process.env.NEXT_PUBLIC_STRIPE_PRO_PRICEID
                      ? "pro"
                      : "enterprise",
                },
              });

              await prisma.user.update({
                where: { id: user.id },
                data: {
                  plan:
                    priceId === process.env.NEXT_PUBLIC_STRIPE_STARTER_PRICEID
                      ? "starter"
                      : priceId === process.env.NEXT_PUBLIC_STRIPE_PRO_PRICEID
                      ? "pro"
                      : "enterprise",
                },
              });

              return NextResponse.json({
                message: "Subscription created successfully",
                successUrl: "http://localhost:3000/subscription?mode=success",
                status: 200,
              });
            } else {
              // One time purchase
            }
          }
        } else {
          throw new Error("No customer email found");
        }
        break;
      case "customer.subscription.deleted": {
        const subscription = await stripe.subscriptions.retrieve(
          (event.data.object as Stripe.Subscription).id
        );

        const user = await prisma.user.findUnique({
          where: { customerId: subscription.customer as string },
        });

        if (user) {
          await prisma.user.update({
            where: { id: user.id },
            data: {
              plan: "free",
            },
          });
        } else {
          throw new Error("User not found");
        }

        break;
      }

      default:
        console.log(`Unhandle Event Type: ${event.type}`);
    }
  } catch (err: any) {
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }
};
