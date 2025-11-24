import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Hero from "@/lib/models/Hero";

type RouteParams = {
  params: Promise<{
    id: string;
  }>;
};

// GET - Fetch single hero by ID
export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    await connectDB();

    const { id } = await params;

    const hero = await Hero.findById(id);

    if (!hero) {
      return NextResponse.json(
        { error: "Hero section not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: hero,
    });
  } catch (error) {
    console.error("Error fetching hero:", error);
    return NextResponse.json(
      { error: "Failed to fetch hero section" },
      { status: 500 }
    );
  }
}
