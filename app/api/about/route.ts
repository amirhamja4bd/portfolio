import connectDB from "@/lib/db";
import About from "@/lib/models/About";
import { NextRequest, NextResponse } from "next/server";

// GET - Fetch about data
export async function GET() {
  try {
    await connectDB();

    // Get the published about section (there should typically be only one)
    const about = await About.findOne({ published: true }).sort({
      updatedAt: -1,
    });

    if (!about) {
      return NextResponse.json(
        { error: "About section not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: about,
    });
  } catch (error) {
    console.error("Error fetching about:", error);
    return NextResponse.json(
      { error: "Failed to fetch about section" },
      { status: 500 }
    );
  }
}

// POST - Create new about section
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();

    // Validate required fields
    if (!body.title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    if (!body.description) {
      return NextResponse.json(
        { error: "Description is required" },
        { status: 400 }
      );
    }

    // If this is set to published, unpublish all others
    if (body.published) {
      await About.updateMany({}, { published: false });
    }

    const about = await About.create(body);

    return NextResponse.json(
      {
        success: true,
        message: "About section created successfully",
        data: about,
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error("Error creating about:", error);
    if (error instanceof Error && error.name === "ValidationError") {
      return NextResponse.json(
        { error: "Validation error", details: error.message },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Failed to create about section" },
      { status: 500 }
    );
  }
}

// PUT - Update about section
export async function PUT(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json(
        { error: "About ID is required" },
        { status: 400 }
      );
    }

    // If this is set to published, unpublish all others
    if (updateData.published) {
      await About.updateMany({ _id: { $ne: id } }, { published: false });
    }

    const about = await About.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!about) {
      return NextResponse.json(
        { error: "About section not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "About section updated successfully",
      data: about,
    });
  } catch (error: unknown) {
    console.error("Error updating about:", error);
    if (error instanceof Error && error.name === "ValidationError") {
      return NextResponse.json(
        { error: "Validation error", details: error.message },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Failed to update about section" },
      { status: 500 }
    );
  }
}

// DELETE - Delete about section
export async function DELETE(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "About ID is required" },
        { status: 400 }
      );
    }

    const about = await About.findByIdAndDelete(id);

    if (!about) {
      return NextResponse.json(
        { error: "About section not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "About section deleted successfully",
      data: about,
    });
  } catch (error) {
    console.error("Error deleting about:", error);
    return NextResponse.json(
      { error: "Failed to delete about section" },
      { status: 500 }
    );
  }
}
