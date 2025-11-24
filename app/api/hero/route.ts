import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Hero from "@/lib/models/Hero";

// GET - Fetch hero data
export async function GET() {
  try {
    await connectDB();

    // Get the published hero section (there should typically be only one)
    const hero = await Hero.findOne({ published: true }).sort({
      updatedAt: -1,
    });

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

// POST - Create new hero section
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();

    // Validate required fields
    if (!body.badge?.text) {
      return NextResponse.json(
        { error: "Badge text is required" },
        { status: 400 }
      );
    }

    if (!body.heading?.name || !body.heading?.title) {
      return NextResponse.json(
        { error: "Name and title are required" },
        { status: 400 }
      );
    }

    // If this is set to published, unpublish all others
    if (body.published) {
      await Hero.updateMany({}, { published: false });
    }

    const hero = await Hero.create(body);

    return NextResponse.json(
      {
        success: true,
        message: "Hero section created successfully",
        data: hero,
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error("Error creating hero:", error);
    if (error instanceof Error && error.name === "ValidationError") {
      return NextResponse.json(
        { error: "Validation error", details: error.message },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Failed to create hero section" },
      { status: 500 }
    );
  }
}

// PUT - Update hero section
export async function PUT(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json({ error: "Hero ID is required" }, { status: 400 });
    }

    // If this is set to published, unpublish all others
    if (updateData.published) {
      await Hero.updateMany({ _id: { $ne: id } }, { published: false });
    }

    const hero = await Hero.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!hero) {
      return NextResponse.json(
        { error: "Hero section not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Hero section updated successfully",
      data: hero,
    });
  } catch (error: unknown) {
    console.error("Error updating hero:", error);
    if (error instanceof Error && error.name === "ValidationError") {
      return NextResponse.json(
        { error: "Validation error", details: error.message },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Failed to update hero section" },
      { status: 500 }
    );
  }
}

// DELETE - Delete hero section
export async function DELETE(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Hero ID is required" }, { status: 400 });
    }

    const hero = await Hero.findByIdAndDelete(id);

    if (!hero) {
      return NextResponse.json(
        { error: "Hero section not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Hero section deleted successfully",
      data: hero,
    });
  } catch (error) {
    console.error("Error deleting hero:", error);
    return NextResponse.json(
      { error: "Failed to delete hero section" },
      { status: 500 }
    );
  }
}
