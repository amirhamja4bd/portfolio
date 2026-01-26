import connectDB from "@/lib/db";
import { Subscriber } from "@/lib/models";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    await connectDB();
    const { email } = await req.json();

    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      return NextResponse.json(
        { error: "Please provide a valid email address" },
        { status: 400 },
      );
    }

    const headersList = await headers();
    const ip =
      headersList.get("x-forwarded-for") || headersList.get("x-real-ip");
    const userAgent = headersList.get("user-agent");

    // Check if subscriber exists
    const existingSubscriber = await Subscriber.findOne({ email });

    if (existingSubscriber) {
      if (existingSubscriber.isActive) {
        return NextResponse.json(
          { message: "You are already subscribed to our newsletter." },
          { status: 400 }, // Or 200 depending on preference, but 400 signals condition
        );
      } else {
        // Reactivate subscription
        existingSubscriber.isActive = true;
        existingSubscriber.ip = ip || undefined;
        existingSubscriber.userAgent = userAgent || undefined;
        await existingSubscriber.save();
        return NextResponse.json(
          { message: "Welcome back! Your subscription has been reactivated." },
          { status: 200 },
        );
      }
    }

    // Create new subscriber
    await Subscriber.create({
      email,
      ip,
      userAgent,
    });

    return NextResponse.json(
      { message: "Thank you for subscribing to our newsletter!" },
      { status: 201 },
    );
  } catch (error) {
    console.error("Subscription error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again later." },
      { status: 500 },
    );
  }
}
