import { apiError, withAuth, withErrorHandling } from "@/lib/api-helpers";
import { NextRequest, NextResponse } from "next/server";

/**
 * Upload image using Editor.js image tool format
 * POST /api/upload/editorjs
 */
async function uploadEditorJSHandler(
  request: NextRequest,
  { user }: { user: any }
) {
  try {
    const formData = await request.formData();
    const image = formData.get("image") as File;

    if (!image) {
      return apiError("No image uploaded", 400);
    }

    // Forward to main upload handler
    const uploadFormData = new FormData();
    uploadFormData.append("file", image);
    uploadFormData.append("type", "blog");

    const uploadResponse = await fetch(
      new URL("/api/upload", request.url).toString(),
      {
        method: "POST",
        headers: {
          Authorization: request.headers.get("Authorization") || "",
          Cookie: request.headers.get("Cookie") || "",
        },
        body: uploadFormData,
      }
    );

    const result = await uploadResponse.json();

    if (!result.success) {
      return apiError(result.message, uploadResponse.status);
    }

    // Return in Editor.js format (raw) to satisfy Editor.js expectations
    return NextResponse.json(
      {
        success: 1,
        file: {
          url: result.data.url,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Editor.js upload error:", error);
    return NextResponse.json(
      {
        success: 0,
        message: error.message || "Failed to upload image",
      },
      { status: 500 }
    );
  }
}

export const POST = withAuth(withErrorHandling(uploadEditorJSHandler));
