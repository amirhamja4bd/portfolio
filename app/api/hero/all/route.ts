import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Hero from "@/lib/models/Hero";

// GET - Fetch all hero sections (for admin panel)
export async function GET() {
  try {
    await connectDB();

    const heroes = await Hero.find({}).sort({ updatedAt: -1 });

    return NextResponse.json({
      success: true,
      count: heroes.length,
      data: heroes,
    });
  } catch (error) {
    console.error("Error fetching all heroes:", error);
    return NextResponse.json(
      { error: "Failed to fetch hero sections" },
      { status: 500 }
    );
  }
}
