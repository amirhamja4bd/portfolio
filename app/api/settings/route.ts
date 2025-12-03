import connectDB from "@/lib/db";
import Settings from "@/lib/models/Settings";
import { NextRequest, NextResponse } from "next/server";

// GET - Fetch settings data
export async function GET() {
  try {
    await connectDB();

    // Get or create settings (singleton pattern)
    let settings = await Settings.findOne();

    if (!settings) {
      settings = await Settings.create({
        socialAccounts: [],
        resumes: [],
      });
    }

    return NextResponse.json({
      success: true,
      data: settings,
    });
  } catch (error) {
    console.error("Error fetching settings:", error);
    return NextResponse.json(
      { error: "Failed to fetch settings" },
      { status: 500 }
    );
  }
}

// POST - Create or update settings
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();

    // Validate social accounts
    if (body.socialAccounts) {
      for (const account of body.socialAccounts) {
        if (!account.name || !account.url || account.order === undefined) {
          return NextResponse.json(
            {
              error:
                "Each social account must have name, url, and order fields",
            },
            { status: 400 }
          );
        }
      }

      // Sort by order
      body.socialAccounts.sort((a: any, b: any) => a.order - b.order);
    }

    // Validate resumes
    if (body.resumes) {
      for (const resume of body.resumes) {
        if (!resume.name || !resume.resumeUrl) {
          return NextResponse.json(
            { error: "Each resume must have name and resumeUrl fields" },
            { status: 400 }
          );
        }
      }

      // Ensure only one primary resume
      const primaryCount = body.resumes.filter((r: any) => r.isPrimary).length;
      if (primaryCount > 1) {
        return NextResponse.json(
          { error: "Only one resume can be marked as primary" },
          { status: 400 }
        );
      }
    }

    // Find and update settings, or create if it doesn't exist
    let settings = await Settings.findOne();

    if (settings) {
      // Update existing settings
      if (body.socialAccounts !== undefined) {
        settings.socialAccounts = body.socialAccounts;
      }
      if (body.resumes !== undefined) {
        settings.resumes = body.resumes;
      }
      await settings.save();
    } else {
      // Create new settings
      settings = await Settings.create({
        socialAccounts: body.socialAccounts || [],
        resumes: body.resumes || [],
      });
    }

    return NextResponse.json({
      success: true,
      message: "Settings updated successfully",
      data: settings,
    });
  } catch (error) {
    console.error("Error updating settings:", error);
    return NextResponse.json(
      { error: "Failed to update settings" },
      { status: 500 }
    );
  }
}

// PUT - Update settings (alias for POST for compatibility)
export async function PUT(request: NextRequest) {
  return POST(request);
}
